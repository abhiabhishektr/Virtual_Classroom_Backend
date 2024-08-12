// backend/src/application/use-cases/authentication/loginUser.ts

import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';
import { IUser } from '../../../infrastructure/database/models/User';
import { log } from 'console';


interface LoginUserInput {
  email: string;
  password: string;
}

interface GoogleLoginParams {
  email: string;
  profile: object; // Adjust to the actual shape of profile if known
}

export const loginUser = async ({ email, password }: LoginUserInput) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.blocked) {
    throw new Error('User is blocked');
  }

  if (! await authService.verifyPassword(password, user.password)) {
    throw new Error('Invalid email or password');
  }

  const tokens = await authService.generateTokens(user);
  
  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture || '', // Provide an empty string if profilePicture is not set
  };

  return { tokens, userData };

  // return { tokens };
};


export const userExists = async (email: string) => {
  console.log('email', email);
  
  const user = await userRepository.findByEmail(email);
  if (user) {
    return true
  }else false
  // return user;
};

// ------------------veriffy OTP making db change true----------------

export const updateIsVerifiedUseCase = async (userId: string, changes: Partial<IUser>): Promise<IUser | null> => {
  // Update updatedAt field
  changes.updatedAt = new Date();

  // Call repository method to update user
  const updatedUser = await userRepository.updateViaEmail(userId, changes);
  console.log('updatedUser', updatedUser);

  return updatedUser;
};
// ------------------admin login ----------------


export const loginAdmin = async ({ email, password }: LoginUserInput) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user || !user.isAdmin) {
    throw new Error('Invalid credentials');
  }

  if (! await authService.verifyPassword(password, user.password)) {
    throw new Error('Invalid email or password');
  }

  const tokens = await authService.generateTokens(user);
  
  return { user, tokens };
};

// ------------------Googlle login ----------------

export const googleLoginUser = async ({ email, profile }: GoogleLoginParams) => {


  console.log('profile', profile);


  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('User not found');

  }


  const tokens = authService.generateTokens(user);


  // const tokens = authService.generateTokens(user);
  return { user, tokens };
};