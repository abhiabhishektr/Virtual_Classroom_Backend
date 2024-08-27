import UserProgress, { IUserProgress } from '../../infrastructure/database/models/UserProgress';
import mongoose from 'mongoose';

export interface IUserProgressRepository {
    getUserProgress(userId: string, courseId: string): Promise<IUserProgress | null>;
    markContentAsCompleted(userId: string, courseId: string, contentId: string): Promise<IUserProgress | null>;
    unmarkContentAsCompleted(userId: string, courseId: string, contentId: string): Promise<IUserProgress | null>;
    markContentAsImportant(userId: string, courseId: string, contentId: string): Promise<IUserProgress | null>;
    unmarkContentAsImportant(userId: string, courseId: string, contentId: string): Promise<IUserProgress | null>;
}

export const createUserProgressRepository = (): IUserProgressRepository => ({
    getUserProgress: async (userId: string, courseId: string): Promise<IUserProgress | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        return UserProgress.findOne(
            { userId: userIdObj, courseId: courseIdObj },
            { userId: 0 } // Projection to exclude userId
        );
    },
    markContentAsCompleted: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const contentIdObj = mongoose.Types.ObjectId(contentId);

        return UserProgress.findOneAndUpdate(
            { userId: userIdObj, courseId: courseIdObj },
            { $addToSet: { completedContentIds: contentIdObj } },
            { new: true, upsert: true, projection: { userId: 0 } } // Projection to exclude userId
        );
    },
    unmarkContentAsCompleted: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const contentIdObj = mongoose.Types.ObjectId(contentId);

        return UserProgress.findOneAndUpdate(
            { userId: userIdObj, courseId: courseIdObj },
            { $pull: { completedContentIds: contentIdObj } },
            { new: true, projection: { userId: 0 } } // Projection to exclude userId
        );
    },
    markContentAsImportant: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const contentIdObj = mongoose.Types.ObjectId(contentId);

        return UserProgress.findOneAndUpdate(
            { userId: userIdObj, courseId: courseIdObj },
            { $addToSet: { importantContentIds: contentIdObj } },
            { new: true, upsert: true, projection: { userId: 0 } } // Projection to exclude userId
        );
    },
    unmarkContentAsImportant: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const contentIdObj = mongoose.Types.ObjectId(contentId);

        return UserProgress.findOneAndUpdate(
            { userId: userIdObj, courseId: courseIdObj },
            { $pull: { importantContentIds: contentIdObj } },
            { new: true, projection: { userId: 0 } } // Projection to exclude userId
        );
    }
});
