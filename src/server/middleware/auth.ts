
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'No token, authorization denied' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    // Attach user to request
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};
