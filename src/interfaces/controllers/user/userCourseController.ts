// src/interfaces/controllers/user/userCourseController.ts
import { Request, Response } from 'express';
import { createUserCourseUseCase } from '../../../application/use-cases/user/CourseEnrollmentUseCase';
import { createUserCourseRepository } from '../../../application/repositories/CourseEnrollmentRepository';
import { User } from '../../../types/user';
import { ExtendedCourse, ICourse } from '../../../infrastructure/database/models/Course';
import { mapToCourseListingDTO } from '../../dots/CourseDTO';
import { createReviewRepository } from '../../../application/repositories/ReviewRepository';
import { createReviewUseCase } from '../../../application/use-cases/user/ReviewUseCase';


const userRepository = createUserCourseRepository();
const useCase = createUserCourseUseCase(userRepository);

const reviewRepository = createReviewRepository();
const reviewUseCase = createReviewUseCase(reviewRepository);

export const getUserPurchasedCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const courses = await useCase.getUserPurchasedCourses(userId);

        res.status(200).json({data :courses.map(mapToCourseListingDTO)});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchased courses', error });
    }
};


export const checkCoursePurchased = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { courseId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        const enrollment = await useCase.getEnrollment(userId, courseId);
        const isPurchased = enrollment !== null;

        res.status(200).json({ isPurchased });
    } catch (error) {
        res.status(500).json({ message: 'Error checking course purchase status', error });
    }
};

export const getCourseDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const userId = (req.user as User)?.id ?? null; // Extract user ID from request

        if (!courseId) {
            res.status(400).json({ message: 'Course ID is required' });
            return;
        }

        // Fetch course details with contents
        const limitContents = 0; // Default limit for contents
        const { course, isPurchased, modules } = await useCase.getCourseDetailsWithContents(userId, courseId);
        console.log("modules: ", modules[0].contents);
        console.log("isPurchased: ", isPurchased);
        // console.log("course: ", course);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // If the course is purchased, fetch all contents
        const finalModules = isPurchased ? modules : modules.map(module => ({
            ...module,
            contents: module.contents.map(content => ({ ...content, url: undefined })) // Hide URLs if not purchased
        }));
        console.log("finalModules: ", finalModules[0].contents);

        // Combine course details with additional properties
        const responseData = {
            ...course,
            isPurchased,
            modules: finalModules
        };
        // console.log("responseData: ", responseData);

        res.status(200).json({
            data: responseData
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course details', error });
    }
};


interface PurchaseDTO {
    courseId: string;
    courseTitle: string;
    purchaseDate: string;
    amount: number;
}

export const CoursePurchaseHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract user ID from the request
        const userId = (req.user as User)?.id;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }

        // Fetch the raw purchase data
        const courses: ICourse[] = await useCase.getUserPurchasedCourses(userId);

        if (courses.length === 0) {
            res.status(404).json({ message: 'No purchase history found' });
            return;
        }

        const purchases: PurchaseDTO[] = courses.map(course => ({
            courseId: course._id.toString(), // Convert ObjectId to string if necessary
            courseTitle: course.title,
            purchaseDate: new Date().toISOString(), // Replace with actual purchase date if available
            amount: course.fees // Assuming fees is the purchase amount
        }));

        res.status(200).json({ data: purchases });
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Error fetching purchase history', error });
    }
};