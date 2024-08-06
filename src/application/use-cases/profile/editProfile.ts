// backend/src/application/use-cases/profile/editProfile.ts

import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';

interface EditProfileInput {
  name?: string;
  email?: string;
  // Add other profile fields as needed
}

export const editProfile = async (user: any, changes: EditProfileInput) => {
  return userRepository.update(user.id, changes);
  // return userRepository.findById(user.id);
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    // Fetch the user from the database
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the current password
    const isPasswordValid = await authService.verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid current password');
    }

    // Hash the new password
    const hashedNewPassword = await authService.hashPassword(newPassword);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await userRepository.update(user.id, { password: hashedNewPassword });

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to change password: ${error.message}`);
  }
};