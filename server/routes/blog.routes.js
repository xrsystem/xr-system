import express from 'express';
import { createBlog, getAllBlogs, updateBlog, deleteBlog } from '../controllers/blog.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.post('/', protectAdmin, createBlog);

router.put('/:id', protectAdmin, updateBlog); 

router.delete('/:id', protectAdmin, deleteBlog);

export default router;