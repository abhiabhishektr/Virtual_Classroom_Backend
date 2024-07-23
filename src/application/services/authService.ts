// backend/src/application/services/authService.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../../infrastructure/database/models/User';
import { redisClient } from '../../main/redisClient';

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

  storeRefreshToken: async (userId: string, refreshToken: string): Promise<void> => {
    await redisClient.set(userId, refreshToken, 'EX', 7 * 24 * 60 * 60); // Store for 7 days
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
      const storedToken = await redisClient.get(decoded.id);

      if (storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
      const newRefreshToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

      await authService.storeRefreshToken(decoded.id, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return null;
    }
  },
  removeRefreshToken: async (userId: string): Promise<void> => {
    await redisClient.del(userId);
  }
};