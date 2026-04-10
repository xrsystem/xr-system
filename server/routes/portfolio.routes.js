import express from 'express';
import { createProject, getProjects, toggleProjectStatus, deleteProject, updateProject } from '../controllers/portfolio.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', protectAdmin, upload.single('image'), createProject);
router.patch('/:id/status', protectAdmin, toggleProjectStatus);
router.delete('/:id', protectAdmin, deleteProject);

router.put('/:id', protectAdmin, upload.single('image'), updateProject);

export default router;