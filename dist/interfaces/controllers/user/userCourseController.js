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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursePurchaseHistory = exports.getCourseDetails = exports.checkCoursePurchased = exports.getUserPurchasedCourses = void 0;
const CourseEnrollmentUseCase_1 = require("../../../application/use-cases/user/CourseEnrollmentUseCase");
const CourseEnrollmentRepository_1 = require("../../../application/repositories/CourseEnrollmentRepository");
const CourseDTO_1 = require("../../dots/CourseDTO");
const userRepository = (0, CourseEnrollmentRepository_1.createUserCourseRepository)();
const useCase = (0, CourseEnrollmentUseCase_1.createUserCourseUseCase)(userRepository);
const getUserPurchasedCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const courses = yield useCase.getUserPurchasedCourses(userId);
        res.status(200).json({ data: courses.map(CourseDTO_1.mapToCourseListingDTO) });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching purchased courses', error });
    }
});
exports.getUserPurchasedCourses = getUserPurchasedCourses;
const checkCoursePurchased = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        const { courseId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const enrollment = yield useCase.getEnrollment(userId, courseId);
        const isPurchased = enrollment !== null;
        res.status(200).json({ isPurchased });
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking course purchase status', error });
    }
});
exports.checkCoursePurchased = checkCoursePurchased;
const getCourseDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId } = req.params;
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null; // Extract user ID from request
        if (!courseId) {
            res.status(400).json({ message: 'Course ID is required' });
            return;
        }
        const course = yield useCase.getCourseDetails(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        // Check if the course is purchased by the user
        const isPurchased = userId ? yield useCase.isCoursePurchased(userId, courseId) : false;
        // Combine course details with additional property
        const responseData = Object.assign(Object.assign({}, course), { isPurchased });
        res.status(200).json({
            data: responseData
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching course details', error });
    }
});
exports.getCourseDetails = getCourseDetails;
const CoursePurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract user ID from the request
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        // Fetch the raw purchase data
        const courses = yield useCase.getUserPurchasedCourses(userId);
        if (courses.length === 0) {
            res.status(404).json({ message: 'No purchase history found' });
            return;
        }
        const purchases = courses.map(course => ({
            courseId: course._id.toString(), // Convert ObjectId to string if necessary
            courseTitle: course.title,
            purchaseDate: new Date().toISOString(), // Replace with actual purchase date if available
            amount: course.fees // Assuming fees is the purchase amount
        }));
        res.status(200).json({ data: purchases });
    }
    catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Error fetching purchase history', error });
    }
});
exports.CoursePurchaseHistory = CoursePurchaseHistory;
