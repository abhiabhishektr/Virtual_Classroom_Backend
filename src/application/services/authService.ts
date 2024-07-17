// backend/src/application/services/authService.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../../infrastructure/database/models/User'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const ACCESS_TOKEN_EXPIRY = '15h'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  verifyPassword: async (password: string, hashedPassword: string): Promise<boolean> => {
      return await bcrypt.compare(password, hashedPassword);

  },

  generateTokens: (user: IUser): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
  },

  verifyToken: (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
  },

  refreshToken: (refreshToken: string): { accessToken: string; refreshToken: string } | null => {
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
      
      // Generate new tokens
      const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
      const newRefreshToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // If verification fails, return null
      return null;
    }
  },
};
