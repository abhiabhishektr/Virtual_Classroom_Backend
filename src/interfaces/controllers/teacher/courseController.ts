import { Request, Response } from 'express';
import * as courseService from '../../../application/services/courseService';
import cloudinary from '../../../infrastructure/cloudinaryConfig';
import { log } from 'console';
import {User} from '../../../types/user';


export const createCourse = async (req: Request, res: Response): Promise<any> => {

    try {
        // console.log(req.body);

        if (!req.file) {
            console.log("no file");
            return res.status(400).send('No file uploaded.');
        }

        const fileStr = req.file.buffer.toString('base64');

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
            folder: 'courses',
            resource_type: 'auto',
        });

        const instructorId = (req.user as User)?.id ?? null;
        // The Cloudinary URL is available in the response
        const publicUrl = uploadResponse.secure_url;

        // Create course with the uploaded image URL
        const courseData = {
            ...req.body,
            imageUrl: publicUrl, // Assuming your course schema includes an imageUrl field
            instructorId: instructorId, // Assuming your course schema includes an imageUrl field
        };

        const course = await courseService.createNewCourse(courseData);
        res.status(201).json(course);
    } catch (error: any) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: error.message });
    }
};


// export const createCourse = async (req: Request, res: Response): Promise<void> => {
//   try {

//     const course = await courseService.createNewCourse(req.body);
//     res.status(201).json(course);
//   } catch (error : any) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.updateExistingCourse(req.params.id, req.body);
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.deleteCourseById(req.params.id);
        if (course) {
            res.status(200).json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.getCourseDetails(req.params.id);
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const courses = await courseService.getAllCourseDetails();
        console.log("courses",courses);
        
        res.status(200).json(courses);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getCoursesbyTeacher = async (_req: Request, res: Response): Promise<void> => {
    try {
 
        const courses = await courseService.getAllCourseDetailsbyTeacher( (_req.user as User)?.id ?? null);
        console.log("courses",courses);
        res.status(200).json(courses);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
