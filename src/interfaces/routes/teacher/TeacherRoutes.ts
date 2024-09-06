import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import {
    getAllTeacherRequests,
    getTeacherRequestById,
    teacherDashboardController,
    updateTeacherRequestStatus
} from '../../controllers/teacher/teacherReqController';
// Middleware to handle file upload errors

import {
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourse,
    getCoursesbyTeacher,
    updateContents,
} from '../../controllers/teacher/courseController';



import {
    getCourseModules,
    addModule,
    getModuleById,
    updateModule,
    deleteModule,
    deleteContent,
    updateContent,
    uploadContent,
    renameModule
} from '../../controllers/teacher/CourseContentController';

// ownerShip middleware
import checkCourseOwnership from '../../middlewares/courseOwnership';


const router = Router();

const uploadvideo = multer({ storage: multer.memoryStorage() }).single('file');

// Setup multer for handling file uploads with file size limit (e.g., 1MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
}).single('image'); // The field name should match the one in your form



// Middleware to handle file upload errors
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
        if (err instanceof MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds the 1MB limit' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};


router.get('/dashboard', teacherDashboardController);

// Route to get a teacher request by ID
router.get('/requests/:id', getTeacherRequestById);

// Route to create a new teacher request
router.post('/courses', uploadMiddleware, createCourse);

// Route to update a course
router.put('/courses/:id', uploadMiddleware, updateCourse);

router.put('/contents/:id', updateContents);

router.get('/getCoursesbyTeacher', getCoursesbyTeacher);

router.get('/getCourseByIdTeacher/:id', getCourse);

// Route to delete a course
router.delete('/deleteCourse/:id', deleteCourse);







router.post('/modules', addModule);
router.get('/modules/course/:courseId', getCourseModules);
router.get('/modules/:moduleId', getModuleById); // not using now


router.post('/content/:courseId/modules/:moduleId/contents', uploadvideo, uploadContent);
router.put('/modules/:moduleId', updateModule);
router.put('/courses/:courseId/modules/:moduleId/chapters/:chapterId', renameModule);
// router.put('/modules/:moduleId', updateChapter);
router.delete('/modules/:chapterId', deleteModule);



router.put('/content', updateContent);
router.delete('/content', deleteContent);


export default router;









// import checkCourseOwnership from '../../middlewares/courseOwnership';
// router.post('/modules',checkCourseOwnership, addModule);
// router.get('/modules/course/:courseId', getCourseModules);
// router.get('/modules/:moduleId', getModuleById);// not using now
// router.put('/modules/:moduleId',checkCourseOwnership, updateModule);
// router.delete('/modules/:chapterId',checkCourseOwnership, deleteModule);
// router.delete('/modules',checkCourseOwnership, deleteContent);

