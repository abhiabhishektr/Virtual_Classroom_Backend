"use strict";
// backend/src/application/use-cases/authentication/loginUser.ts
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
exports.googleLoginUser = exports.loginAdmin = exports.updateIsVerifiedUseCase = exports.userExists = exports.loginUser = void 0;
const userRepository_1 = require("../../repositories/userRepository");
const authService_1 = require("../../services/authService");
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield userRepository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    if (!(yield authService_1.authService.verifyPassword(password, user.password))) {
        throw new Error('Invalid email or password');
    }
    const tokens = yield authService_1.authService.generateTokens(user);
    return { tokens };
});
exports.loginUser = loginUser;
const userExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('email', email);
    const user = yield userRepository_1.userRepository.findByEmail(email);
    if (user) {
        return true;
    }
    else
        false;
    // return user;
});
exports.userExists = userExists;
// ------------------veriffy OTP making db change true----------------
const updateIsVerifiedUseCase = (userId, changes) => __awaiter(void 0, void 0, void 0, function* () {
    // Update updatedAt field
    changes.updatedAt = new Date();
    // Call repository method to update user
    const updatedUser = yield userRepository_1.userRepository.updateViaEmail(userId, changes);
    console.log('updatedUser', updatedUser);
    return updatedUser;
});
exports.updateIsVerifiedUseCase = updateIsVerifiedUseCase;
// ------------------admin login ----------------
const loginAdmin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield userRepository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    if (!user || !user.isAdmin) {
        throw new Error('Invalid credentials');
    }
    if (!(yield authService_1.authService.verifyPassword(password, user.password))) {
        throw new Error('Invalid email or password');
    }
    const tokens = yield authService_1.authService.generateTokens(user);
    return { user, tokens };
});
exports.loginAdmin = loginAdmin;
// ------------------Googlle login ----------------
const googleLoginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, profile }) {
    console.log('profile', profile);
    const user = yield userRepository_1.userRepository.findByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    const tokens = authService_1.authService.generateTokens(user);
    // const tokens = authService.generateTokens(user);
    return { user, tokens };
});
exports.googleLoginUser = googleLoginUser;
