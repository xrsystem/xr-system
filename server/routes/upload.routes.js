import express from 'express';
import { upload, uploadToCloudinary, uploadDocument, uploadPdfToCloudinary } from '../middleware/upload.middleware.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file selected.' });
    }

    const secure_url = await uploadToCloudinary(req.file.path);

    res.status(200).json({ success: true, secure_url });
  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
});

router.post('/resume', uploadDocument.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file provided.' });
    }

    const secure_url = await uploadPdfToCloudinary(req.file.path);

    res.status(200).json({ success: true, url: secure_url });
  } catch (error) {
    console.error("Resume Upload Route Error:", error);
    res.status(500).json({ success: false, message: 'Resume upload failed.' });
  }
});

export default router;