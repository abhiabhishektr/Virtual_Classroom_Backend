// backend/src/interfaces/routes/profileRoutes.ts

import { Router } from 'express';
// import { viewProfile, editProfile } from '../controllers/profileController';
import { getUsers, blockUser, unblockUser, getDashboardDataController } from '../../controllers/admin/adminController';
import { getAllTeacherRequests, updateTeacherRequestStatus ,deleteTeacherRequest } from '../../controllers/teacher/teacherReqController';
import { startLiveClass } from '../../controllers/liveClassController';
import { blockCourse,getCourses, report, unblockCourse } from '../../controllers/admin/CourseControllerAdmin';

const router = Router();


//dashbord
router.get('/dashboard', getDashboardDataController);



//user management
router.get('/getUsers', getUsers);
router.put('/block/:id', blockUser);
router.put('/unblock/:id', unblockUser);

// teacher Management
router.get('/teacher-requests', getAllTeacherRequests);
router.put('/teacher-requests/:id/status', updateTeacherRequestStatus);
router.delete('/teacher-requests/:id', deleteTeacherRequest);


// course Management
router.get('/courses', getCourses);
router.patch('/courses/:courseId/block', blockCourse);
router.patch('/courses/:courseId/unblock', unblockCourse);

//admin notification and other things controll
router.post('/start-live-session', startLiveClass);


//reports view admin 
router.get('/getreportIssue', report);



export default router;
