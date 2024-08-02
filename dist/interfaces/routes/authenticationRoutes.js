"use strict";
// backend/src/interfaces/routes/authenticationRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationController_1 = require("../controllers/authenticationController"); //refreshToken,verifyOTP
const googleAuth_1 = require("../controllers/googleAuth");
const router = (0, express_1.Router)();
router.post('/register', authenticationController_1.registerUser);
router.post('/login', authenticationController_1.loginUser);
router.post('/logout', authenticationController_1.logoutUser);
router.post('/send-otp', authenticationController_1.sendOTP);
router.post('/resend-otp', authenticationController_1.resendOTP);
router.post('/forgot-passwordOTP', authenticationController_1.forgotPasswordOTP);
router.post('/forgot-password', authenticationController_1.forgotPassword);
router.post('/refresh-token', authenticationController_1.refreshToken);
// router.post('/reset-password', resetPassword);
// router.post('/verify-otp', verifyOTP);
router.get('/google', googleAuth_1.googleAuth);
router.get("/google/callback", googleAuth_1.googleCallback, googleAuth_1.setupSession);
// --------admin----------
router.post('/adminlogin', authenticationController_1.loginAdmin);
// --------admin----------
// ============= Testing route ================
router.get('/test', (req, res) => {
    res.send('Hello, testing route!');
});
// ============= Testing route ================
exports.default = router;
