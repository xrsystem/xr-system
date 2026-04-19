import Blog from '../models/Blog.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { uploadToCloudinary } from '../middleware/upload.middleware.js';

export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category } = req.body;
  
  const slug = title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');

  let coverImage = req.body.coverImage;

  if (req.file) {
    coverImage = await uploadToCloudinary(req.file.path);
  }

  const blog = await Blog.create({ title, slug, excerpt, content, category, coverImage });
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, blog, "Blog created"));
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { blogs }, "Blogs fetched"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category } = req.body;
  
  let updateData = { title, excerpt, content, category };
  
  if (title) {
    updateData.slug = title.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
  }

  if (req.body.coverImage) {
    updateData.coverImage = req.body.coverImage;
  }

  if (req.file) {
    updateData.coverImage = await uploadToCloudinary(req.file.path);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id, 
    updateData, 
    { new: true, runValidators: true }
  );

  if (!updatedBlog) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Blog not found");
  }

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedBlog, "Blog updated successfully"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  
  if (!deletedBlog) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Blog not found");
  }

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Blog deleted"));
});