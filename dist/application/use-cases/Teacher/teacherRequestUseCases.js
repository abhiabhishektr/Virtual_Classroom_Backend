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
exports.updateTeacherRequestStatus = exports.getTeacherRequestById = exports.getAllTeacherRequests = void 0;
// src/application/use-cases/Teacher/teacherRequestUseCases.ts
const teacherRepository = __importStar(require("../../repositories/teacherRepository"));
// Create a new teacher request
// export const createTeacherRequest = async (data: {
//     userId: string;
//     highestQualification: string;
//     yearsOfTeachingExperience: number;
//     subjects: string[];
//     bio: string;
// }) => {
//     return await teacherRepository.createTeacherRequest({
//         ...data,
//         status: 'pending',
//     });
// };
// Get all teacher requests
const getAllTeacherRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield teacherRepository.getAllTeacherRequests();
});
exports.getAllTeacherRequests = getAllTeacherRequests;
// Get a teacher request by ID
const getTeacherRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield teacherRepository.getTeacherRequestById(id);
});
exports.getTeacherRequestById = getTeacherRequestById;
// Update teacher request status
const updateTeacherRequestStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield teacherRepository.updateTeacherRequestStatus(id, status);
});
exports.updateTeacherRequestStatus = updateTeacherRequestStatus;
