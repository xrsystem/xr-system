import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, { job }, "Job posted successfully"));
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const query = (req.query.all === 'true') ? {} : { isActive: true };
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { jobs }, "Jobs fetched"));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });

    job.isActive = !job.isActive;
    await job.save();
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { job }, "Job status updated"));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Job deleted completely"));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });

    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { job }, "Job updated successfully"));
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};