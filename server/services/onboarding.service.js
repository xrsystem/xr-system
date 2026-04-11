import { Client } from '@notionhq/client';
import logger from '../config/logger.js';
// ✅ THE FIX: Humara naya Brevo wala function import kar liya
import { sendEmail } from './email.service.js'; 

export const sendClientConfirmation = async (lead) => {
  try {
    const isGeneralInquiry = lead.service === 'General Inquiry';
    const introText = isGeneralInquiry
      ? `Thank you for reaching out to <strong>XR System</strong>. We have successfully received your inquiry.`
      : `Thank you for choosing <strong>XR System</strong>. We have successfully received your request for the <strong>${lead.service}</strong> plan.`;

    const subjectText = isGeneralInquiry 
      ? `Inquiry Received - XR System ` 
      : `Request Received: ${lead.service} - XR System`;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #ffffff;">
        <h2 style="color: #4F46E5; margin-top: 0; border-bottom: 2px solid #e0e7ff; padding-bottom: 10px;">
          ${isGeneralInquiry ? 'Inquiry Received! 👋' : 'Request Received Successfully! 🎉'}
        </h2>
        <p style="color: #64748b; font-size: 13px; margin-top: -5px;">Reference: ${lead._id}</p>
        <p style="color: #334155; font-size: 16px;">Hi <strong>${lead.name}</strong>,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          ${introText}
        </p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4F46E5;">
          <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">📋 What happens next?</p>
          <p style="margin: 10px 0 0 0; color: #475569; font-size: 15px; line-height: 1.6;">
            Our team is currently reviewing your project details. We will reach out to you on your WhatsApp number <strong>(${lead.whatsapp})</strong> within the next 2-4 hours to discuss the next steps.
          </p>
        </div>
        <p style="color: #334155; font-size: 16px;">We look forward to connecting with you!</p>
        <br/>
        <p style="color: #334155; font-size: 16px; margin-bottom: 5px;">Best Regards,</p>
        <p style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0;">
          JS Mahato<br/>
          <span style="color: #64748b; font-size: 14px; font-weight: normal;">Founder, XR System</span>
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="font-size: 12px; color: #94a3b8;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    // ✅ Naya API function use karke bhej rahe hain
    await sendEmail(lead.email, subjectText, htmlContent);
    return true;
  } catch (error) {
    logger.error(`Error sending email to ${lead.email}: ${error.message}`);
    return false;
  }
};


export const sendAdminNotification = async (lead) => {
  try {
    const subjectText = `✨ NEW LEAD: ${lead.service} - ${lead.name}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
        <h2 style="color: #ef4444; margin-top: 0; border-bottom: 2px solid #ef4444; padding-bottom: 10px;"> New Lead Alert</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight: bold;">WhatsApp</td>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">
              <a href="https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}" style="color: #2563eb; text-decoration: none;">${lead.whatsapp}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight: bold;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">
              <a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight: bold;">Business</td>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">${lead.businessName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight: bold;">Website</td>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1;">${lead.websiteUrl || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight: bold;">Package</td>
            <td style="padding: 10px; border-bottom: 1px solid #cbd5e1; background-color: #fef3c7; font-weight: bold; color: #b45309;">${lead.service}</td>
          </tr>
        </table>
        
        <h3 style="margin-top: 20px; color: #334155;">Project Brief:</h3>
        <p style="background-color: #ffffff; padding: 15px; border: 1px solid #cbd5e1; border-radius: 6px; color: #475569;">
          ${lead.message}
        </p>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px;">
          XR System Automated Alert • Database ID: ${lead._id}
        </p>
      </div>
    `;

    // ✅ Naya API function use karke Admin ko bhej rahe hain
    await sendEmail(process.env.SMTP_USER, subjectText, htmlContent);
    return true;
  } catch (error) {
    logger.error(`Error sending admin notification: ${error.message}`);
    return false;
  }
};

export const createNotionDashboard = async (lead) => {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      logger.warn('Notion credentials missing. Skipping dashboard creation.');
      return null;
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_DATABASE_ID;

    const safeName = String(lead.name || "Unknown Lead");
    const safeService = String(lead.service || "No Service");
    const safeWhatsapp = String(lead.whatsapp || "No Number");
    const safeEmail = String(lead.email || "No Email");
    const safeBusiness = String(lead.businessName || "N/A");
    const safeMessage = String(lead.message || "No Message Provided");

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Name": { 
          title: [
            { text: { content: `${safeName} - ${safeService}` } }
          ]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [{ text: { content: '📋 Client Details' } }] }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { text: { content: "WhatsApp: " }, annotations: { bold: true } },
              { text: { content: safeWhatsapp } }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { text: { content: "Email: " }, annotations: { bold: true } },
              { text: { content: safeEmail } }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { text: { content: "Business: " }, annotations: { bold: true } },
              { text: { content: safeBusiness } }
            ]
          }
        },
        {
          object: 'block',
          type: 'divider',
          divider: {}
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [{ text: { content: '🎯 Project Requirements' } }] }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: safeMessage } }]
          }
        }
      ]
    });

    logger.info(`Notion Dashboard created for ${safeName}`);
    return response.id; 
  } catch (error) {
    logger.error(`🔴 NOTION API ERROR DETAILS: ${error.message}`);
    return null;
  }
};

export const generatePaymentLink = async (lead, amount) => { return null; };