// src/application/use-cases/course/CourseContentUseCase.ts

import { ICourseContentRepository } from '../../../application/repositories/CourseContentRepository';
import { IModule } from '../../../infrastructure/database/models/CourseContent';

export const createCourseContentUseCase = (repository: ICourseContentRepository) => ({
    getCourseModules: async (courseId: string): Promise<IModule[]> => {
        return repository.getCourseModules(courseId);
    },
    addModule: async (courseId: string, moduleDetails: any): Promise<IModule> => {
        return repository.addModule(courseId, moduleDetails);
    },
    updateModule: async (moduleId: string, updatedDetails: any): Promise<IModule | null> => {
        return repository.updateModule(moduleId, updatedDetails);
    },
    deleteModule: async (moduleId: string,courseId: string): Promise<void> => {
        return repository.deleteModule(moduleId,courseId);
    },
    getModuleById: async (moduleId: string): Promise<IModule | null> => {
        return repository.getModuleById(moduleId);
    },
    deleteContent: async (moduleId: string, contentId: string): Promise<void> => {
        return repository.deleteContent(moduleId, contentId);
    }
});
