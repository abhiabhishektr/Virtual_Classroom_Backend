"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importStar(require("multer"));
const teacherReqController_1 = require("../../controllers/teacher/teacherReqController");
// Middleware to handle file upload errors
const courseController_1 = require("../../controllers/teacher/courseController");
const CourseContentController_1 = require("../../controllers/teacher/CourseContentController");
const router = (0, express_1.Router)();
const uploadvideo = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Setup multer for handling file uploads with file size limit (e.g., 1MB)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
}).single('image'); // The field name should match the one in your form
// Middleware to handle file upload errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer_1.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds the 1MB limit' });
            }
            return res.status(400).json({ message: err.message });
        }
        else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};
// Route to get a teacher request by ID
router.get('/requests/:id', teacherReqController_1.getTeacherRequestById);
// Route to create a new teacher request
router.post('/courses', uploadMiddleware, courseController_1.createCourse);
// Route to update a course
router.put('/courses/:id', uploadMiddleware, courseController_1.updateCourse);
router.put('/contents/:id', courseController_1.updateContents);
router.get('/getCoursesbyTeacher', courseController_1.getCoursesbyTeacher);
router.get('/getCourseByIdTeacher/:id', courseController_1.getCourse);
// Route to delete a course
router.delete('/deleteCourse/:id', courseController_1.deleteCourse);
router.post('/modules', CourseContentController_1.addModule);
router.get('/modules/course/:courseId', CourseContentController_1.getCourseModules);
router.get('/modules/:moduleId', CourseContentController_1.getModuleById); // not using now
router.post('/content/:courseId/modules/:moduleId/chapters/:chapterId/contents', uploadvideo.single('file'), CourseContentController_1.uploadContent);
router.put('/modules/:moduleId', CourseContentController_1.updateModule);
// router.put('/modules/:moduleId', updateChapter);
router.delete('/modules/:chapterId', CourseContentController_1.deleteModule);
// router.put('/content', updateContent);
router.delete('/content', CourseContentController_1.deleteContent);
exports.default = router;
// import checkCourseOwnership from '../../middlewares/courseOwnership';
// router.post('/modules',checkCourseOwnership, addModule);
// router.get('/modules/course/:courseId', getCourseModules);
// router.get('/modules/:moduleId', getModuleById);// not using now
// router.put('/modules/:moduleId',checkCourseOwnership, updateModule);
// router.delete('/modules/:chapterId',checkCourseOwnership, deleteModule);
// router.delete('/modules',checkCourseOwnership, deleteContent);
