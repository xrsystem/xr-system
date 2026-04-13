import express from 'express';
import { upload, uploadToCloudinary } from '../middleware/upload.middleware.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Bhai, image select nahi ki!' });
    }

    const secure_url = await uploadToCloudinary(req.file.path);

    res.status(200).json({ success: true, secure_url });
  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

export default router;