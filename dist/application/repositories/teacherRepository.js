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
exports.updateTeacherRequestStatus = exports.getTeacherRequestById = exports.getAllTeacherRequests = exports.createTeacherRequest = void 0;
const TeacherRequest_1 = __importDefault(require("../../infrastructure/database/models/TeacherRequest"));
// Create a new teacher request
const createTeacherRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newRequest = new TeacherRequest_1.default(data);
    return yield newRequest.save();
});
exports.createTeacherRequest = createTeacherRequest;
// Get all teacher requests
const getAllTeacherRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield TeacherRequest_1.default.find().populate('userId', 'name email');
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
