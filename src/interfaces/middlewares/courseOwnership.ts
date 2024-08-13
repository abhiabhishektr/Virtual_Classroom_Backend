import { Request, Response, NextFunction } from 'express';
import * as courseService from '../../application/services/courseService';
import { User } from '../../types/user';

const checkCourseOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {courseId} = req.body.courseId; // Adjust based on your routes
    const teacherId =  (req.user as User)?.id ?? null; // Assuming `req.user` contains the authenticated teacher's ID

    const course = await courseService.getCourseDetails(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId.toString() !== teacherId) {
      return res.status(403).json({ message: 'You do not have permission to modify this course' });
    }

    next();
  } catch (error : any) {
    res.status(500).json({ message: error.message });
  }
};

export default checkCourseOwnership;
