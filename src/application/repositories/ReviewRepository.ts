// src/application/repositories/ReviewRepository.ts
import ReviewModel, { IReview } from '../../infrastructure/database/models/Review';
import mongoose from 'mongoose';
import { ICourse } from '../../infrastructure/database/models/Course';

export interface IReviewRepository {
    getReviewsForCourse(courseId: string, userId: string): Promise<IReview[]>;
    getReviewByUserAndCourse(userId: string, courseId: string): Promise<IReview | null>;
    addReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview>;
    updateReview(userId: string, courseId: string, reviewId: string, rating: number, comment: string): Promise<IReview | null>;
    deleteReview(reviewId: string): Promise<boolean>;
}

export const createReviewRepository = (): IReviewRepository => ({
    getReviewsForCourse: async (courseId: string , userId: string): Promise<IReview[]> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const userIdObj = mongoose.Types.ObjectId(userId);

        const reviews = await ReviewModel.aggregate([
            { 
                $match: { courseId: courseIdObj } 
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    courseId: 1,
                    rating: 1,
                    comment: 1,
                    date: 1,
                    'userDetails.name': 1
                }
            },
            {
                $addFields: {
                    userName: '$userDetails.name',
                    isCurrentUser: { $eq: ['$userId', userIdObj] }
                }
            },
            {
                $sort: { isCurrentUser: -1, date: -1 } 
            },
            {
                $project: {
                    userDetails: 0,
                    isCurrentUser: 0
                }
            }
        ]);
    
        return reviews;
    },
    getReviewByUserAndCourse: async (userId: string, courseId: string): Promise<IReview | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        return ReviewModel.findOne({ userId: userIdObj, courseId: courseIdObj });
    },
    addReview: async (userId: string, courseId: string, rating: number, comment: string): Promise<IReview> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const newReview = new ReviewModel({
            userId: userIdObj,
            courseId: courseIdObj,
            rating,
            comment
        });
        return newReview.save();
    },
    updateReview: async (userId: string, courseId: string, reviewId: string, rating: number, comment: string): Promise<IReview | null> => {
        const reviewIdObj = mongoose.Types.ObjectId(reviewId);
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);

        return ReviewModel.findOneAndUpdate(
            { _id: reviewIdObj, userId: userIdObj, courseId: courseIdObj },
            { rating, comment },
            { new: true }
        );
    },
    deleteReview: async (reviewId: string): Promise<boolean> => {
        const reviewIdObj = mongoose.Types.ObjectId(reviewId);
        const result = await ReviewModel.deleteOne({ _id: reviewIdObj });
        return result.deletedCount === 1;
    }
});
