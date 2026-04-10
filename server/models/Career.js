import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  portfolioUrl: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  message: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Career', careerSchema);