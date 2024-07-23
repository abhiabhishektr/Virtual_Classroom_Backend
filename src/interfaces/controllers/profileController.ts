// backend/src/interfaces/controllers/profileController.ts

import { Request, Response } from 'express';
import { viewProfile as viewProfileUseCase } from '../../application/use-cases/profile/viewProfile';
import { editProfile as editProfileUseCase } from '../../application/use-cases/profile/editProfile';
import { ProfileDTO ,EditProfileDTO} from '../../interfaces/dots/UserDTO';

export const viewProfile = async (req: Request, res: Response) => {

  try {
    const profile = await viewProfileUseCase((req as any).user);
    const profileDTO: ProfileDTO = {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      // phone: profile?.phone ?? '',
    };
    res.status(200).json(profileDTO);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const updatedProfile = await editProfileUseCase((req as any).user, req.body);
    // const EditProfileDTO: EditProfileDTO = {
    //   name: updatedProfile.name,
    //   username: updatedProfile.username,
    //   email: updatedProfile.email,
    //   phone: updatedProfile.phone,
    // };
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  try {
  
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


