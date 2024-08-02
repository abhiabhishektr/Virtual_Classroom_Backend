"use strict";
// backend/src/interfaces/routes/profileRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const teacherController_1 = require("../controllers/teacher/teacherController");
const router = (0, express_1.Router)();
router.get('/', profileController_1.viewProfile);
router.put('/', profileController_1.editProfile);
router.post('/change-password', profileController_1.changePassword);
router.post('/teacher-request', teacherController_1.createTeacherRequest);
exports.default = router;
