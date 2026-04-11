import Razorpay from 'razorpay';
import logger from '../config/logger.js';
import dotenv from 'dotenv';
import { sendEmail } from './email.service.js'; 

dotenv.config();

const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

export const createInvoicePaymentLink = async (lead, amountToPay, invoiceType) => {
  try {
    const razorpay = getRazorpay(); 
    
    const referenceId = `INV_${lead._id.toString().slice(-6)}_${Date.now()}`;
    
    const paymentLinkRequest = {
      amount: Math.round(amountToPay * 100), 
      currency: "INR",
      accept_partial: false,
      description: `${invoiceType} for ${lead.service}`,
      customer: {
        name: lead.name,
        email: lead.email,
        contact: lead.whatsapp || "9999999999" 
      },
      notify: { sms: false, email: false }, 
      reminder_enable: true,
      reference_id: referenceId,
      callback_url: "https://xrsystem.in/payment-success", 
      callback_method: "get"
    };

    const link = await razorpay.paymentLink.create(paymentLinkRequest);
    return link.short_url;
  } catch (error) {
    const errorMsg = error?.error?.description || error.message || "Unknown Razorpay Error";
    console.error(`❌ Razorpay Error: ${errorMsg}`);
    logger.error(`Razorpay Error: ${errorMsg}`);
    return null;
  }
};

export const sendInvoiceEmail = async (lead, invoiceType, paymentLink, dynamicInvoiceUrl, amountToPay, totalValue) => {
  try {
    const finalTotal = totalValue || lead.price;
    const finalDue = amountToPay || lead.price;

    const subject = `Your ${invoiceType} from XR System`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #4f46e5;">XR System</h2>
        <p>Hi <b>${lead.name}</b>,</p>
        <p>Here is your <b>${invoiceType}</b> for the project: <i>${lead.service}</i>.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><b>Total Project Value:</b> ₹${Number(finalTotal).toLocaleString()}</p>
        </div>

        <p>You can securely view your dynamic invoice and track payment status here:</p>
        <a href="${dynamicInvoiceUrl}" style="display: inline-block; background: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">📄 View Invoice</a>
        
        ${paymentLink ? `
          <p style="margin-top: 25px;">To proceed, please complete the payment using the secure link below:</p>
          <a href="${paymentLink}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">💳 Pay Now (₹${Number(finalDue).toLocaleString()})</a>
        ` : ''}

        <p style="margin-top: 30px; font-size: 12px; color: #64748b;">If you have any questions, simply reply to this email.</p>
        <p style="font-size: 12px; color: #64748b;">Thanks, <br>Team XR System</p>
      </div>
    `;

    await sendEmail(lead.email, subject, htmlContent);
    return true;
  } catch (error) {
    console.error(`❌ Email Error: ${error.message}`);
    logger.error(`Email Error: ${error.message}`);
    return false;
  }
};