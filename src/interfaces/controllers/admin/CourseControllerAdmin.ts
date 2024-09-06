import { Request, Response } from 'express';
import { createCourseUseCase } from '../../../application/use-cases/course/CourseUseCase';
import { createCourseRepository } from '../../../application/repositories/CourseRepositoryAdmin';

const repository = createCourseRepository();
const useCase = createCourseUseCase(repository);

export const blockCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    
    try {
        const blockedCourse = await useCase.blockCourse(courseId);
        if (!blockedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({data:blockedCourse});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const unblockCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const unblockedCourse = await useCase.unblockCourse(courseId);
        if (!unblockedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({data:unblockedCourse});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await useCase.getCourses();
        res.status(200).json({data:courses});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
