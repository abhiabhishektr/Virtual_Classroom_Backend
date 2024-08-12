import { userRepository } from '../../repositories/userRepository';
import { authService } from '../../services/authService';
import { otpService } from './otpService';

interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  otp: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 50;
};

const validateName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 50;
};

export const registerUser = async ({ email, password, name, otp }: RegisterUserInput) => {    
  const hashedPassword = await authService.hashPassword(password);

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (!validateName(name)) {
    throw new Error('Name must be at least 3 characters long');
  }

  let valiateOTP = await otpService.verifyOTP(email, otp);
  if (!valiateOTP) {
    throw new Error('Invalid OTP');
  }

  const user = await userRepository.create({ email, password: hashedPassword, name });
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


interface ForgotPasswordInput {
  email: string;
  otp: string;
  password: string;
}

export const forgotPassword = async ({ email, password, otp }: ForgotPasswordInput) => {
console.log(email, password, otp);

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters long');
  }

  let valiateOTP = await otpService.verifyOTP(email, otp);
  console.log('valiateOTP', valiateOTP);
  
  if (!valiateOTP) {
    throw new Error('Invalid OTP');
  }
  const userdata = await userRepository.findByEmail(email);
  if (!userdata) {
      throw new Error('User not found');
    }
  const hashedPassword = await authService.hashPassword(password);

  const updatedUser = await userRepository.update(userdata._id.toString(), { password: hashedPassword });

  if (!updatedUser) {
    throw new Error('Failed to update user try again later');
  }

  const tokens = await authService.generateTokens(updatedUser);

  return { tokens };
};


interface GoogleLoginInput {
  email: string;
  name: string;
  googleId: string;
  profilePicture: string;
}

export const googleLogin = async ({ email, name, googleId ,profilePicture}: GoogleLoginInput) => {
  // Check if the user exists
  let user = await userRepository.findByEmail(email);
  
  if (!user) {
    // If user does not exist, create a new one with Google ID as password
    const hashedPassword = await authService.hashPassword(googleId); // Use Google ID as password
    user = await userRepository.create({
      email,
      password: hashedPassword,
      name: name || 'Unknown',
      profilePicture,
     
    });
  }

  // Generate tokens for the user
  const tokens = await authService.generateTokens(user);

  return tokens;
};


export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  return otpService.verifyOTP(email, otp);
};