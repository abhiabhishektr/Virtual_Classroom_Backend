import { Request, Response } from 'express';
import { createCourseContentUseCase } from '../../../application/use-cases/course/CourseContentUseCase';
import { createCourseContentRepository } from '../../../application/repositories/CourseContentRepository';
import * as courseService from '../../../application/services/courseService';

// Instantiate the repository and use case
const repository = createCourseContentRepository();
const courseContentUseCase = createCourseContentUseCase(repository);

// Handler to get all modules for a course
export const getCourseModules = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.getCourseDetails(req.params.courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        const moduleData  = await courseContentUseCase.getCourseModules(req.params.courseId);
        const responseData = {
            modules: moduleData.map(module => ({
                ...module,
                title: course.title // Add the course title to each module
            }))
        };
        res.status(200).json({ data: responseData });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to add a new module to a course
export const addModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await courseService.getCourseDetails(req.body.courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        const moduleDetails = req.body;
        const module = await courseContentUseCase.addModule(req.body.courseId, moduleDetails);
        res.status(201).json({ module });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to get a module by ID
export const getModuleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const module = await courseContentUseCase.getModuleById(req.params.moduleId);
        if (module) {
            res.status(200).json(module);
        } else {
            res.status(404).json({ message: 'Module not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to update a module by ID
export const updateModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const moduleId = req.params.moduleId;
        const updatedDetails = req.body;

        // Check if the module exists
        const module = await courseContentUseCase.getModuleById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }

        // Check if the course associated with the module exists
        const course = await courseService.getCourseDetails(module.courseId.toString());
        if (!course) {
            res.status(404).json({ message: 'Associated course not found' });
            return;
        }

        const updatedModule = await courseContentUseCase.updateModule(moduleId, updatedDetails);
        res.status(200).json(updatedModule);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to delete a module by ID
export const deleteModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const moduleId = req.params.moduleId;
        const courseId = req.body.courseId; // Ensure you pass courseId to the handler

        // Check if the module exists
        const module = await courseContentUseCase.getModuleById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }

        // Check if the course associated with the module exists
        const course = await courseService.getCourseDetails(courseId);
        if (!course) {
            res.status(404).json({ message: 'Associated course not found' });
            return;
        }

        await courseContentUseCase.deleteModule(moduleId, courseId);
        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { moduleId, contentId } = req.params;
        const courseId = req.body.courseId; // Ensure you pass courseId to the handler

        // Check if the module exists
        const module = await courseContentUseCase.getModuleById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }

        // Check if the course associated with the module exists
        const course = await courseService.getCourseDetails(courseId);
        if (!course) {
            res.status(404).json({ message: 'Associated course not found' });
            return;
        }

        await courseContentUseCase.deleteContent(moduleId, contentId);
        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};