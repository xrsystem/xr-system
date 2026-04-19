import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true }, 
  itemType: { type: String },
  price: { type: Number, required: true }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  businessName: { type: String },
  websiteUrl: { type: String },
  service: { type: String }, 
  message: { type: String },
  source: { type: String, default: 'website' },
  
  invoiceItems: [invoiceItemSchema],
  subTotal: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  finalTotal: { type: Number, default: 0 }, 
  
  price: { type: Number, default: 0 },
  advancePaid: { type: Number, default: 0 }, 
  termsAndConditions: { type: String },
  
  portalAccess: { type: Boolean, default: false }, 
  isRead: { type: Boolean, default: false }, 
  status: { type: String, default: 'New Lead' },
  nextBillingDate: { type: Date },
  notionPageId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

leadSchema.pre('save', function(next) {
  if (this.invoiceItems && this.invoiceItems.length > 0) {
    this.subTotal = this.invoiceItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    this.finalTotal = this.subTotal - (Number(this.discountAmount) || 0) + (Number(this.taxAmount) || 0);
    this.price = this.finalTotal;
  } else {
    this.finalTotal = this.price || 0;
    this.subTotal = this.price || 0;
  }
  next();
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;