import express from 'express';
import { validateCoupon, createCoupon, getCoupons, toggleCouponStatus, deleteCoupon } from '../controllers/coupon.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/validate', validateCoupon);

router.get('/', protectAdmin, getCoupons);
router.post('/', protectAdmin, createCoupon);
router.patch('/:id/status', protectAdmin, toggleCouponStatus);
router.delete('/:id', protectAdmin, deleteCoupon);

export default router;