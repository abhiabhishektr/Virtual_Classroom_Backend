// backend/src/interfaces/routes/authenticationRoutes.ts

import { Router } from 'express';
import { registerUser, loginUser, loginAdmin, resendOTP, sendOTP, forgotPassword, forgotPasswordOTP, refreshToken } from '../../controllers/authenticationController'; //refreshToken,verifyOTP
import { googleAuthCallback } from '../../controllers/googleAuth'


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-passwordOTP', forgotPasswordOTP);
router.post('/forgot-password', forgotPassword);
router.post('/refresh-token', refreshToken);
        

// router.post('/reset-password', resetPassword);

// router.post('/verify-otp', verifyOTP);

// router.get('/google', googleAuth);
router.post("/google/callback", googleAuthCallback);



// --------admin----------
router.post('/adminlogin', loginAdmin);
// --------admin----------


// ============= Testing route ================
router.get('/test', (req, res) => {
  res.send('Hello, testing route!');
});


// ============= Testing route ================

export default router;
