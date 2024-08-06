// backend/src/interfaces/controllers/profileController.ts

import { Request, Response } from 'express';
import { viewProfile as viewProfileUseCase } from '../../application/use-cases/profile/viewProfile';
import { editProfile as editProfileUseCase ,changePassword as changePasswordUseCase } from '../../application/use-cases/profile/editProfile';
import { ProfileDTO, EditProfileDTO } from '../../interfaces/dots/UserDTO';

export const viewProfile = async (req: Request, res: Response) => {

  try {
    const profile = await viewProfileUseCase((req as any).user);

    const profileDTO: ProfileDTO = {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      role: profile?.role ?? '',
      profilePicture: profile?.profilePicture ?? '',
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

    const profileDTO: ProfileDTO = {
      name: updatedProfile?.name ?? '',
      email: updatedProfile?.email ?? '',
      role: updatedProfile?.role ?? '',
      profilePicture: updatedProfile?.profilePicture ?? '',
      // phone: profile?.phone ?? '',
    };
    res.status(200).json({data:profileDTO});
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;

    const result = await changePasswordUseCase(user.id, currentPassword, newPassword);

    if (result.success) {
      res.status(200).json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ message: 'Failed to change password' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

