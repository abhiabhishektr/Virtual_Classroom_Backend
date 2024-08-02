import { Router } from 'express';
import multer from 'multer';
import { 
  getAllTeacherRequests, 
  getTeacherRequestById, 
  updateTeacherRequestStatus 
} from '../../controllers/teacher/teacherReqController';

import { 
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourse,
  getCoursesbyTeacher,
} from '../../controllers/teacher/courseController';

const router = Router();

// Setup multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });



// Route to get a teacher request by ID
router.get('/requests/:id', getTeacherRequestById);

// Route to create a new teacher request
router.post('/courses', upload.single('image'), createCourse);
// Route to update a course
router.put('/courses/:id', upload.array('images'), updateCourse);

router.get('/getCoursesbyTeacher', getCoursesbyTeacher);

router.get('/getCourseByIdTeacher/:id', getCourse);

// Route to delete a course
router.delete('/courses/:id', deleteCourse);

export default router;
