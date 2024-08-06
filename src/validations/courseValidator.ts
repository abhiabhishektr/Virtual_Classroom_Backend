// src/validations/courseValidator.ts
import Joi from 'joi';

// Example categories - replace with your actual categories
const categories = ['Programming', 'Science', 'History', 'Mathematics', 'Literature', 'Art'];

export const courseValidator = Joi.object({
  title: Joi.string()
    .min(5)
    .required()
    .messages({
      'string.min': 'Title must be at least 5 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .min(50)
    .required()
    .messages({
      'string.min': 'Description must be at least 50 characters',
      'any.required': 'Description is required',
    }),
  duration: Joi.number()
    .min(2)
    .max(10)
    .required()
    .messages({
      'number.min': 'Must have at least 2 modules',
      'number.max': 'Cannot exceed 10 modules',
      'any.required': 'Duration is required',
    }),
  category: Joi.string()
    .valid(...categories)
    .required()
    .messages({
      'string.valid': 'Invalid category',
      'any.required': 'Category is required',
    }),
  startDate: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'Start date cannot be in the past',
      'any.required': 'Start date is required',
    }),
  fees: Joi.number()
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
