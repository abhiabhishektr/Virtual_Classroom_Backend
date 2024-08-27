// src/application/use-cases/course/CourseContentUseCase.ts

import { ICourseContentRepository } from '../../../application/repositories/CourseContentRepository';
import { IModule,IContent } from '../../../infrastructure/database/models/CourseContent';
import { IReturnContent } from '../../../types/couurse';

export const createCourseContentUseCase = (repository: ICourseContentRepository) => ({
    getCourseModules: async (courseId: string): Promise<IModule[]> => {
        return repository.getCourseModules(courseId);
    },
    addModule: async (courseId: string, moduleDetails: any): Promise<IReturnContent[]> => {
        return repository.addModule(courseId, moduleDetails);
    },
    InitializeModule: async (courseId: string): Promise<IModule> => {
        return repository.InitializeModule(courseId);
    },
    updateModule: async (moduleId: string, updatedDetails: any): Promise<IModule | null> => {
        return repository.updateModule(moduleId, updatedDetails);
    },
    deleteModule: async (moduleId: string,chapterId: string,courseId: string,): Promise<void> => {
        return repository.deleteModule(moduleId,chapterId,courseId);
    },
    getModuleById: async (moduleId: string): Promise<IModule | null> => { //for future
        return repository.getModuleById(moduleId);
    },
    deleteContent: async (moduleId: string, contentId: string): Promise<void> => {
        return repository.deleteContent(moduleId, contentId);
    },
    addContent: async (courseId: string, moduleId: string, chapterId: string, contentDetails: IContent): Promise<IContent> => {
        return repository.addContent(courseId, moduleId, contentDetails);
    },
    updateContent: async (moduleId: string,courseId: string,chapterId: string ,contentId: string, newTitle: string): Promise<IContent | null> => {
        return repository.updateContent(moduleId,courseId,chapterId ,contentId, newTitle);
    },
    renameModule: async (courseId: string, moduleId: string, chapterId: string, newTitle: string): Promise<void> => {
        return repository.renameModule(courseId, moduleId, chapterId, newTitle);
    }
});
