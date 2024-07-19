// backend/src/interfaces/routes/authenticationRoutes.ts

import { Router } from 'express';
import { registerUser, loginUser, logoutUser, verifyOTP, loginAdmin ,resendOTP } from '../controllers/authenticationController'; //refreshToken
import { googleAuth, googleCallback, setupSession } from '../controllers/googleAuth'

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);


// router.post('/refresh-token', );
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.post('/change-password', verifyToken, changePassword);

router.get('/google', googleAuth);
router.get("/google/callback", googleCallback, setupSession);


// --------admin----------
router.post('/adminlogin', loginAdmin);
// --------admin----------


// ============= Testing route ================
router.get('/test', (req, res) => {
  res.send('Hello, testing route!');
});
// ============= Testing route ================

export default router;
