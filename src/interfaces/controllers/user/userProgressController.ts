// src/interfaces/controllers/user/userProgressController.ts
import { Request, Response } from 'express';
import { createUserProgressUseCase } from '../../../application/use-cases/user/UserProgressUseCase';
import { createUserProgressRepository } from '../../../application/repositories/UserProgressRepository';
import { User } from '../../../types/user';
import { IUserProgress } from '../../../infrastructure/database/models/UserProgress';

const userProgressRepository = createUserProgressRepository();
const userProgressUseCase = createUserProgressUseCase(userProgressRepository);

export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { courseId } = req.params;
        // const { courseId } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        const progress: IUserProgress | null = await userProgressUseCase.getUserProgress(userId, courseId);
        res.status(200).json({ message: 'User progress fetched successfully', data: progress });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user progress', error });
    }
};

export const markContentAsCompleted = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { contentId } = req.params;
        const { courseId } = req.body;


        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        await userProgressUseCase.markContentAsCompleted(userId, courseId, contentId);
        // const progress: IUserProgress | null = 
        res.status(200).json({ message: 'Content marked as completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking content as completed', error });
    }
};

export const unmarkContentAsCompleted = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { contentId } = req.params;
        const { courseId } = req.body;


        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        await userProgressUseCase.unmarkContentAsCompleted(userId, courseId, contentId);
        // const progress: IUserProgress | null =
        res.status(200).json({ message: 'Content unmarked as completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error unmarking content as completed', error });
    }
};

export const markContentAsImportant = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { contentId } = req.params;
        const { courseId } = req.body;


        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        // const progress: IUserProgress | null =
        await userProgressUseCase.markContentAsImportant(userId, courseId, contentId);
        res.status(200).json({ message: 'Content marked as important' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking content as important', error });
    }
};

export const unmarkContentAsImportant = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        const { contentId } = req.params;
        const { courseId } = req.body;


        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }

        // const progress: IUserProgress | null =
        await userProgressUseCase.unmarkContentAsImportant(userId, courseId, contentId);
        res.status(200).json({ message: 'Content unmarked as important' });
    } catch (error) {
        res.status(500).json({ message: 'Error unmarking content as important', error });
    }
};
