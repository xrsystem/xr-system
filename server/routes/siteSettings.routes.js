import express from 'express';
import { getSiteSettings, updateSettingImage } from '../controllers/siteSettings.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js'; 

const router = express.Router();

router.get('/', getSiteSettings); 

router.put('/update-image', protectAdmin, upload.single('image'), updateSettingImage); 

export default router;