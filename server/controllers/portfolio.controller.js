import Portfolio from '../models/Portfolio.js';
import { uploadToCloudinary } from '../middleware/upload.middleware.js'; 

export const createProject = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const cloudUrl = await uploadToCloudinary(req.file.path);
    
    const project = await Portfolio.create({
      ...req.body,
      imageUrl: cloudUrl
    });

    res.status(201).json({ success: true, data: { project }, message: "Project added successfully" });
  } catch (error) {
    console.error("🔴 CREATE PORTFOLIO ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const query = req.admin ? {} : { isActive: true };
    const projects = await Portfolio.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { projects } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProjectStatus = async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    project.isActive = !project.isActive;
    await project.save();
    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    await Portfolio.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Project deleted completely" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    let project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.imageUrl = await uploadToCloudinary(req.file.path); 
    }

    project = await Portfolio.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ success: true, data: { project }, message: "Project updated successfully" });
  } catch (error) {
    console.error("🔴 UPDATE PORTFOLIO ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};