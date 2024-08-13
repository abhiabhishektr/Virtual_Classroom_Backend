"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteContent = exports.deleteModule = exports.updateModule = exports.getModuleById = exports.addModule = exports.getCourseModules = void 0;
const CourseContentUseCase_1 = require("../../../application/use-cases/course/CourseContentUseCase");
const CourseContentRepository_1 = require("../../../application/repositories/CourseContentRepository");
const courseService = __importStar(require("../../../application/services/courseService"));
// Instantiate the repository and use case
const repository = (0, CourseContentRepository_1.createCourseContentRepository)();
const courseContentUseCase = (0, CourseContentUseCase_1.createCourseContentUseCase)(repository);
// Handler to get all modules for a course
const getCourseModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const course = yield courseService.getCourseDetails(req.params.courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const moduleData = yield courseContentUseCase.getCourseModules(req.params.courseId);
        console.log(moduleData);
        const responseData = {
            title: course.title,
            courseId: course._id, // Assuming 'title' is the property containing the course title
            modules: (_a = moduleData[0]) === null || _a === void 0 ? void 0 : _a.modules,
            moduleId: (_b = moduleData[0]) === null || _b === void 0 ? void 0 : _b._id
        };
        // res.status(200).json({data:moduleData[0]?.modules});
        res.status(200).json({ data: responseData });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCourseModules = getCourseModules;
// Handler to add a new module to a course
const addModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseService.getCourseDetails(req.body.courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const moduleDetails = req.body;
        const module = yield courseContentUseCase.addModule(req.body.courseId, moduleDetails);
        res.status(201).json({ module });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addModule = addModule;
// Handler to get a module by ID
const getModuleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const module = yield courseContentUseCase.getModuleById(req.params.moduleId);
        if (module) {
            res.status(200).json(module);
        }
        else {
            res.status(404).json({ message: 'Module not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getModuleById = getModuleById;
// Handler to update a module by ID
const updateModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moduleId = req.params.moduleId;
        const updatedDetails = req.body;
        // Check if the module exists
        const module = yield courseContentUseCase.getModuleById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        // Check if the course associated with the module exists
        const course = yield courseService.getCourseDetails(module.courseId.toString());
        if (!course) {
            res.status(404).json({ message: 'Associated course not found' });
            return;
        }
        const updatedModule = yield courseContentUseCase.updateModule(moduleId, updatedDetails);
        res.status(200).json(updatedModule);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateModule = updateModule;
// Handler to delete a module by ID
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapterId = req.params.chapterId;
        const { courseId, moduleId } = req.body.courseId; // Ensure you pass courseId to the handler
        // Check if the module exists
        const module = yield courseContentUseCase.getModuleById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        // Check if the course associated with the module exists
        const course = yield courseService.getCourseDetails(courseId);
        if (!course) {
            res.status(404).json({ message: 'Associated course not found' });
            return;
        }
        yield courseContentUseCase.deleteModule(moduleId, courseId);
        res.status(200).json({ message: 'Module deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteModule = deleteModule;
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chapterId, moduleId, contentId, courseId } = req.body; // Ensure you pass courseId to the handler
        console.log(`moduelId: ${moduleId}  contentId: ${contentId} courseId: ${courseId} chapterId: ${chapterId}`);
        // Check if the module exists
        const module = yield courseContentUseCase.getModuleById(moduleId);
        if (!module) {
            console.log(33);
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        // Check if the course associated with the module exists
        const course = yield courseService.getCourseDetails(courseId);
        if (!course) {
            res.status(404).json({ message: 'Associated course not found' });
            return;
        }
        yield courseContentUseCase.deleteContent(moduleId, contentId);
        res.status(200).json({ message: 'Content deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteContent = deleteContent;
