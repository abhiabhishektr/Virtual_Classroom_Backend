// src/application/use-cases/Teacher/teacherRequestUseCases.ts
import * as teacherRepository from '../../repositories/teacherRepository';

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
export const getAllTeacherRequests = async () => {
    return await teacherRepository.getAllTeacherRequests();
};

// Get a teacher request by ID
export const getTeacherRequestById = async (id: string) => {
    return await teacherRepository.getTeacherRequestById(id);
};

// Update teacher request status
export const updateTeacherRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    return await teacherRepository.updateTeacherRequestStatus(id, status);
};
