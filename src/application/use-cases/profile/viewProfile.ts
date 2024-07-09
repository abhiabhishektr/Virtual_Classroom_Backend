// backend/src/application/use-cases/profile/viewProfile.ts

import { userRepository } from '../../repositories/userRepository';

export const viewProfile = async (user: any) => {
  return userRepository.findById(user.id);
};
