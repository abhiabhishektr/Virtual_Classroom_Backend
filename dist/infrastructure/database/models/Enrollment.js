"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define schema for CourseDetail
const courseDetailSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'refunded'],
        default: 'pending'
    },
    enrollmentDetails: {
        type: String, // Additional details if needed
        default: ''
    },
    paymentId: {
        type: String, // Store payment ID as a string
        default: '' // Default to an empty string if not provided
    }
});
// Define schema for Enrollment
const enrollmentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [courseDetailSchema]
});
// Create and export the model
const Enrollment = (0, mongoose_1.model)('Enrollment', enrollmentSchema);
exports.default = Enrollment;
