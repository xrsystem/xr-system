import express from 'express';
import Career from '../models/Career.js';
import { sendEmail } from '../services/email.service.js';
import { addCandidateToNotion } from '../services/notion.service.js'; 
import { createJob, getJobs, toggleJobStatus, deleteJob, updateJob } from '../controllers/career.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, whatsapp, linkedin, portfolioUrl, resumeUrl, message, role } = req.body;

    const newApplication = new Career({
      name, email, whatsapp, linkedin, portfolioUrl, resumeUrl, message, role
    });
    await newApplication.save();

    try {
      const adminEmailSubject = ` NEW CANDIDATE: ${name} applied for ${role}`;
      const adminEmailHtml = `
        <h2>New Job Application Received</h2>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>LinkedIn:</strong> ${linkedin ? `<a href="${linkedin}">View Profile</a>` : 'Not provided'}</p>
        <p><strong>Portfolio:</strong> ${portfolioUrl ? `<a href="${portfolioUrl}">View Portfolio</a>` : 'Not provided'}</p>
        <p><strong>Resume PDF:</strong> <a href="${resumeUrl}">Download / View PDF</a></p>
        <br/>
        <p><strong>Pitch / Message:</strong><br/> ${message || 'No message provided.'}</p>
      `;
      
      const candidateEmailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #ffffff;">
          <h2 style="color: #4F46E5; margin-top: 0; border-bottom: 2px solid #e0e7ff; padding-bottom: 10px;">Application Received! 🎉</h2>
          <p style="color: #334155; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Thank you for choosing <strong>XR System</strong>. We have successfully received your application for the <strong>${role}</strong> position.
          </p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4F46E5;">
            <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">📋 What happens next?</p>
            <p style="margin: 10px 0 0 0; color: #475569; font-size: 15px; line-height: 1.6;">
              Our hiring team is currently reviewing your application, portfolio, and resume. 
              If your profile matches our current requirements, our team will reach out to you very soon via Email or WhatsApp to schedule the next steps.
            </p>
          </div>
          <p style="color: #334155; font-size: 16px;">We appreciate your interest in joining us and wish you the best!</p>
          <br/>
          <p style="color: #334155; font-size: 16px; margin-bottom: 5px;">Best Regards,</p>
          <p style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0;">XR System Hiring Team</p>
        </div>
      `;
      
      await sendEmail(email, `Application Received: ${role} at XR System`, candidateEmailHtml);
      await sendEmail(process.env.SMTP_USER, adminEmailSubject, adminEmailHtml);
    } catch (emailErr) {
      console.error("⚠️ Email Service Failed, but application saved:", emailErr.message);
    }

    try {
      await addCandidateToNotion({
        name, 
        role, 
        email, 
        whatsapp, 
        linkedin: linkedin || undefined,
        portfolioUrl: portfolioUrl || undefined, 
        resumeUrl, 
        message: message || undefined
      });
    } catch (notionErr) {
      console.error("⚠️ Notion Sync Failed, but application saved:", notionErr.message);
    }

    res.status(201).json({ success: true, message: 'Application received successfully!' });

  } catch (error) {
    console.error("🔴 Fatal Database Error:", error.message);
    res.status(500).json({ success: false, message: 'Database Error. Please check backend logs.' });
  }
});

router.get('/jobs', getJobs);
router.post('/jobs', protectAdmin, createJob);
router.patch('/jobs/:id/status', protectAdmin, toggleJobStatus);
router.delete('/jobs/:id', protectAdmin, deleteJob);
router.put('/jobs/:id', protectAdmin, updateJob);

export default router;