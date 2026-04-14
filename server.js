import 'dotenv/config'; 
import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";

import logger from "./server/config/logger.js";
import { errorMiddleware } from "./server/middleware/errorMiddleware.js";
import leadRoutes from "./server/routes/lead.routes.js";
import { ApiResponse } from "./server/utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";
import connectDB from "./server/config/db.js";
import careerRoutes from './server/routes/career.routes.js';
import authRoutes from './server/routes/auth.routes.js';
import adminRoutes from './server/routes/admin.routes.js'; 
import portfolioRoutes from './server/routes/portfolio.routes.js'; 
import serviceRoutes from './server/routes/service.routes.js';
import pricingRoutes from './server/routes/pricing.routes.js';
import couponRoutes from './server/routes/coupon.routes.js';
import siteSettingsRoutes from './server/routes/siteSettings.routes.js';
import blogRoutes from './server/routes/blog.routes.js'; 
import uploadRoutes from './server/routes/upload.routes.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  
  console.log("⏳ Connecting to MongoDB...");
  await connectDB();
  console.log("✅ MongoDB Connected Successfully!");
  
  app.set("trust proxy", 1);
  
  app.use(helmet({
    contentSecurityPolicy: false, 
  }));
  
  app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_URL, 
        'http://localhost:5173', 
        'http://localhost:3000'
      ];
      if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true
  }));
  
  app.use(cookieParser());
  app.use(express.json());

  app.use("/api", (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });
  
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  app.use(morgan("combined", { 
    stream: { write: (message) => logger.info(message.trim()) },
    skip: (req) => req.url.startsWith('/src/') || req.url.startsWith('/node_modules/') || req.url.includes('.')
  }));

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", apiLimiter);

  app.use("/api/leads", leadRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/auth', authRoutes); 
  app.use('/api/admin', adminRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/pricing', pricingRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/site-settings', siteSettingsRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/upload', uploadRoutes);

  app.get("/api/health", (req, res) => {
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { status: "UP" }, "Server is healthy"));
  });


  app.use(errorMiddleware);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 XR Backend officially running on port ${PORT}`);
    logger.info(`XR running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ CRITICAL SERVER ERROR:", err);
  logger.error("Failed to start server:", err);
  process.exit(1);
});