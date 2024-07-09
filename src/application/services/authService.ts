// backend/src/application/services/authService.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../../infrastructure/database/models/User'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  verifyPassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  generateTokens: (user: IUser): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  },

  verifyToken: (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
  },
};
