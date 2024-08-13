"use strict";
// backend/src/interfaces/controllers/authenticationController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.forgotPassword = exports.forgotPasswordOTP = exports.resendOTP = exports.sendOTP = exports.logoutUser = exports.loginAdmin = exports.loginUser = exports.registerUser = void 0;
const loginUser_1 = require("../../application/use-cases/authentication/loginUser");
const loginUser_2 = require("../../application/use-cases/authentication/loginUser");
const loginUser_3 = require("../../application/use-cases/authentication/loginUser");
const logoutUser_1 = require("../../application/use-cases/authentication/logoutUser");
const registerUser_1 = require("../../application/use-cases/authentication/registerUser");
const registerUser_2 = require("../../application/use-cases/authentication/registerUser");
const otpService_1 = require("../../application/use-cases/authentication/otpService");
const authService_1 = require("../../application/services/authService");
// import { refreshTokenUseCase } from '../../application/use-cases/';  (pending)
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, registerUser_1.registerUser)(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, loginUser_1.loginUser)(req.body);
        // res.cookie('refreshToken', result.tokens.refreshToken, {
        //   httpOnly: true,
        //   secure: true, 
        //   sameSite: 'strict',
        //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        // });
        res.status(200).json(result);
    }
    catch (error) {
        // Corrected the catch block to handle the error properly
        res.status(400).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
// // HTTPS
// res.cookie('refreshToken', result.tokens.refreshToken, {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production', 
//   sameSite: 'strict',
//   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// });
// // HTTP
// -----------------admin login---------------
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, loginUser_2.loginAdmin)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.loginAdmin = loginAdmin;
// ----------------
const logoutUser = (req, res) => {
    try {
        (0, logoutUser_1.logoutUser)(req.user); // Assuming this function handles the logout logic
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.logoutUser = logoutUser;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        const userAlreadyExists = yield (0, loginUser_3.userExists)(email);
        if (userAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        yield otpService_1.otpService.sendAndStoreOTP(email);
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.sendOTP = sendOTP;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        const userAlreadyExists = yield (0, loginUser_3.userExists)(email);
        if (userAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        yield otpService_1.otpService.sendAndStoreOTP(email);
        res.status(200).json({ message: 'OTP resent successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.resendOTP = resendOTP;
const forgotPasswordOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        // Check if user exists
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        const userNotExists = yield (0, loginUser_3.userExists)(email);
        if (!userNotExists) {
            return res.status(400).json({ message: 'User Not exists' });
        }
        yield otpService_1.otpService.sendAndStoreOTP(email);
        return res.status(200).json({ message: 'Reset Password OTP sent to your email address.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});
exports.forgotPasswordOTP = forgotPasswordOTP;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, otp } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const result = yield (0, registerUser_2.forgotPassword)({ email, password, otp });
        return res.status(200).json({ message: 'Password reset successfully', tokens: result.tokens });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'An error occurred while processing your request.' });
    }
});
exports.forgotPassword = forgotPassword;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    const newTokens = yield authService_1.authService.refreshToken(refreshToken);
    if (!newTokens) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
    res.json(newTokens);
});
exports.refreshToken = refreshToken;
