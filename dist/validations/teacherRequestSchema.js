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
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherRequestSchema = void 0;
// src/validations/teacherRequestSchema.ts
const yup = __importStar(require("yup"));
exports.teacherRequestSchema = yup.object().shape({
    qualification: yup.string()
        .max(50, 'Qualification must be 50 characters or less')
        .required('Qualification is required'),
    experience: yup.number()
        .typeError('Experience must be a number')
        .max(50, 'Experience must be 50 years or less')
        .required('Experience is required'),
    subjectsToTeach: yup.string()
        .max(50, 'Subjects must be 50 characters or less')
        .required('Subjects to teach are required'),
    bio: yup.string()
        .min(20, 'Bio must be at least 20 characters')
        .max(50, 'Bio must be 50 characters or less')
        .required('Bio is required')
});
