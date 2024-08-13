"use strict";
// src/application/use-cases/course/CourseContentUseCase.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseContentUseCase = void 0;
const createCourseContentUseCase = (repository) => ({
    getCourseModules: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.getCourseModules(courseId);
    }),
    addModule: (courseId, moduleDetails) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.addModule(courseId, moduleDetails);
    }),
    updateModule: (moduleId, updatedDetails) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.updateModule(moduleId, updatedDetails);
    }),
    deleteModule: (moduleId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.deleteModule(moduleId, courseId);
    }),
    getModuleById: (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.getModuleById(moduleId);
    }),
    deleteContent: (moduleId, contentId) => __awaiter(void 0, void 0, void 0, function* () {
        return repository.deleteContent(moduleId, contentId);
    })
});
exports.createCourseContentUseCase = createCourseContentUseCase;
