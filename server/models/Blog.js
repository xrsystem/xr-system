import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'XR System Team' },
  coverImage: { type: String },
  category: { type: String, default: 'Technology' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);