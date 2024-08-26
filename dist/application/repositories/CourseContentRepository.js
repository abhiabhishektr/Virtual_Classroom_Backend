"use strict";
// src/application/repositories/CourseContentRepository.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseContentRepository = void 0;
const CourseContent_1 = __importDefault(require("../../infrastructure/database/models/CourseContent"));
const mongoose_1 = __importDefault(require("mongoose"));
const createCourseContentRepository = () => ({
    getCourseModules: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId);
        return yield CourseContent_1.default.find({ courseId: courseIdObj });
    }),
    addModule: (courseId, moduleDetails) => __awaiter(void 0, void 0, void 0, function* () {
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId);
        const newModule = new CourseContent_1.default(Object.assign(Object.assign({}, moduleDetails), { courseId: courseIdObj }));
        return yield newModule.save();
    }),
    updateModule: (moduleId, updatedDetails) => __awaiter(void 0, void 0, void 0, function* () {
        const moduleIdObj = mongoose_1.default.Types.ObjectId(moduleId);
        return yield CourseContent_1.default.findByIdAndUpdate(moduleIdObj, { $set: updatedDetails }, { new: true });
    }),
    deleteModule: (moduleId, chapterId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const moduleIdObj = mongoose_1.default.Types.ObjectId(moduleId);
        const courseIdObj = mongoose_1.default.Types.ObjectId(courseId);
        const chapterIdObj = mongoose_1.default.Types.ObjectId(chapterId);
        const module = yield CourseContent_1.default.findOne({ _id: moduleIdObj, courseId: courseIdObj });
        if (!module) {
            throw new Error("Module not found or does not belong to the given course");
        }
        const result = yield CourseContent_1.default.updateOne({ _id: moduleIdObj, 'modules._id': chapterIdObj, courseId: courseIdObj }, { $pull: { modules: { _id: chapterIdObj } } });
        if (result.nModified === 0) {
            throw new Error("Content not found in the module");
        }
    }),
    getModuleById: (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
        const moduleIdObj = mongoose_1.default.Types.ObjectId(moduleId);
        return yield CourseContent_1.default.findById(moduleIdObj);
    }),
    deleteContent: (moduleId, contentId) => __awaiter(void 0, void 0, void 0, function* () {
        const moduleIdObj = mongoose_1.default.Types.ObjectId(moduleId);
        const contentIdObj = mongoose_1.default.Types.ObjectId(contentId);
        const result = yield CourseContent_1.default.updateOne({ _id: moduleIdObj, 'modules.contents._id': contentIdObj }, { $pull: { 'modules.$.contents': { _id: contentIdObj } } });
        if (result.nModified === 0) {
            throw new Error("Content not found in the module");
        }
    })
});
exports.createCourseContentRepository = createCourseContentRepository;
