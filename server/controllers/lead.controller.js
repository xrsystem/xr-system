import Lead from '../models/Lead.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import * as onboardingService from '../services/onboarding.service.js';
import { addLeadToNotion, updateNotionPortalAccess, updateNotionLeadStatus } from '../services/notion.service.js';

import crypto from 'crypto';
import { createInvoicePaymentLink, sendInvoiceEmail } from '../services/billing.service.js';

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
  const { name, email, whatsapp, businessName, websiteUrl, service, message, source, price, promoDetails } = req.body;
  const amount = price !== undefined ? Number(price) : getPlanAmount(service, source);
  const lead = await Lead.create({ name, email, whatsapp, businessName, websiteUrl, service, message, price: amount });

  onboardingService.sendClientConfirmation(lead);
  onboardingService.sendAdminNotification(lead);
  
  const notionPageId = await addLeadToNotion(lead, amount, promoDetails);
  if (notionPageId) {
    lead.notionPageId = notionPageId;
    await lead.save();
  }

  let paymentLink = null;
  if (amount > 0) {
    paymentLink = await onboardingService.generatePaymentLink(lead, amount);
    if (paymentLink) {
      lead.razorpayPaymentId = paymentLink;
      await lead.save();
    }
  }
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, { lead, paymentLink }, "Lead created successfully"));
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

  if (lead.notionPageId) {
    await updateNotionLeadStatus(lead.notionPageId, status);
  }

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, `Status updated to ${status}`));
});

export const markSingleLeadAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = await Lead.findByIdAndUpdate(id, { is_read: true }, { new: true });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { lead }, "Lead read marked"));
});

export const markLeadsAsRead = asyncHandler(async (req, res) => {
  await Lead.updateMany({ isRead: { $ne: true } }, { $set: { isRead: true } });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, {}, "Saari leads permanently read mark ho gayi hain"));
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
  let finalAmountToPay = amountToPay;
  if (finalAmountToPay === undefined) {
    finalAmountToPay = (invoiceType === 'Proforma Invoice' || invoiceType === 'Quotation') ? lead.price / 2 : lead.price;
  }

  if (finalAmountToPay > 0 && invoiceType !== 'Receipt') {
    paymentLink = await createInvoicePaymentLink(lead, finalAmountToPay, invoiceType);
  }

  const dynamicInvoiceUrl = `https://xrsystem.com/invoice/${lead._id}`;

  const emailSent = await sendInvoiceEmail(lead, invoiceType, paymentLink, dynamicInvoiceUrl, finalAmountToPay, totalValue);

  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { emailSent, paymentLink }, "Invoice & Payment link sent to client successfully!")
  );
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
      
      const leadId = referenceId.split('_')[1];
      const lead = await Lead.findById(leadId);

      if (lead) {
        if (lead.status === 'New Lead' || lead.status === 'Discussion' || lead.status === 'Proposal Sent') {
          lead.status = 'In Progress';
        } else {
          lead.status = 'Completed'; 
        }
        await lead.save();
        console.log(`🎉 Payment received for ${lead.name}. Status auto-updated to ${lead.status}!`);
        
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