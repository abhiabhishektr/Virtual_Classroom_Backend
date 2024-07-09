// backend/src/application/use-cases/authentication/registerUser.ts

import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';

interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

export const registerUser = async ({ email, password, name }: RegisterUserInput) => {
  const hashedPassword = await authService.hashPassword(password);
  const user = await userRepository.create({ email, password: hashedPassword, name });
  const tokens = authService.generateTokens(user);
  return { user, tokens };
};


