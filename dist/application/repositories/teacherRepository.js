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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacherRequest = exports.updateTeacherRequestStatus = exports.getTeacherRequestById = exports.getAllTeacherRequests = exports.findOne = exports.createTeacherRequest = void 0;
// src/application/repositories/teacherRepository.ts
const TeacherRequest_1 = __importDefault(require("../../infrastructure/database/models/TeacherRequest"));
// Create a new teacher request
const createTeacherRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newRequest = new TeacherRequest_1.default(data);
    return yield newRequest.save();
});
exports.createTeacherRequest = createTeacherRequest;
const findOne = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield TeacherRequest_1.default.findOne(query).populate('userId', 'name email');
    }
    catch (error) {
        console.error('Error finding teacher request:', error);
        throw new Error('Error finding teacher request');
    }
});
exports.findOne = findOne;
// Get all teacher requests
const getAllTeacherRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate the TeacherRequests and join with the User collection
        const teacherRequests = yield TeacherRequest_1.default.aggregate([
            {
                $addFields: {
                    userId: { $toObjectId: "$userId" }
                }
            },
            {
                $lookup: {
                    from: 'users', // Collection name
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    highestQualification: 1,
                    yearsOfTeachingExperience: 1,
                    subjects: 1,
                    bio: 1,
                    status: 1,
                    'user.name': 1,
                    'user.email': 1
                }
            }
        ]);
        return teacherRequests;
    }
    catch (error) {
        console.error('Error fetching teacher requests:', error);
        throw error;
    }
});
exports.getAllTeacherRequests = getAllTeacherRequests;
// Find a teacher request by ID
const getTeacherRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield TeacherRequest_1.default.findById(id).populate('userId', 'name email');
});
exports.getTeacherRequestById = getTeacherRequestById;
// Update teacher request status
const updateTeacherRequestStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield TeacherRequest_1.default.findByIdAndUpdate(id, { status }, { new: true });
});
exports.updateTeacherRequestStatus = updateTeacherRequestStatus;
const deleteTeacherRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield TeacherRequest_1.default.findByIdAndDelete(id);
});
exports.deleteTeacherRequest = deleteTeacherRequest;
