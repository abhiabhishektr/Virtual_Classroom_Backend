// src/application/use-cases/user/UserProgressUseCase.ts
import { IUserProgressRepository } from '../../repositories/UserProgressRepository';
import { IUserProgress } from '../../../infrastructure/database/models/UserProgress';

export const createUserProgressUseCase = (repository: IUserProgressRepository) => ({
    getUserProgress: async (userId: string, courseId: string): Promise<IUserProgress | null> => {
        return repository.getUserProgress(userId, courseId);
    },
    markContentAsCompleted: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        return repository.markContentAsCompleted(userId, courseId, contentId);
    },
    unmarkContentAsCompleted: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        return repository.unmarkContentAsCompleted(userId, courseId, contentId);
    },
    markContentAsImportant: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        return repository.markContentAsImportant(userId, courseId, contentId);
    },
    unmarkContentAsImportant: async (userId: string, courseId: string, contentId: string): Promise<IUserProgress | null> => {
        return repository.unmarkContentAsImportant(userId, courseId, contentId);
    }
});
