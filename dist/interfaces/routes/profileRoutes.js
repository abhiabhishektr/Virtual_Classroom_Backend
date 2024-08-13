"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const teacherReqController_1 = require("../controllers/teacher/teacherReqController");
const courseController_1 = require("../controllers/teacher/courseController");
const userCourseController_1 = require("../controllers/user/userCourseController");
const coursePaymentController_1 = require("../controllers/user/coursePaymentController");
const router = (0, express_1.Router)();
// Profile routes
router.get('/', profileController_1.viewProfile);
router.put('/', profileController_1.editProfile);
router.post('/change-password', profileController_1.changePassword);
// Teacher request routes
router.post('/teacher-request', teacherReqController_1.createTeacherRequest);
router.get('/teacher-request-status', teacherReqController_1.teacherRequestStatus);
// Course routes for teachers
router.get('/all-courses', courseController_1.getCourses);
// User course routes
router.get('/user-courses', userCourseController_1.getUserPurchasedCourses); // Fetch user's purchased courses
router.get('/course/:courseId/purchased', userCourseController_1.checkCoursePurchased); // Check if a course is purchased (not using now)
router.get('/course/:courseId', userCourseController_1.getCourseDetails); // Fetch course details by ID
router.get('/coursePurchaseHistory', userCourseController_1.CoursePurchaseHistory); // Fetch course details by ID
//paymet
router.post('/payment/orders', coursePaymentController_1.createOrder);
router.post('/payment/verify', coursePaymentController_1.verifyOrder);
exports.default = router;
