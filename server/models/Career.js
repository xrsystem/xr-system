import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  
  linkedin: { type: String }, 
  
  portfolioUrl: { type: String }, 
  message: { type: String }, 
  
  resumeUrl: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Career', careerSchema);