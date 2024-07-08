// backend/src/application/use-cases/authentication/loginUser.ts

import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';

interface LoginUserInput {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginUserInput) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !authService.verifyPassword(password, user.password)) {
    throw new Error('Invalid email or password');
  }
  const tokens = authService.generateTokens(user);
  return { user, tokens };
};
