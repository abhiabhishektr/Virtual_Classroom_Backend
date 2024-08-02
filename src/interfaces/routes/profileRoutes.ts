    // backend/src/interfaces/routes/profileRoutes.ts

import { Router } from 'express';
import { viewProfile, editProfile ,changePassword} from '../controllers/profileController';
import { createTeacherRequest ,teacherRequestStatus} from '../controllers/teacher/teacherReqController';
import { getCourses } from '../controllers/teacher/courseController';

const router = Router();

router.get('/', viewProfile);
router.put('/', editProfile);
router.post('/change-password', changePassword);

router.post('/teacher-request',  createTeacherRequest);
router.get('/teacher-request-status', teacherRequestStatus);

router.get('/getCourse',getCourses );

export default router;
