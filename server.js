import 'dotenv/config'; 
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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

console.log("==== ENV PORT CHECK ====", process.env.PORT);

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  
  await connectDB();
  
  app.set("trust proxy", 1);
  
  app.use(helmet({
    contentSecurityPolicy: false, 
  }));
  
  app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  }));
  
  app.use(cookieParser());
  app.use(express.json());
  
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
    validate: { 
      xForwardedForHeader: false,
      forwardedHeader: false
    },
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

  app.get("/api/health", (req, res) => {
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { status: "UP" }, "Server is healthy"));
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
  }

  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.use(errorMiddleware);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`XR running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});