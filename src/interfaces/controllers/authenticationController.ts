                                                 // backend/src/interfaces/controllers/authenticationController.ts

import { Request, Response } from 'express';
import { loginUser as loginUserUseCase } from '../../application/use-cases/authentication/loginUser';
import { updateIsVerifiedUseCase as updateIsVerified} from '../../application/use-cases/authentication/loginUser';
import { loginAdmin as loginAdminUseCase } from '../../application/use-cases/authentication/loginUser';
import { logoutUser as logoutUserUseCase } from '../../application/use-cases/authentication/logoutUser';
import { registerUser as registerUserUseCase } from '../../application/use-cases/authentication/registerUser';
import { verifyOTP as verifyOTPUseCase } from '../../application/use-cases/authentication/registerUser';
// import { refreshTokenUseCase } from '../../application/use-cases/';  (pending)

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerUserUseCase(req.body);
    res.status(201).json(result);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserUseCase(req.body);
    // console.log('result', result);
    res.status(200).json(result);
  } catch (error : any) {
    // Corrected the catch block to handle the error properly
    res.status(400).json({ message: error.message });
  }
};


// -----------------admin login---------------
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    // console.log(11);
    // console.log(req.body);
    const result = await loginAdminUseCase(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
// ----------------


export const logoutUser = (req: Request, res: Response) => {
  try {
    logoutUserUseCase(req.user ); // Assuming this function handles the logout logic
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const result = await verifyOTPUseCase(req.body.email, req.body.otp);
    if (result) {
      // amke isverifed true here
     let user = await updateIsVerified(req.body.email, { isVerified: true });
      res.status(200).json({ message: 'OTP verified successfully',user });
    } else {
    res.status(400).json({ message: 'Invalid OTP' });
    }
    
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
};

// export const refreshToken = async (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(400).json({ message: 'Refresh token is required' });
//     }

//     const result = await refreshTokenUseCase(refreshToken);

//     if (result) {
//       res.status(200).json({
//         message: 'Tokens refreshed successfully',
//         accessToken: result.accessToken,
//         refreshToken: result.refreshToken
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid or expired refresh token' });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || 'An error occurred while refreshing tokens' });
//   }
// };
