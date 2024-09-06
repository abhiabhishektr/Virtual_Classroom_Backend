// backend/src/application/services/authService.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../../infrastructure/database/models/User';
import { redisClient } from '../../main/redisClient';
// import { promisify } from 'util';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const ACCESS_TOKEN_EXPIRY = '15h'; // 15 hours 
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
// // // testing
// const ACCESS_TOKEN_EXPIRY = '10s'; // 30 seconds
// const REFRESH_TOKEN_EXPIRY = '1m';  // 2 minutes


// const setAsync = promisify(redisClient.set).bind(redisClient);

export const authService = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  verifyPassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);

  },
  generateTokens: async (user: IUser): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    await authService.storeRefreshToken(user.id, refreshToken); // Store refresh token

    return { accessToken, refreshToken };
  },


  verifyToken: (token: string): any => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return decoded as { id: string, role: string, email: string }; // Return the decoded payload
    } catch (err) {
      throw new Error('Invalid token');
    }
  },

  storeRefreshToken: async (userId: string, refreshToken: string): Promise<void> => {
    await redisClient.set(userId, refreshToken, { EX: 7 * 24 * 60 * 60 });
    // await redisClient.set(userId, refreshToken,{ EX: 1 * 60 }); // testing
    // await setAsync(userId, refreshToken, 'EX', 7 * 24 * 60 * 60); // Store for 7 days
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
    const result = await redisClient.del(userId);
    if (result) {
      console.log("Redis deletion successful");
    } else {
      console.log("Redis key not found or deletion failed");
    }
  }
};