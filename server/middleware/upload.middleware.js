import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import os from 'os';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed"), false);
    }
  }
});

export const uploadToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'xr_system_portfolio',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1000, crop: "limit", fetch_format: "auto", quality: "auto" }] 
    });
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); 
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

export const uploadDocument = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF documents are allowed."), false);
    }
  }
});

export const uploadPdfToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'xr_system_resumes',
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw new Error('Cloudinary PDF upload failed: ' + error.message);
  }
};