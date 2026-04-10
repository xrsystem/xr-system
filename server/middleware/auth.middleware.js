import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import Lead from '../models/Lead.js';

export const protectAdmin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.admin = decoded;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized, invalid token" });
    }
  }
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized, no token provided" });
  }
};

export const protectClient = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      const client = await Lead.findById(decoded.id);
      
      if (!client) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Client not found" });
      }

      if (client.portalAccess === false) {
        return res.status(StatusCodes.FORBIDDEN).json({ 
          message: "Aapka dashboard access disable kar diya gaya hai. Please contact XR System." 
        });
      }

      req.client = client;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized, please login" });
  }
};