// src/interfaces/controllers/user/chatController.ts

import { Request, Response } from 'express';
import { createUserCourseRepository } from "../../../application/repositories/CourseEnrollmentRepository";
import { createUserCourseUseCase } from "../../../application/use-cases/user/CourseEnrollmentUseCase";
import { User } from "../../../types/user";
import { createGroupChatRepository } from '../../../application/repositories/GroupChatRepository';
import { createGroupChatUseCase } from '../../../application/use-cases/groupChat/GroupChatUseCase';

const userRepository = createUserCourseRepository();
const useCase = createUserCourseUseCase(userRepository);
const groupChatRepository = createGroupChatRepository();
const groupChatUseCase = createGroupChatUseCase(groupChatRepository);

export const getGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as User)?.id ?? null;
        if (!userId) {
            res.status(400).json({ message: 'User not authenticated' });
            return;
        }
        const courses = await useCase.groups(userId);

        res.status(200).json({ data: courses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching joined Group', error });


    }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const groupId = req.params.groupId;
        if (!groupId) {
            res.status(400).json({ message: 'Group ID is required' });
            return;
        }
        const messages = await groupChatUseCase.getMessages(groupId);

        res.status(200).json({ data: messages })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error })
    }
};