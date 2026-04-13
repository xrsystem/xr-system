import Blog from '../models/Blog.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, coverImage } = req.body;
  
  const slug = title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');

  const blog = await Blog.create({ title, slug, excerpt, content, category, coverImage });
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, blog, "Blog created"));
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { blogs }, "Blogs fetched"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Blog deleted"));
});