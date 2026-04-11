import express from 'express';
import { 
  createLead, 
  getLeads, 
  togglePortalAccess, 
  markLeadsAsRead, 
  updateLeadStatus, 
  markSingleLeadAsRead,
  processAndSendInvoice, 
  razorpayWebhook,
  getLeadById,
  logOfflinePayment
} from '../controllers/lead.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createLead);
router.get('/', protectAdmin, getLeads);
router.get('/:id', getLeadById);

router.patch('/:id/status', protectAdmin, updateLeadStatus);
router.patch('/:id/read', protectAdmin, markSingleLeadAsRead);
router.patch('/mark-read', protectAdmin, markLeadsAsRead);
router.patch('/:id/portal-access', protectAdmin, togglePortalAccess);

router.patch('/:id/payment', protectAdmin, logOfflinePayment); 

router.post('/:id/send-invoice', protectAdmin, processAndSendInvoice);
router.post('/webhook/razorpay', razorpayWebhook);

export default router;