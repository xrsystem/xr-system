import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import Lead from '../models/Lead.js';
import { sendPortalLink } from '../services/email.service.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});

router.post('/login', loginLimiter, [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (email !== process.env.ADMIN_EMAIL || !isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
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