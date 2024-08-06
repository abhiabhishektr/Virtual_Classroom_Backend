// backend/src/interfaces/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();


export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('no token')
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    (req as any).user = { id: decoded.id };

    if (decoded.role === 'admin') {
        console.log('Access granted. Admin.');
        next();
    } else {
        res.status(403).json({ message: 'Access denied. You must be admin.' });
    }
  } catch (err  : any) {
    console.log('token not valid');
    
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};
