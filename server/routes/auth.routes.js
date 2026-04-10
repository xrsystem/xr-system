import express from 'express';
import jwt from 'jsonwebtoken';
import Lead from '../models/Lead.js';
import { sendPortalLink } from '../services/email.service.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    
    const token = jwt.sign(
      { role: 'admin', email: email }, 
      process.env.JWT_ACCESS_SECRET, 
      { expiresIn: '7d' } 
    );
    
    return res.status(200).json({ 
      message: "Welcome Admin!", 
      token: token 
    });

  } else {
    return res.status(401).json({ message: "Invalid email or password. Access Denied." });
  }
});

router.post('/portal-login', async (req, res) => {
  try {
    const { email } = req.body;

    const client = await Lead.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });

    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Email not found. Please ensure you've submitted a project request." 
      });
    }

    const notionUrl = client.notionPageId 
      ? `https://notion.so/${client.notionPageId.replace(/-/g, '')}` 
      : null;

    if (!notionUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "Dashboard is being prepared. Please check back in 1-2 hours." 
      });
    }

    const emailSent = await sendPortalLink(client.email, client.name, notionUrl);

    if (emailSent) {
      res.status(200).json({ success: true, message: " link sent to your email!" });
    } else {
      throw new Error("Email service failed");
    }

  } catch (error) {
    console.error("🔴 Portal Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error. Please try again." });
  }
});

export default router;