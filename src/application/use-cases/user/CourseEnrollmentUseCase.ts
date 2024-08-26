// src/application/use-cases/user/CourseEnrollmentUseCase.ts

import { IUserCourseRepository } from '../../repositories/CourseEnrollmentRepository';
import { ICourse } from '../../../infrastructure/database/models/Course';
import { IEnrollment } from '../../../infrastructure/database/models/Enrollment';

export const createUserCourseUseCase = (repository: IUserCourseRepository) => ({
    getUserPurchasedCourses: async (userId: string): Promise<ICourse[]> => {
        return repository.getUserPurchasedCourses(userId);
    },
    groups: async (userId: string): Promise<string[]> => {
        return repository.groups(userId);
    },
    enrollCourse: async (userId: string, courseId: string, enrollmentDetails: any): Promise<IEnrollment> => {
        // Check if user is already enrolled in the course
        const existingEnrollment = await repository.getEnrollment(userId, courseId);
        if (existingEnrollment) {
            throw new Error('User is already enrolled in this course');
        }
        return repository.enrollCourse(userId, courseId, enrollmentDetails, 0);
    },
    getEnrollment: async (userId: string, courseId: string): Promise<IEnrollment | null> => {
        return repository.getEnrollment(userId, courseId);
    },
    getCourseDetails: async (courseId: string): Promise<ICourse | null> => {
        return repository.getCourseById(courseId);
    },
    isCoursePurchased: async (userId: string, courseId: string): Promise<boolean> => {
        const enrollment = await repository.isCoursePurchased(userId, courseId);
        return !!enrollment; // Return true if enrollment exists, otherwise false
    },
    getCourseDetailsWithContents: async (userId: string, courseId: string): Promise<{ course: ICourse | null, isPurchased: boolean, modules: any[] }> => {
        return repository.getCourseDetailsWithContents(userId, courseId);
    }
});

