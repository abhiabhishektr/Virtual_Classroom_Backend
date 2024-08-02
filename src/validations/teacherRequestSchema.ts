// src/validations/teacherRequestSchema.ts
import * as yup from 'yup';

export const teacherRequestSchema = yup.object().shape({
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
