import Lead from '../models/Lead.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import * as onboardingService from '../services/onboarding.service.js';
import { addLeadToNotion, updateNotionPortalAccess, updateNotionLeadStatus } from '../services/notion.service.js';
import crypto from 'crypto';
import { createInvoicePaymentLink, sendInvoiceEmail } from '../services/billing.service.js';
import cron from 'node-cron';

const getPlanAmount = (service, source) => {
  if (source === 'contact') return 0; 
  if (!service) return 0;
  const s = service.toLowerCase();
  if (s.includes('basic care')) return 1500;
  if (s.includes('growth care')) return 3500;
  if (s.includes('pro care')) return 7500;
  if (s.includes('one-page')) return 4999;
  if (s.includes('standard')) return 9999;
  if (s.includes('premium')) return 19999;
  if (s.includes('seo')) return 4999;
  if (s.includes('ui/ux')) return 2499;
  return 0;
};

export const createLead = asyncHandler(async (req, res) => {
  const { name, email, whatsapp, businessName, websiteUrl, service, message, source, price, promoDetails, advancePaid } = req.body;
  const amount = price !== undefined ? Number(price) : getPlanAmount(service, source);
  
  const lead = await Lead.create({ 
    name, email, whatsapp, businessName, websiteUrl, service, message, 
    price: amount, 
    advancePaid: advancePaid ? Number(advancePaid) : 0 
  });

  await onboardingService.sendClientConfirmation(lead);
  await onboardingService.sendAdminNotification(lead);
  
  const notionPageId = await addLeadToNotion(lead, amount, promoDetails);
  if (notionPageId) {
    lead.notionPageId = notionPageId;
    await lead.save();
  }

  let paymentLink = null;
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, { lead, paymentLink }, "Lead created successfully"));
});

export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Invoice not found");
  }
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, "Invoice fetched successfully"));
});

export const getLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find({}).sort({ createdAt: -1 }); 
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { leads }, "Leads fetched successfully"));
});

export const togglePortalAccess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { portalAccess } = req.body;
  const lead = await Lead.findById(id);
  if (!lead) { res.status(StatusCodes.NOT_FOUND); throw new Error("Lead not found"); }

  lead.portalAccess = portalAccess;
  await lead.save();

  if (lead.notionPageId) { await updateNotionPortalAccess(lead.notionPageId, portalAccess); }
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, `Portal access updated`));
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const lead = await Lead.findById(id);
  if (!lead) { res.status(StatusCodes.NOT_FOUND); throw new Error("Lead not found"); }

  lead.status = status;
  await lead.save();

  if (lead.notionPageId) { await updateNotionLeadStatus(lead.notionPageId, status); }
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, `Status updated to ${status}`));
});

export const markSingleLeadAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = await Lead.findByIdAndUpdate(id, { isRead: true }, { new: true });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, "Lead read marked"));
});

export const markLeadsAsRead = asyncHandler(async (req, res) => {
  await Lead.updateMany({ isRead: { $ne: true } }, { $set: { isRead: true } });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, {}, "All leads marked as read"));
});

export const processAndSendInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { invoiceType, amountToPay, totalValue } = req.body; 

  const lead = await Lead.findById(id);
  if (!lead) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Lead not found");
  }

  let paymentLink = null;

  if (amountToPay > 0) {
    paymentLink = await createInvoicePaymentLink(lead, amountToPay, invoiceType);
    if (paymentLink) {
      lead.razorpayPaymentId = paymentLink;
      await lead.save();
    }
  }

  const dynamicInvoiceUrl = `https://xrsystem.in/invoice/${lead._id}`;
  const emailSent = await sendInvoiceEmail(lead, invoiceType, paymentLink, dynamicInvoiceUrl, amountToPay, totalValue);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { emailSent, paymentLink }, "Invoice & Payment link sent successfully!")
  );
});

export const logOfflinePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const lead = await Lead.findById(id);
  
  if (!lead) { res.status(StatusCodes.NOT_FOUND); throw new Error("Lead not found"); }
  
  lead.advancePaid = (lead.advancePaid || 0) + Number(amount);
  
  if (lead.advancePaid >= lead.price) { lead.status = 'Completed'; } 
  else { lead.status = 'In Progress'; }
  
  await lead.save();
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, "Payment logged successfully"));
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET; 
  
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    console.log('✅ Webhook verified by XR System!');
    
    if (req.body.event === 'payment_link.paid') {
      const paymentEntity = req.body.payload.payment_link.entity;
      const referenceId = paymentEntity.reference_id;
      const leadIdPart = referenceId.split('_')[1];
      
      const amountPaid = req.body.payload.payment.entity.amount / 100;

      let lead;
      if (leadIdPart.length === 24) {
        lead = await Lead.findById(leadIdPart);
      } else {
        const allLeads = await Lead.find({});
        lead = allLeads.find(l => l._id.toString().endsWith(leadIdPart));
      }

      if (lead) {
        lead.advancePaid = (lead.advancePaid || 0) + amountPaid;

        if (lead.advancePaid >= lead.price) {
          lead.status = 'Completed';
          
          if (lead.service.toLowerCase().includes('monthly') && !lead.nextBillingDate) {
             const nextDate = new Date();
             nextDate.setMonth(nextDate.getMonth() + 1);
             lead.nextBillingDate = nextDate;
             console.log(`📅 Monthly Sub Started. Next billing on: ${nextDate.toDateString()}`);
          }
          
        } else {
          lead.status = 'In Progress';
        }
        
        await lead.save();
        console.log(`🎉 Payment of ₹${amountPaid} received for ${lead.name}. Status auto-updated to ${lead.status}!`);
        
        if (lead.notionPageId) {
          await updateNotionLeadStatus(lead.notionPageId, lead.status);
        }
      }
    }
    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).json({ status: "invalid signature" });
  }
});


cron.schedule('0 8 * * *', async () => {
  try {
    console.log("🔄 Running Daily Subscription Billing Check...");
    const today = new Date();
    
    const dueSubscriptions = await Lead.find({
      service: { $regex: /monthly/i },
      status: 'Completed',
      nextBillingDate: { $lte: today }
    });

    for (const sub of dueSubscriptions) {
      console.log(`Generating monthly invoice for ${sub.name}...`);
      
      const newInvoice = await Lead.create({
        name: sub.name,
        email: sub.email,
        whatsapp: sub.whatsapp,
        businessName: sub.businessName,
        service: sub.service + ` (Renewal - ${today.toLocaleString('default', { month: 'short', year: 'numeric' })})`,
        price: sub.price,
        advancePaid: 0,
        status: 'In Progress'
      });

      const paymentLink = await createInvoicePaymentLink(newInvoice, newInvoice.price, "Subscription Receipt (Monthly Plan)");
      if (paymentLink) {
        newInvoice.razorpayPaymentId = paymentLink;
        await newInvoice.save();
      }

      const dynamicInvoiceUrl = `https://xrsystem.in/invoice/${newInvoice._id}`;
      await sendInvoiceEmail(newInvoice, "Subscription Receipt (Monthly Plan)", paymentLink, dynamicInvoiceUrl, newInvoice.price, newInvoice.price);

      sub.nextBillingDate = new Date(new Date().setMonth(today.getMonth() + 1));
      await sub.save();
      
      console.log(`✅ Auto-billed ${sub.name} successfully!`);
    }
  } catch (error) {
    console.error("❌ Cron Job Error:", error);
  }
});