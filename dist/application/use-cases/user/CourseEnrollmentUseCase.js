"use strict";
// src/application/use-cases/user/CourseEnrollmentUseCase.ts
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
exports.createUserCourseUseCase = void 0;
const createUserCourseUseCase = (repository) => ({
    getUserPurchasedCourses: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.getUserPurchasedCourses(userId);
    }),
    enrollCourse: (userId, courseId, enrollmentDetails) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if user is already enrolled in the course
        const existingEnrollment = yield repository.getEnrollment(userId, courseId);
        if (existingEnrollment) {
            throw new Error('User is already enrolled in this course');
        }
        return repository.enrollCourse(userId, courseId, enrollmentDetails, 0);
    }),
    getEnrollment: (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.getEnrollment(userId, courseId);
    }),
    getCourseDetails: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.getCourseById(courseId);
    }),
    isCoursePurchased: (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const enrollment = yield repository.isCoursePurchased(userId, courseId);
        return !!enrollment; // Return true if enrollment exists, otherwise false
    })
});
exports.createUserCourseUseCase = createUserCourseUseCase;
