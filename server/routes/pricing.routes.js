import express from 'express';
import { createPlan, getPlans, updatePlan, togglePlanStatus, deletePlan } from '../controllers/pricing.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPlans);

router.post('/', protectAdmin, createPlan);
router.put('/:id', protectAdmin, updatePlan);
router.patch('/:id/status', protectAdmin, togglePlanStatus);
router.delete('/:id', protectAdmin, deletePlan);

export default router;