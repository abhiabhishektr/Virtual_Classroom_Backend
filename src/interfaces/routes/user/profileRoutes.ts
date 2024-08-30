import { Router } from 'express';
import { viewProfile, editProfile, changePassword } from '../../controllers/profileController';
import { createTeacherRequest, teacherRequestStatus } from '../../controllers/teacher/teacherReqController';
import { getCourses } from '../../controllers/teacher/courseController';
import {
    getUserPurchasedCourses,
    checkCoursePurchased, 
    getCourseDetails, 
    CoursePurchaseHistory
} from '../../controllers/user/userCourseController';
import {
    createOrder
    , verifyOrder
} from '../../controllers/user/coursePaymentController';


import {
    addCourseReview,
    updateCourseReview,
    getCourseReviews,
    getUserReviewForCourse
} from '../../controllers/user/courseReviewController';
import { markContentAsCompleted, markContentAsImportant, unmarkContentAsCompleted, unmarkContentAsImportant } from '../../controllers/user/userProgressController';
import { logoutUser } from '../../controllers/authenticationController';

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
 

// Reviews
router.post('/:courseId/reviews', addCourseReview);
router.put('/:courseId/reviews/:reviewId', updateCourseReview);
router.get('/:courseId/reviews', getCourseReviews);
router.get('/:courseId/reviews/user', getUserReviewForCourse); //(not using now)

//paymet
router.post('/payment/orders', createOrder);
router.post('/payment/verify', verifyOrder);




// mark import content & checkbox bookmark
router.post('/content/:contentId/complete', markContentAsCompleted);
router.post('/content/:contentId/uncomplete', unmarkContentAsCompleted);
router.post('/content/:contentId/important', markContentAsImportant);
router.post('/content/:contentId/unimportant', unmarkContentAsImportant);




router.post('/logout', logoutUser);
export default router;
