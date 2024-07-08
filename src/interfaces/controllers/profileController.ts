// backend/src/interfaces/controllers/profileController.ts

import { Request, Response } from 'express';
import { viewProfile, editProfile } from '../../application/use-cases/profile';

export const viewProfile = async (req: Request, res: Response) => {
  try {
    const profile = await viewProfile((req as any).user);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const updatedProfile = await editProfile((req as any).user, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
