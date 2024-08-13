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
exports.createUserCourseRepository = void 0;
// src/application/repositories/CourseEnrollmentRepository.ts
const Enrollment_1 = __importDefault(require("../../infrastructure/database/models/Enrollment"));
const Course_1 = __importDefault(require("../../infrastructure/database/models/Course"));
const mongoose_1 = __importDefault(require("mongoose"));
const createUserCourseRepository = () => ({
    getUserPurchasedCourses: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdObj = mongoose_1.default.Types.ObjectId(userId); // Convert to ObjectId
        // Find all enrollments for the given user
        const enrollments = yield Enrollment_1.default.find({ userId: userIdObj });
        // Extract course IDs from enrollments
        const courseIds = enrollments
            .map(enrollment => enrollment.courses.map(courseDetail => courseDetail.courseId))
            .reduce((acc, courseIdArray) => acc.concat(courseIdArray), []); // Flatten array
        // Find all courses based on the extracted course IDs
        return yield Course_1.default.find({ _id: { $in: courseIds } }, { instructorId: 0 });
    }),
    enrollCourse: (userId, courseId, paymentId, amount) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdObj = mongoose_1.default.Types.ObjectId(userId); // Convert to ObjectId
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId); // Convert to ObjectId
        // Create a new enrollment
        const newEnrollment = new Enrollment_1.default({
            userId: userIdObj,
            courses: [Object.assign({ courseId: courseIdObj, price: amount }, (paymentId ? { paymentId } : {}))]
        });
        return yield newEnrollment.save();
    }),
    getEnrollment: (userId, paymentId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdObj = mongoose_1.default.Types.ObjectId(userId);
        console.log(`userIdObj: ${userIdObj} paymentId: ${paymentId}`);
        // First, let's just try to find the document
        const data = yield Enrollment_1.default.findOne({
            userId: userIdObj,
            'courses.paymentId': paymentId
        });
        console.log('Found data:', data);
        if (!data) {
            console.log('No matching document found');
            return null;
        }
        // If we found a document, now let's update it
        const enrollment = yield Enrollment_1.default.findOneAndUpdate({
            userId: userIdObj,
            'courses.paymentId': paymentId
        }, { $set: { 'courses.$.status': 'paid' } }, { new: true });
        if (courseId) {
            yield Course_1.default.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
        }
        console.log('Updated enrollment:', enrollment);
        return enrollment;
    }),
    getCourseById: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId);
        try {
            const courseDetails = yield Course_1.default.aggregate([
                { $match: { _id: courseIdObj } },
                {
                    $addFields: {
                        instructorId: { $toObjectId: "$instructorId" }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructorId',
                        foreignField: '_id',
                        as: 'instructorDetails'
                    }
                },
                { $unwind: { path: '$instructorDetails', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        instructorName: { $ifNull: ['$instructorDetails.name', 'N/A'] },
                        instructorEmail: { $ifNull: ['$instructorDetails.email', 'N/A'] }
                    }
                },
                {
                    $project: {
                        instructorDetails: 0
                    }
                }
            ]);
            // console.log('courseDetails', courseDetails);
            return courseDetails.length ? courseDetails[0] : null;
        }
        catch (error) {
            console.error('Error fetching course details:', error);
            throw error;
        }
    }),
    getCourseAmountById: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId);
        console.log('courseIdObj:', courseIdObj);
        try {
            const course = yield Course_1.default.findById(courseIdObj).lean();
            // console.log('Raw course data:', course);
            if (!course) {
                console.log('No course found with this ID');
                return null;
            }
            if (!('fees' in course)) {
                console.log('Course found, but no fees field present');
                return null;
            }
            return course.fees;
        }
        catch (error) {
            console.error('Error fetching course amount:', error);
            throw error;
        }
    }),
    isCoursePurchased: (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const userIdObj = mongoose_1.default.Types.ObjectId(userId);
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId);
        // Check if there is an enrollment for the user with the given course ID
        const enrollment = yield Enrollment_1.default.findOne({
            userId: userIdObj,
            'courses.courseId': courseIdObj
        });
        // Return true if enrollment exists, otherwise false
        return !!enrollment;
    })
});
exports.createUserCourseRepository = createUserCourseRepository;
