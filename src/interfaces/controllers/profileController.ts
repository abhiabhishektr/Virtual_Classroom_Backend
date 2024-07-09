// backend/src/interfaces/controllers/profileController.ts

import { Request, Response } from 'express';
import { viewProfile as viewProfileUseCase } from '../../application/use-cases/profile/viewProfile';
import { editProfile as editProfileUseCase } from '../../application/use-cases/profile/editProfile';

export const viewProfile = async (req: Request, res: Response) => {
  try {
    const profile = await viewProfileUseCase((req as any).user);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const updatedProfile = await editProfileUseCase((req as any).user, req.body);
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
