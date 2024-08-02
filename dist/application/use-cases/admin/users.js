"use strict";
// src/application/use-cases/admin/users.ts
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
exports.unblockUser = exports.blockUser = exports.getUsers = void 0;
const User_1 = require("../../../infrastructure/database/models/User"); // Adjust path based on your project structure
// Example function to fetch all users
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Replace with your actual logic to fetch users from the database or any other source
        const users = yield User_1.User.find(); // Assuming Mongoose or any other ORM used
        return users;
    }
    catch (error) {
        throw new Error('Failed to fetch users'); // Handle errors appropriately
    }
});
exports.getUsers = getUsers;
// Example function to block a user
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Replace with your actual logic to update user status to blocked
        const user = yield User_1.User.findById(userId); // Example of fetching user by ID
        if (!user) {
            throw new Error('User not found');
        }
        user.blocked = true; // Example of setting user's blocked status
        yield user.save(); // Example of saving updated user data
    }
    catch (error) {
        throw new Error('Failed to block user'); // Handle errors appropriately
    }
});
exports.blockUser = blockUser;
// Example function to unblock a user
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Replace with your actual logic to update user status to unblocked
        const user = yield User_1.User.findById(userId); // Example of fetching user by ID
        if (!user) {
            throw new Error('User not found');
        }
        user.blocked = false; // Example of setting user's blocked status
        yield user.save(); // Example of saving updated user data
    }
    catch (error) {
        throw new Error('Failed to unblock user'); // Handle errors appropriately
    }
});
exports.unblockUser = unblockUser;
