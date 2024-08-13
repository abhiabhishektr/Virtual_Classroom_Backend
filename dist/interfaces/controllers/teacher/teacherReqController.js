"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteTeacherRequest = exports.updateTeacherRequestStatus = exports.getTeacherRequestById = exports.getAllTeacherRequests = exports.teacherRequestStatus = exports.createTeacherRequest = void 0;
const teacherRepository = __importStar(require("../../../application/repositories/teacherRepository"));
const teacherRequestSchema_1 = require("../../../validations/teacherRequestSchema");
const userRepository_1 = require("../../../application/repositories/userRepository");
// Create a new teacher request
const createTeacherRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield teacherRequestSchema_1.teacherRequestSchema.validate(req.body, { abortEarly: false });
        const { qualification, experience, subjectsToTeach, bio } = req.body;
        const userId = (req.user.id); // Convert user ID to ObjectId
        const existingRequest = yield teacherRepository.findOne({ userId });
        if (existingRequest) {
            return res.status(400).json({ message: 'A request from this user already exists.' });
        }
        const newRequest = yield teacherRepository.createTeacherRequest({
            userId,
            highestQualification: qualification,
            yearsOfTeachingExperience: experience,
            subjects: subjectsToTeach,
            bio,
            status: 'pending'
        });
        res.status(201).json({ message: 'Teacher request created successfully', data: newRequest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating teacher request', error });
    }
});
exports.createTeacherRequest = createTeacherRequest;
const teacherRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user ID from the request object
        const userId = req.user.id; // Make sure req.user is typed correctly
        // Fetch the teacher request status for the user
        const request = yield teacherRepository.findOne({ userId });
        if (!request) {
            return res.status(404).json({ message: 'No teacher request found for the user.' });
        }
        // Respond with the request data and status
        res.status(200).json({
            request: {
                highestQualification: request.highestQualification,
                yearsOfTeachingExperience: request.yearsOfTeachingExperience,
                subjects: request.subjects,
                bio: request.bio,
            },
            status: request.status
        });
    }
    catch (error) {
        console.log(error);
        console.error('Error fetching teacher request status:', error);
        res.status(500).json({ message: 'Error fetching teacher request status', error: error });
    }
});
exports.teacherRequestStatus = teacherRequestStatus;
// Get all teacher requests
const getAllTeacherRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield teacherRepository.getAllTeacherRequests();
        res.status(200).json({ data: requests });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving teacher requests', error });
    }
});
exports.getAllTeacherRequests = getAllTeacherRequests;
// Get a teacher request by ID
const getTeacherRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const request = yield teacherRepository.getTeacherRequestById(id);
        if (!request) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }
        res.status(200).json({ data: request });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving teacher request', error });
    }
});
exports.getTeacherRequestById = getTeacherRequestById;
// Update teacher request status
const updateTeacherRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`status: ${status}`, `id: ${id}`);
    try {
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        // Update the teacher request status
        const updatedRequest = yield teacherRepository.updateTeacherRequestStatus(id, status);
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }
        // If the status is 'approved', update the user role
        if (status === 'approved') {
            yield userRepository_1.userRepository.updateUserRole(updatedRequest.userId, 'teacher');
        }
        if (status === 'rejected') {
            yield userRepository_1.userRepository.updateUserRole(updatedRequest.userId, 'user');
        }
        res.status(200).json({ message: 'Teacher request status updated', data: updatedRequest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating teacher request status', error });
    }
});
exports.updateTeacherRequestStatus = updateTeacherRequestStatus;
// Delete teacher request
const deleteTeacherRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Find the request by ID
        const request = yield teacherRepository.getTeacherRequestById(id);
        if (!request) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }
        // Check if the request status is 'approved'
        if (request.status === 'approved') {
            console.log('Cannot delete approved request. Please reject it first.');
            return res.status(400).json({ message: 'Cannot delete approved request. Please reject it first.' });
        }
        // Delete the request
        yield teacherRepository.deleteTeacherRequest(id);
        res.status(200).json({ message: 'Teacher request deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting teacher request:', error);
        res.status(500).json({ message: 'Error deleting teacher request', error });
    }
});
exports.deleteTeacherRequest = deleteTeacherRequest;
