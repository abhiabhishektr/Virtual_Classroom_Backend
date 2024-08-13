"use strict";
// backend/src/application/use-cases/profile/editProfile.ts
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
exports.changePassword = exports.editProfile = void 0;
const userRepository_1 = require("../../repositories/userRepository");
const authService_1 = require("../../services/authService");
const editProfile = (user, changes) => __awaiter(void 0, void 0, void 0, function* () {
    return userRepository_1.userRepository.update(user.id, changes);
    // return userRepository.findById(user.id);
});
exports.editProfile = editProfile;
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the user from the database
        const user = yield userRepository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Verify the current password
        const isPasswordValid = yield authService_1.authService.verifyPassword(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid current password');
        }
        // Hash the new password
        const hashedNewPassword = yield authService_1.authService.hashPassword(newPassword);
        // Update the user's password in the database
        user.password = hashedNewPassword;
        yield userRepository_1.userRepository.update(user.id, { password: hashedNewPassword });
        return { success: true };
    }
    catch (error) {
        throw new Error(`Failed to change password: ${error.message}`);
    }
});
exports.changePassword = changePassword;
