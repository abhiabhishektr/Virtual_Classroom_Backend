// src/interfaces/controllers/user/courseReviewController.ts
import { Request, Response } from 'express';
import { createReviewUseCase } from '../../../application/use-cases/user/ReviewUseCase';
import { createReviewRepository } from '../../../application/repositories/ReviewRepository';
import { User } from '../../../types/user';
import { IReview } from '../../../infrastructure/database/models/Review';

const reviewRepository = createReviewRepository();
const reviewUseCase = createReviewUseCase(reviewRepository);

export const addCourseReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { courseId } = req.params;
        const { rating, comment } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        const review: IReview | null = await reviewUseCase.addReview(userId, courseId, rating, comment);
        res.status(201).json({ message: 'Review added successfully', data: review });
    } catch (error) {
        res.status(500).json({ message: 'Error adding course review', error });
    }
};

export const updateCourseReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { courseId, reviewId } = req.params;
        const { rating, comment } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        const review: IReview | null = await reviewUseCase.updateReview(userId, courseId, reviewId, rating, comment);
        if (!review) {
            res.status(404).json({ message: 'Review not found or not authorized to update' });
            return;
        }

        res.status(200).json({ message: 'Review updated successfully', data: review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating course review', error });
    }
};


export const getCourseReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        
        const reviews = await reviewUseCase.getReviewsForCourse(courseId, (req.user as User)?.id);
        
        if (reviews.length === 0) {
            res.status(404).json({ message: 'No reviews found for this course' });
            return;
        }

        res.status(200).json({ data: reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course reviews', error });
    }
};

export const getUserReviewForCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { courseId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        const review = await reviewUseCase.getReviewByUserAndCourse(userId, courseId);
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        res.status(200).json({ data: review });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user review for course', error });
    }
};
