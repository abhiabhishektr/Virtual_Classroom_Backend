// src/application/repositories/CourseContentRepository.ts

import ModuleModel, { IModule } from '../../infrastructure/database/models/CourseContent';
import mongoose from 'mongoose';

export interface ICourseContentRepository {
    getCourseModules(courseId: string): Promise<IModule[]>;
    addModule(courseId: string, moduleDetails: any): Promise<IModule>;
    updateModule(moduleId: string, updatedDetails: any): Promise<IModule | null>;
    deleteModule(moduleId: string,courseId: string): Promise<void>;
    getModuleById(moduleId: string): Promise<IModule | null>;
    deleteContent(moduleId: string, contentId: string): Promise<void>; 
    
}

export const createCourseContentRepository = (): ICourseContentRepository => ({
    getCourseModules: async (courseId: string): Promise<IModule[]> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        return await ModuleModel.find({ courseId: courseIdObj });
    },
    addModule: async (courseId: string, moduleDetails: any): Promise<IModule> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);

        const newModule = new ModuleModel({
            ...moduleDetails,
            courseId: courseIdObj
        });

        return await newModule.save();
    },
    updateModule: async (moduleId: string, updatedDetails: any): Promise<IModule | null> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);

        return await ModuleModel.findByIdAndUpdate(
            moduleIdObj,
            { $set: updatedDetails },
            { new: true }
        );
    },
    deleteModule: async (moduleId: string, courseId: string): Promise<void> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
    
        const module = await ModuleModel.findOne({ _id: moduleIdObj, courseId: courseIdObj });
        
        if (!module) {
            throw new Error("Module not found or does not belong to the given course");
        }
    
        await ModuleModel.findByIdAndDelete(moduleIdObj);
    }
    ,
    getModuleById: async (moduleId: string): Promise<IModule | null> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);

        return await ModuleModel.findById(moduleIdObj);
    }
    ,
    deleteContent: async (moduleId: string, contentId: string): Promise<void> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);
        const contentIdObj = mongoose.Types.ObjectId(contentId);
    
        const result = await ModuleModel.updateOne(
            { _id: moduleIdObj, 'modules.contents._id': contentIdObj },
            { $pull: { 'modules.$.contents': { _id: contentIdObj } } }
        );
    
        if (result.nModified === 0) {
            throw new Error("Content not found in the module");
        }
    }
    
});
