// backend/src/interfaces/routes/authenticationRoutes.ts

import { Router } from 'express';
import { registerUser, loginUser, logoutUser, verifyOTP } from '../controllers/authenticationController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-otp', verifyOTP);

router.get('/test', (req, res) => {
    res.send('Hello, testing route!');
  });
  

export default router;
