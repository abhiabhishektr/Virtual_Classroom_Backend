// src/application/use-cases/user/ReviewUseCase.ts
import { IReviewRepository } from '../../repositories/ReviewRepository';
import { IReview } from '../../../infrastructure/database/models/Review';

export const createReviewUseCase = (repository: IReviewRepository) => ({
    getReviewsForCourse: async (courseId: string,userId: string): Promise<IReview[]> => {
        return repository.getReviewsForCourse(courseId,userId);
    },
    getReviewByUserAndCourse: async (userId: string, courseId: string): Promise<IReview | null> => {
        return repository.getReviewByUserAndCourse(userId, courseId);
    },
    addReview: async (userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null> => {
        const existingReview = await repository.getReviewByUserAndCourse(userId, courseId);
        if (existingReview) {
         return repository.updateReview(userId, courseId, existingReview._id.toString(), rating, comment);            
            // throw new Error('User has already reviewed this course');
        }
        return repository.addReview(userId, courseId, rating, comment);
    },
    updateReview: async (userId: string, courseId: string, reviewId: string, rating: number, comment: string): Promise<IReview | null> => { // Updated function signature
        const existingReview = await repository.getReviewByUserAndCourse(userId, courseId);
        if (!existingReview || existingReview._id.toString() !== reviewId) {
            throw new Error('Review not found or not authorized to update');
        }
        return repository.updateReview(userId, courseId, reviewId, rating, comment);
    },
    deleteReview: async (reviewId: string): Promise<boolean> => {
        return repository.deleteReview(reviewId);
    }
});
