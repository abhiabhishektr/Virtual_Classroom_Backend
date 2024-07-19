
// src/application/use-cases/authentication/registerUser.ts
import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';
import { otpService } from './otpService';
import { redisClient } from '../../../main/redisClient';

interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateName = (name: string): boolean => {
  return name.length >= 3;
};

export const registerUser = async ({ email, password, name }: RegisterUserInput) => {
  const hashedPassword = await authService.hashPassword(password);

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (!validateName(name)) {
    throw new Error('Name must be at least 3 characters long');
  }

  const otp = await otpService.sendOTP(email);
  console.log(otp);

  const otpKey = `otp:${email}`;
  try {
    await redisClient.set(otpKey, otp, { EX: 150 }); // using TTL
    console.log('OTP stored successfully in Redis');
  } catch (err) {
    console.error('Redis set error:', err);
    throw new Error('Failed to store OTP in Redis');
  }

  const user = await userRepository.create({ email, password: hashedPassword, name });
  const tokens = authService.generateTokens(user);

  return { user, tokens };
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const otpKey = `otp:${email}`;
  try {
    const cachedOTP = await redisClient.get(otpKey);
    console.log('Cached OTP:', cachedOTP);

    if (cachedOTP === otp) {
      await redisClient.del(otpKey);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Redis get error:', err);
    return false;
  }
};
