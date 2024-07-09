// backend/src/application/use-cases/profile/editProfile.ts

import { userRepository } from '../../repositories/userRepository';

interface EditProfileInput {
  name?: string;
  email?: string;
  // Add other profile fields as needed
}

export const editProfile = async (user: any, changes: EditProfileInput) => {
  return userRepository.update(user.id, changes);
};
