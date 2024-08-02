"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("../../controllers/teacher/teacherController");
const router = (0, express_1.Router)();
// Route to create a new teacher request
// Route to get all teacher requests (admin only)
router.get('/requests', teacherController_1.getAllTeacherRequests);
// Route to get a teacher request by ID
router.get('/requests/:id', teacherController_1.getTeacherRequestById);
// Route to update the status of a teacher request (admin only)
router.put('/requests/:id/status', teacherController_1.updateTeacherRequestStatus);
exports.default = router;
