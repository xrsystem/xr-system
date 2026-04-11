import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn("⚠️ Email credentials missing in .env file. Email sending skipped.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"XR System" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email successfully sent to ${to} (ID: ${info.messageId})`);
    return true;
  } catch (error) {
    logger.error(`🔴 Failed to send email to ${to}. Error: ${error.message}`);
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
    </div>
  `;
  return await sendEmail(to, subject, htmlContent);
};