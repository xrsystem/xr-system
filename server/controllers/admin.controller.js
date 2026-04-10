import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' });
};

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@xrsystem.in' && password === 'admin123') {
    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, {
        email: email,
        token: generateToken('admin_master_001') 
      }, "Login successful")
    );
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
  }
};