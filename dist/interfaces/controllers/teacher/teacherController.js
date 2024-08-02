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
exports.updateTeacherRequestStatus = exports.getTeacherRequestById = exports.getAllTeacherRequests = exports.createTeacherRequest = void 0;
const teacherRequestUseCases = __importStar(require("../../../application/repositories/teacherRepository"));
// Create a new teacher request
const createTeacherRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { highestQualification, yearsOfTeachingExperience, subjects, bio } = req.body;
        console.log("req.user", req.user);
        const userId = (req.user.id); // Convert user ID to ObjectId
        const newRequest = yield teacherRequestUseCases.createTeacherRequest({
            userId,
            highestQualification,
            yearsOfTeachingExperience,
            subjects,
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
// Get all teacher requests
const getAllTeacherRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield teacherRequestUseCases.getAllTeacherRequests();
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
        const request = yield teacherRequestUseCases.getTeacherRequestById(id);
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
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const updatedRequest = yield teacherRequestUseCases.updateTeacherRequestStatus(id, status);
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Teacher request not found' });
        }
        res.status(200).json({ message: 'Teacher request status updated', data: updatedRequest });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating teacher request status', error });
    }
});
exports.updateTeacherRequestStatus = updateTeacherRequestStatus;
