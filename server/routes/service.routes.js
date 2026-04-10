import express from 'express';
import { createService, getServices, updateService, toggleServiceStatus, deleteService } from '../controllers/service.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', protectAdmin, upload.single('image'), createService);
router.put('/:id', protectAdmin, upload.single('image'), updateService);
router.patch('/:id/status', protectAdmin, toggleServiceStatus);
router.delete('/:id', protectAdmin, deleteService);

export default router;