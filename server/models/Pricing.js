import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  discountBadge: { type: String, default: '' },
  category: { type: String, required: true }, 
  description: { type: String, default: '' },
  features: { type: [String], default: [] }, 
  isPopular: { type: Boolean, default: false }, 
  iconName: { type: String, default: '' }, 
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Pricing = mongoose.model('Pricing', pricingSchema);
export default Pricing;