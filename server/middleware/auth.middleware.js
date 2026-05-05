import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import Lead from '../models/Lead.js';

export const protectAdmin = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

      if (decoded.role !== "admin") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Access denied. Admins only.",
        });
      }

      req.admin = decoded;
      return next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid or expired token",
      });
    }
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    message: "No token provided",
  });
};

export const protectClient = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_CLIENT_SECRET);

      const client = await Lead.findById(decoded.id);

      if (!client) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Client not found",
        });
      }

      if (!client.portalAccess) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Access disabled. Contact XR System.",
        });
      }

      req.client = client;
      return next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token failed",
      });
    }
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    message: "Please login",
  });
};