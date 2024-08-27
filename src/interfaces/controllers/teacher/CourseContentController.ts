import { Request, Response } from 'express';
import { createCourseContentUseCase } from '../../../application/use-cases/course/CourseContentUseCase';
import { createCourseContentRepository } from '../../../application/repositories/CourseContentRepository';
import * as courseService from '../../../application/services/courseService';
import cloudinary from '../../../infrastructure/cloudinaryConfig';
import { IContent } from '../../../infrastructure/database/models/CourseContent';

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

        let moduleData = await courseContentUseCase.getCourseModules(req.params.courseId);
        console.log(`moduleData: ${moduleData}`);
        if (!moduleData || moduleData.length === 0) {
            const newModule = await courseContentUseCase.InitializeModule(req.params.courseId);
            moduleData = [newModule]; // Wrap the result in an array
        }

        const responseData = {
            title: course.title,
            courseId: course._id, // Assuming 'title' is the property containing the course title
            modules: moduleData[0]?.modules,
            moduleId: moduleData[0]?._id
        };
        // res.status(200).json({data:moduleData[0]?.modules});
        res.status(200).json({ data: responseData });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Handler to add a new module to a course
export const addModule = async (req: Request, res: Response): Promise<void> => {
    try {
        // console.log(`req.body: ${JSON.stringify(req.body)}`);

        const course = await courseService.getCourseDetails(req.body.courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        const moduleDetails = {
            title: req.body.title, // Ensure title is passed in the request body
            contents: [] // Initialize with an empty array
        };
        const module = await courseContentUseCase.addModule(req.body.courseId, moduleDetails);
        res.status(201).json({ data: module });
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

export const renameModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, moduleId, chapterId } = req.params;
        console.log("chapterId: ", chapterId);
        console.log("moduleId: ", moduleId);
        console.log("courseId: ", courseId);
        console.log("req.body: ", req.body);
        const { title } = req.body;
        await courseContentUseCase.renameModule(courseId, moduleId, chapterId, title);
        res.status(200).json("updatedModule");
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


// Handler to delete a module by ID
export const deleteModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const chapterId = req.params.chapterId;
        const { moduleId, courseId } = req.body; // Ensure you pass courseId to the handler

        // Check if the module exists
        // const module = await courseContentUseCase.getModuleById(moduleId);
        // if (!module) {
        //     res.status(404).json({ message: 'Module not found' });
        //     return;
        // }

        // Check if the course associated with the module exists
        // const course = await courseService.getCourseDetails(courseId);
        // if (!course) {
        //     res.status(404).json({ message: 'Associated course not found' });
        //     return;
        // }

        await courseContentUseCase.deleteModule(moduleId, chapterId, courseId);
        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, moduleId, contentId, courseId } = req.body // Ensure you pass courseId to the handler

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



export const updateContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chapterId, moduleId, contentId, courseId, newTitle } = req.body.data;

        // Validate required fields
        if (!chapterId || !moduleId || !contentId || !courseId || !newTitle) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Call the use case
        const updatedContent = await courseContentUseCase.updateContent(moduleId, courseId, chapterId, contentId, newTitle);

        if (!updatedContent) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }

        // Return the updated content
        res.status(200).json(updatedContent);
    } catch (error: any) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: error.message });
    }
};


export const uploadContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, moduleId } = req.params;


        const file = req.file;

        if (!file) {
            console.error('No file uploaded');
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const fileStr = file.buffer.toString('base64');

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${fileStr}`, {
            folder: `courses/${courseId}/modules/${moduleId}/chapters`,
            resource_type: 'auto',
        });

        const publicUrl = uploadResponse.secure_url;

        // Prepare content details
        const contentDetails: IContent = {
            type: file.mimetype.startsWith('video/') ? 'video' : 'document',
            title: file.originalname,
            url: publicUrl,
            duration: undefined // Optional, depends on your content type
        };

        // Save content details in the database
        const savedContent = await repository.addContent(courseId, moduleId, contentDetails);
        console.log("savedContent: ", savedContent);

        res.status(200).json({ data: savedContent });
    } catch (error: any) {
        console.error('Error during upload:', error.message);
        res.status(500).json({ error: error.message });
    }
};
