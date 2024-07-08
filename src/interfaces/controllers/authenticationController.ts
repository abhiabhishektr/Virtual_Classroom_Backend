// backend/src/interfaces/controllers/authenticationController.ts

import { Request, Response } from 'express';
import { loginUser } from '../../application/use-cases/authentication/loginUser';
import { logoutUser } from '../../application/use-cases/authentication/logoutUser';
import { registerUser } from '../../application/use-cases/authentication/registerUser';
import { verifyOTP } from '../../application/use-cases/authentication/verifyOTP';


export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    logoutUser(req.user);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const result = await verifyOTP(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
