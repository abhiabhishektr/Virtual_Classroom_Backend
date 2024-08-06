import { Router } from 'express';
import { viewProfile, editProfile, changePassword } from '../controllers/profileController';
import { createTeacherRequest, teacherRequestStatus } from '../controllers/teacher/teacherReqController';
import { getCourses } from '../controllers/teacher/courseController';
import {
    getUserPurchasedCourses,
    checkCoursePurchased,
    getCourseDetails, // Import the new controller method
    CoursePurchaseHistory
} from '../controllers/user/userCourseController';
import {
    createOrder
    , verifyOrder
} from '../controllers/user/coursePaymentController';


const router = Router();

// Profile routes
router.get('/', viewProfile);
router.put('/', editProfile);
router.post('/change-password', changePassword);

// Teacher request routes
router.post('/teacher-request', createTeacherRequest);
router.get('/teacher-request-status', teacherRequestStatus);

// Course routes for teachers
router.get('/all-courses', getCourses);

// User course routes
router.get('/user-courses', getUserPurchasedCourses); // Fetch user's purchased courses
router.get('/course/:courseId/purchased', checkCoursePurchased); // Check if a course is purchased (not using now)
router.get('/course/:courseId', getCourseDetails); // Fetch course details by ID
router.get('/coursePurchaseHistory', CoursePurchaseHistory); // Fetch course details by ID

//paymet
router.post('/payment/orders', createOrder);
router.post('/payment/verify', verifyOrder);
export default router;
