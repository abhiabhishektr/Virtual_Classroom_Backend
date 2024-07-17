// backend/src/application/use-cases/authentication/loginUser.ts

import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';

interface LoginUserInput {
  email: string;
  password: string;
}

interface GoogleLoginParams {
  email: string ;
  profile: object; // Adjust to the actual shape of profile if known
}

export const loginUser = async ({ email, password }: LoginUserInput) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (! await authService.verifyPassword(password, user.password)) {    
    throw new Error('Invalid email or password');
  }

  const tokens = authService.generateTokens(user);
  return { user, tokens };
};


// ------------------admin login ----------------


export const loginAdmin  = async ({ email, password }: LoginUserInput) => {
  const user = await userRepository.findByEmail(email);
  console.log('user', user);
  
  if (!user) {
    throw new Error('User not found');
  }

  if (!user || !user.isAdmin) {
    throw new Error('Invalid credentials');
  }
  
  if (! await authService.verifyPassword(password, user.password)) {    
    throw new Error('Invalid email or password');
  }
  
  const tokens = authService.generateTokens(user);
  return { user, tokens };
};

// ------------------Googlle login ----------------

export const googleLoginUser = async ({ email, profile }: GoogleLoginParams) => {


  console.log('profile', profile);

  
  const user = await userRepository.findByEmail(email);

  if (!user) {
    // throw new Error('User not found');
    
  }


 

  // const tokens = authService.generateTokens(user);
  // return { user, tokens };
};