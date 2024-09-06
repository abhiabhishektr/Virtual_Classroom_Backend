// backend/src/interfaces/controllers/authenticationController.ts

import { Request, Response } from 'express';
import { loginUser as loginUserUseCase } from '../../application/use-cases/authentication/loginUser';
import { updateIsVerifiedUseCase as updateIsVerified } from '../../application/use-cases/authentication/loginUser';
import { loginAdmin as loginAdminUseCase } from '../../application/use-cases/authentication/loginUser';
import { userExists as userExists } from '../../application/use-cases/authentication/loginUser';
import { logoutUser as logoutUserUseCase } from '../../application/use-cases/authentication/logoutUser';
import { registerUser as registerUserUseCase } from '../../application/use-cases/authentication/registerUser';
import { forgotPassword as forgotPasswordUseCase } from '../../application/use-cases/authentication/registerUser';
import { verifyOTP as verifyOTPUseCase } from '../../application/use-cases/authentication/registerUser';
import { otpService } from '../../application/use-cases/authentication/otpService';
import { authService } from '../../application/services/authService';
// import { refreshTokenUseCase } from '../../application/use-cases/';  (pending)

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerUserUseCase(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserUseCase(req.body);
    // res.cookie('refreshToken', result.tokens.refreshToken, {
    //   httpOnly: true,
    //   secure: true, 
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });
    res.status(200).json(result);

  } catch (error: any) {
    // Corrected the catch block to handle the error properly
    res.status(400).json({ message: error.message });
  }
};

    // // HTTPS
    // res.cookie('refreshToken', result.tokens.refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', 
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });

    // // HTTP

// -----------------admin login---------------
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const result = await loginAdminUseCase(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
// ----------------


export const logoutUser = (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    logoutUserUseCase(user); // Assuming this function handles the logout logic
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};



const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const userAlreadyExists = await userExists(email);

    if (userAlreadyExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // await otpService.sendAndStoreOTP(email);
    // res.status(200).json({ message: 'OTP sent successfully' });
        // Respond immediately
        res.status(200).json({ message: 'OTP sent successfully' });

        // Send OTP in background
        setImmediate(async () => {
          try {
            await otpService.sendAndStoreOTP(email);
          } catch (error) {
            console.error('Error sending OTP:', error);
          }
        });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const userAlreadyExists = await userExists(email);
    if (userAlreadyExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await otpService.sendAndStoreOTP(email);
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};



export const forgotPasswordOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const userNotExists = await userExists(email);

    if (!userNotExists) {
      return res.status(400).json({ message: 'User Not exists' });
    }

    await otpService.sendAndStoreOTP(email);

    return res.status(200).json({ message: 'Reset Password OTP sent to your email address.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email, password, otp } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await forgotPasswordUseCase({ email, password, otp });
    return res.status(200).json({ message: 'Password reset successfully', tokens: result.tokens });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'An error occurred while processing your request.' });
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const newTokens = await authService.refreshToken(refreshToken);

  if (!newTokens) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
  res.json(newTokens);
};




