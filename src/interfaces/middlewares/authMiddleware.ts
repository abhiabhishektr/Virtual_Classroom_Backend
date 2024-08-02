// backend/src/interfaces/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { userRepository } from '../../application/repositories/userRepository';
dotenv.config();


export const authMiddleware = async  (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; };
    (req as any).user = { id: decoded.id };

    const user = await userRepository.findById((req as any).user.id);
    if (user?.blocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }
    
    next();
  } catch (err  : any) {
    
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};
