"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidator = void 0;
// src/validations/courseValidator.ts
const joi_1 = __importDefault(require("joi"));
// Example categories - replace with your actual categories
const categories = ['Programming', 'Science', 'History', 'Mathematics', 'Literature', 'Art'];
exports.courseValidator = joi_1.default.object({
    title: joi_1.default.string()
        .min(5)
        .required()
        .messages({
        'string.min': 'Title must be at least 5 characters',
        'any.required': 'Title is required',
    }),
    description: joi_1.default.string()
        .min(50)
        .required()
        .messages({
        'string.min': 'Description must be at least 50 characters',
        'any.required': 'Description is required',
    }),
    duration: joi_1.default.number()
        .min(2)
        .max(10)
        .required()
        .messages({
        'number.min': 'Must have at least 2 modules',
        'number.max': 'Cannot exceed 10 modules',
        'any.required': 'Duration is required',
    }),
    category: joi_1.default.string()
        .valid(...categories)
        .required()
        .messages({
        'string.valid': 'Invalid category',
        'any.required': 'Category is required',
    }),
    startDate: joi_1.default.date()
        .min('now')
        .required()
        .messages({
        'date.min': 'Start date cannot be in the past',
        'any.required': 'Start date is required',
    }),
    fees: joi_1.default.number()
        .min(10)
        .required()
        .messages({
        'number.min': 'Fees must be at least 10 rupees',
        'any.required': 'Fees are required',
    }),
    //   imageUrl: Joi.string()
    //     .uri()
    //     .messages({
    //       'string.uri': 'Invalid URL format',
    //     })
});
