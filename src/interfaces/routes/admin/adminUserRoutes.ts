// backend/src/interfaces/routes/profileRoutes.ts

import { Router } from 'express';
// import { viewProfile, editProfile } from '../controllers/profileController';
import { getUsers, blockUser, unblockUser } from '../../controllers/admin/adminController';
import { getAllTeacherRequests, updateTeacherRequestStatus ,deleteTeacherRequest } from '../../controllers/teacher/teacherReqController';

const router = Router();

router.get('/getUsers', getUsers);
router.put('/block/:id', blockUser);
router.put('/unblock/:id', unblockUser);


router.get('/teacher-requests', getAllTeacherRequests);
router.put('/teacher-requests/:id/status', updateTeacherRequestStatus);
router.delete('/teacher-requests/:id', deleteTeacherRequest);

export default router;
