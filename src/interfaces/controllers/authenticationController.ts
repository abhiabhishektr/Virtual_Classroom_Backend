// backend/src/interfaces/controllers/authenticationController.ts

import { Request, Response } from 'express';
import { loginUser as loginUserUseCase } from '../../application/use-cases/authentication/loginUser';
import { logoutUser as logoutUserUseCase } from '../../application/use-cases/authentication/logoutUser';
import { registerUser as registerUserUseCase } from '../../application/use-cases/authentication/registerUser';
import { verifyOTP as verifyOTPUseCase } from '../../application/use-cases/authentication/verifyOTP';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerUserUseCase(req.body);
    res.status(201).json(result);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserUseCase(req.body);
    res.status(200).json(result);
  } catch (error : any) {
    // Corrected the catch block to handle the error properly
    res.status(400).json({ message: error.message });
  }
};



export const logoutUser = (req: Request, res: Response) => {
  try {
    logoutUserUseCase(req.user ); // Assuming this function handles the logout logic
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const result = await verifyOTPUseCase(req.body);
    res.status(200).json(result);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};
