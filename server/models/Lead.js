import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  businessName: { type: String },
  websiteUrl: { type: String },
  service: { type: String },
  message: { type: String },
  source: { type: String, default: 'website' },
  
  price: { type: Number, default: 0 }, 
  portalAccess: { type: Boolean, default: false }, 
  isRead: { type: Boolean, default: false }, 
  
  status: { type: String, default: 'New Lead' },
  
  notionPageId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;