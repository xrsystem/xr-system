import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  homeBanner: { type: String, default: '' },
  
  team: {
    jsMahato: { type: String, default: '' },
    monuNayak: { type: String, default: '' },
    chandiSahu: { type: String, default: '' },
    priyanshuGupta: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);