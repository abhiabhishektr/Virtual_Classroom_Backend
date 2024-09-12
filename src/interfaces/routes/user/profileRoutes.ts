import { Router } from 'express';
import { viewProfile, editProfile, changePassword } from '../../controllers/profileController';
import { createTeacherRequest, teacherRequestStatus } from '../../controllers/teacher/teacherReqController';
import { getCourses } from '../../controllers/teacher/courseController';
import {
    getUserPurchasedCourses,
    checkCoursePurchased, 
    getCourseDetails, 
    CoursePurchaseHistory,
    saveToWishlistController,
    removeFromWishlistController,
    allbookmark,
    removePurchasedItemsFromWishlist,
    report
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
import { notificationController } from '../../controllers/user/PushNotificationController';

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

//User Notification Routes
router.use('/notifications', notificationController);

//paymet
router.post('/payment/orders', createOrder);
router.post('/payment/verify', verifyOrder);

// Course Bookark
router.get('/allbookmark',  allbookmark);  // Save course to wishlist
router.delete('/allbookmark',  removePurchasedItemsFromWishlist);  // Save course to wishlist
router.post('/wishlist/save',  saveToWishlistController);  // Save course to wishlist
router.delete('/wishlist/unsave/:courseId',removeFromWishlistController)

 
// mark import content & checkbox bookmark
router.post('/content/:contentId/complete', markContentAsCompleted);
router.post('/content/:contentId/uncomplete', unmarkContentAsCompleted);
router.post('/content/:contentId/important', markContentAsImportant);
router.post('/content/:contentId/unimportant', unmarkContentAsImportant);

// course report 
router.post('/reportIssue', report);




router.post('/logout', logoutUser);
export default router;



// Notification seen status
// router.post('/notifications', NotificationController.createNotification);
// router.get('/notifications/:userId', NotificationController.getUserNotifications);
// router.put('/notifications/:userId/:notificationId/seen', NotificationController.markAsSeen);
// router.get('/notifications/:userId/:notificationId/status', NotificationController.getNotificationStatus);
// NotificationStatusRepository.ts
// NotificationUseCase.ts
// NotificationController.ts
// schema