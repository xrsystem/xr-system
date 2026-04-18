import axios from 'axios';
import logger from '../config/logger.js';

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      logger.warn("⚠️ Brevo API Key missing in .env file. Email sending skipped.");
      return false;
    }

    const emailData = {
      sender: { 
        name: process.env.SENDER_NAME || "XR System", 
        email: process.env.SENDER_EMAIL || "support@xrsystem.in" 
      }, 
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      replyTo: { 
        name: process.env.SENDER_NAME || "XR System", 
        email: process.env.SENDER_EMAIL || "support@xrsystem.in" 
      }
    };

    await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });

    logger.info(`📧 API Email successfully sent to ${to} 🚀`);
    return true;
  } catch (error) {
    logger.error(`🔴 API Email Failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
};

export const sendPortalLink = async (to, name, notionUrl) => {
  const subject = "Your XR System Project Dashboard Link 🚀";
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2 style="color: #4F46E5; border-bottom: 2px solid #e0e7ff; padding-bottom: 10px;">Welcome Back, ${name}! 👋</h2>
      <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        You can access your private project workspace and track all progress using the secure link below:
      </p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${notionUrl}" target="_blank" style="background-color: #4F46E5; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">
          Open My Dashboard
        </a>
      </div>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #4F46E5;">
        <p style="margin: 0; color: #475569; font-size: 14px;">
          <strong>Security Note:</strong> This is a unique private link. Please do not share it with anyone outside your team.
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">XR System • Digital Solutions & Transparency</p>
    </div>
  `;
  return await sendEmail(to, subject, htmlContent);
};