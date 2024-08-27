// src/application/repositories/CourseContentRepository.ts

import ModuleModel, { IModule, IContent } from '../../infrastructure/database/models/CourseContent';
import mongoose from 'mongoose';
import { IReturnContent } from '../../types/couurse';

export interface ICourseContentRepository {
    getCourseModules(courseId: string): Promise<IModule[]>;
    addModule(courseId: string, moduleDetails: any): Promise<IReturnContent[]>;
    InitializeModule(courseId: string): Promise<any>;
    updateModule(moduleId: string, updatedDetails: any): Promise<IModule | null>;
    deleteModule(moduleId: string, chapterId: string, courseId: string): Promise<void>;
    getModuleById(moduleId: string): Promise<IModule | null>;
    deleteContent(moduleId: string, contentId: string): Promise<void>;
    addContent(courseId: string, moduleId: string, contentDetails: IContent): Promise<IContent>;
    updateContent(moduleId: string, courseId: string, chapterId: string, contentId: string, newTitle: string): Promise<any>;
    renameModule(courseId: string, moduleId: string, chapterId: string, newTitle: string): Promise<void>;

}

export const createCourseContentRepository = (): ICourseContentRepository => ({
    getCourseModules: async (courseId: string): Promise<IModule[]> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        return await ModuleModel.find({ courseId: courseIdObj });
    },
    addModule: async (courseId: string, moduleDetails: { title: string }): Promise<IReturnContent[]> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const existingModule = await ModuleModel.findOne({ courseId: courseIdObj });

        if (!existingModule) {
            throw new Error("Course not found");
        }
        existingModule.modules.push({
            title: moduleDetails.title,
            contents: []
        });

        const updatedModule = await existingModule.save();
        console.log("updatedModule: ", updatedModule);
        // const newModule = updatedModule.modules[updatedModule.modules.length - 1];
        // console.log("newModule: ", newModule);

        // Return only the contents of the new module
        // return updatedModule.modules;
        return updatedModule.modules;

    },
    InitializeModule: async (courseId: string): Promise<IModule> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        let existingModule = await ModuleModel.findOne({ courseId: courseIdObj });

        if (!existingModule) {
            existingModule = new ModuleModel({
                courseId: courseIdObj,
                modules: [] // Initialize with an empty array
            });
            await existingModule.save();
        }

        return existingModule;
    },
    updateModule: async (moduleId: string, updatedDetails: any): Promise<IModule | null> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);

        return await ModuleModel.findByIdAndUpdate(
            moduleIdObj,
            { $set: updatedDetails },
            { new: true }
        );
    },
    deleteModule: async (moduleId: string, chapterId: string, courseId: string): Promise<void> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const chapterIdObj = mongoose.Types.ObjectId(chapterId);

        const module = await ModuleModel.findOne({ _id: moduleIdObj, courseId: courseIdObj });

        if (!module) {
            throw new Error("Module not found or does not belong to the given course");
        }

        const result = await ModuleModel.updateOne(
            { _id: moduleIdObj, 'modules._id': chapterIdObj, courseId: courseIdObj },
            { $pull: { modules: { _id: chapterIdObj } } }
        );

        if (result.nModified === 0) {
            throw new Error("Content not found in the module");
        }
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
    },
    addContent: async (courseId: string, moduleId: string, contentDetails: IContent): Promise<any> => {
        console.log("courseId: ", courseId);
        console.log("moduleId: ", moduleId);
        console.log("contentDetails: ", contentDetails);

        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);

        // Find the course by courseId and moduleId
        const course = await ModuleModel.findOne({
            courseId: courseIdObj,                // Use _id to match the course
            "modules._id": moduleIdObj       // Match the specific module within the course
        });

        console.log("course: ", course);

        if (!course) {
            throw new Error("Course or Module not found");
        }

        const newContent = {
            type: contentDetails.type,
            title: contentDetails.title,
            url: contentDetails.url,
            duration: contentDetails.duration || 0,
        };

        // Push the new content into the contents array of the specified module
        const updatedCourse = await ModuleModel.findOneAndUpdate(
            {
                courseId: courseIdObj,
                "modules._id": moduleIdObj,
            },
            { $push: { "modules.$.contents": newContent } },  // Use the positional operator `$` to target the matched module
            { new: true }  // Return the updated course document
        );

        if (!updatedCourse) {
            throw new Error("Failed to add new content to the module");
        }

        // Return the added content
        return updatedCourse;
    },
    updateContent: async (
        moduleId: string,
        courseId: string,
        chapterId: string,
        contentId: string,
        newTitle: string
    ): Promise<any> => {
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);
        const contentIdObj = mongoose.Types.ObjectId(contentId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        const chapterIdObj = mongoose.Types.ObjectId(chapterId);

        // Find and update the specific content in the module
        const updatedModule = await ModuleModel.findOneAndUpdate(
            {
                _id: moduleIdObj,
                courseId: courseIdObj,
                'modules._id': chapterIdObj,
                'modules.contents._id': contentIdObj
            },
            { $set: { 'modules.$[module].contents.$[content].title': newTitle } },
            {
                arrayFilters: [
                    { 'module._id': chapterIdObj },
                    { 'content._id': contentIdObj }
                ],
                new: true // Return the updated document
            }
        );

        if (!updatedModule) {
            throw new Error('Failed to update content in the module');
        }

        return updatedModule;
    },
    renameModule: async (
        courseId: string,
        moduleId: string,
        chapterId: string,
        newTitle: string
    ): Promise<any> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        console.log("courseId: ", courseId);
        const moduleIdObj = mongoose.Types.ObjectId(moduleId);
        console.log("moduleId: ", moduleId);
        const chapterIdObj = mongoose.Types.ObjectId(chapterId);
        console.log("chapterId: ", chapterId);

        // Find and update the specific module's title
        const updatedModule = await ModuleModel.findOneAndUpdate(
            {
                _id: courseIdObj,
                courseId:  chapterIdObj,
                'modules._id': moduleIdObj
            },
            { $set: { 'modules.$.title': newTitle } },
            {
                new: true // Return the updated document
            }
        );

        if (!updatedModule) {
            throw new Error('Failed to update module in the course');
        }

        return updatedModule;
    }
});
