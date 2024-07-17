
// redis - remote Dictionary Server

// =====================================================================
// NO REDIS
// =====================================================================



// import { userRepository } from '../../repositories/userRepository';
// import { authService } from '../../services/authService';
// import { otpService } from './otpService';

// interface RegisterUserInput {
//   email: string;
//   password: string;
//   name: string;
// }

// // In-memory store for OTPs
// const otpStore: { [key: string]: { otp: string, expiresAt: number } } = {};

// export const registerUser = async ({ email, password, name }: RegisterUserInput) => {
//   const hashedPassword = await authService.hashPassword(password);

//   // Generate OTP and send to user's email
//   const otp = await otpService.sendOTP(email);

//   // Store OTP in memory with a TTL (time-to-live) of 5 minutes
//   const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
//   otpStore[email] = { otp, expiresAt };
//   console.log('OTP stored successfully in memory');

//   // Create user in database
//   const user = await userRepository.create({ email, password: hashedPassword, name });
//   const tokens = authService.generateTokens(user);

//   return { user, tokens };
// };

// // Function to verify OTP from memory
// export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
//   const otpData = otpStore[email];
//   if (otpData) {
//     if (otpData.expiresAt < Date.now()) {
//       // OTP expired
//       delete otpStore[email];
//       return false;
//     }

//     if (otpData.otp === otp) {
//       // OTP matched, delete it from memory (optional: to prevent reuse)
//       delete otpStore[email];
//       return true;
//     } else {
//       return false;
//     }
//   } else {
//     return false;
//   }
// };


// =====================================================================
// REDIS
// =====================================================================



import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';
import { otpService } from './otpService';
import { createClient } from 'redis';

// Create a Redis client
const redisClient = createClient({
  socket: {
    host: 'localhost', // Replace with your Redis server host
    port: 6379, // Replace with your Redis server port
  }
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

// ===========================

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
// ===========================

export const registerUser = async ({ email, password, name }: RegisterUserInput) => {
  const hashedPassword = await authService.hashPassword(password);
// ===========================
  // Validate email
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Validate name
  if (!validateName(name)) {
    throw new Error('Name must be at least 3 characters long');
  }
// ===========================


  // Generate OTP and send to user's email
  const otp = await otpService.sendOTP(email);
  console.log(otp);

  // Store OTP in Redis with a TTL (time-to-live) of 2 minutes
  const otpKey = `otp:${email}`;
  try {
    await redisClient.set(otpKey, otp, { EX: 150 }); // 120 is the TTL but 150 for the tolerance
    console.log('OTP stored successfully in Redis');
  } catch (err) {
    console.error('Redis set error:', err);
    throw new Error('Failed to store OTP in Redis');
  }

  // Create user in database
  const user = await userRepository.create({ email, password: hashedPassword, name });
  const tokens = authService.generateTokens(user);

  return { user, tokens };
};

// // Function to verify OTP from Redis
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const otpKey = `otp:${email}`;
  try {
    const cachedOTP = await redisClient.get(otpKey);
    console.log('Cached OTP:', cachedOTP);

    if (cachedOTP === otp) {
      // OTP matched, delete it from Redis (optional: to prevent reuse)
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