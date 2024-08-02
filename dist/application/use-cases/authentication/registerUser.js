"use strict";
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
exports.verifyOTP = exports.forgotPassword = exports.registerUser = void 0;
const userRepository_1 = require("../../repositories/userRepository");
const authService_1 = require("../../services/authService");
const otpService_1 = require("./otpService");
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const validatePassword = (password) => {
    return password.length >= 6 && password.length <= 50;
};
const validateName = (name) => {
    return name.length >= 3 && name.length <= 50;
};
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, name, otp }) {
    const hashedPassword = yield authService_1.authService.hashPassword(password);
    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
    }
    if (!validateName(name)) {
        throw new Error('Name must be at least 3 characters long');
    }
    let valiateOTP = yield otpService_1.otpService.verifyOTP(email, otp);
    if (!valiateOTP) {
        throw new Error('Invalid OTP');
    }
    const user = yield userRepository_1.userRepository.create({ email, password: hashedPassword, name });
    const tokens = authService_1.authService.generateTokens(user);
    return { tokens };
});
exports.registerUser = registerUser;
const forgotPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, otp }) {
    console.log(email, password, otp);
    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
    }
    let valiateOTP = yield otpService_1.otpService.verifyOTP(email, otp);
    console.log('valiateOTP', valiateOTP);
    if (!valiateOTP) {
        throw new Error('Invalid OTP');
    }
    const userdata = yield userRepository_1.userRepository.findByEmail(email);
    if (!userdata) {
        throw new Error('User not found');
    }
    const hashedPassword = yield authService_1.authService.hashPassword(password);
    const updatedUser = yield userRepository_1.userRepository.update(userdata._id.toString(), { password: hashedPassword });
    if (!updatedUser) {
        throw new Error('Failed to update user try again later');
    }
    const tokens = yield authService_1.authService.generateTokens(updatedUser);
    return { tokens };
});
exports.forgotPassword = forgotPassword;
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    return otpService_1.otpService.verifyOTP(email, otp);
});
exports.verifyOTP = verifyOTP;
