"use strict";
// src/infrastructure/database/models/User.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    // isVerified: { type: Boolean, default: false },
    profilePicture: { type: String }, // Optional field for profile picture URL
    createdAt: { type: Date, default: Date.now }, // Default to current date/time
    updatedAt: { type: Date, default: Date.now }, // Default to current date/time
    role: { type: String, enum: ['user', 'teacher', 'admin'], default: 'user' },
    // Add other fields as needed
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
