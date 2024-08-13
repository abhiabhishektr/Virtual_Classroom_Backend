"use strict";
// backend/src/interfaces/routes/profileRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { viewProfile, editProfile } from '../controllers/profileController';
const adminController_1 = require("../../controllers/admin/adminController");
const teacherReqController_1 = require("../../controllers/teacher/teacherReqController");
const router = (0, express_1.Router)();
router.get('/getUsers', adminController_1.getUsers);
router.put('/block/:id', adminController_1.blockUser);
router.put('/unblock/:id', adminController_1.unblockUser);
router.get('/teacher-requests', teacherReqController_1.getAllTeacherRequests);
router.put('/teacher-requests/:id/status', teacherReqController_1.updateTeacherRequestStatus);
router.delete('/teacher-requests/:id', teacherReqController_1.deleteTeacherRequest);
exports.default = router;
