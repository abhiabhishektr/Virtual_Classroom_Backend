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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContents = exports.getCoursesbyTeacher = exports.getCourses = exports.getCourse = exports.deleteCourse = exports.updateCourse = exports.createCourse = void 0;
const courseService = __importStar(require("../../../application/services/courseService"));
const cloudinaryConfig_1 = __importDefault(require("../../../infrastructure/cloudinaryConfig"));
// import { courseValidator } from '../../../validations/courseValidator';
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const { error } = courseValidator.validate(req.body);
        // if (error) {
        //     return res.status(400).json({ message: error.details[0].message });
        // }
        if (!req.file) {
            console.log("no file");
            return res.status(400).send('No file uploaded.');
        }
        const fileStr = req.file.buffer.toString('base64');
        // Upload to Cloudinary
        const uploadResponse = yield cloudinaryConfig_1.default.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
            folder: 'courses',
            resource_type: 'auto',
        });
        const instructorId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        // The Cloudinary URL is available in the response
        const publicUrl = uploadResponse.secure_url;
        // Create course with the uploaded image URL
        const courseData = Object.assign(Object.assign({}, req.body), { imageUrl: publicUrl, instructorId: instructorId });
        const course = yield courseService.createNewCourse(courseData);
        res.status(201).json(course);
    }
    catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const { error } = courseValidator.validate(req.body);
        // if (error) {
        //     res.status(400).json({ message: error.details[0].message });
        //     return
        // }
        const existingCourse = yield courseService.getCourseDetails(req.params.id);
        if (!existingCourse) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (req.file) {
            const oldImageUrl = (_a = existingCourse.imageUrl) !== null && _a !== void 0 ? _a : null;
            if (oldImageUrl) {
                const publicId = (_b = oldImageUrl.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('.')[0];
                console.log('publicId', publicId);
                if (publicId) {
                    yield cloudinaryConfig_1.default.uploader.destroy(`courses/${publicId}`);
                }
            }
            const fileStr = req.file.buffer.toString('base64');
            // Upload the new image to Cloudinary
            const uploadResponse = yield cloudinaryConfig_1.default.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
                folder: 'courses',
                resource_type: 'auto',
            });
            req.body.imageUrl = uploadResponse.secure_url;
        }
        const course = yield courseService.updateExistingCourse(req.params.id, req.body);
        if (course) {
            res.status(200).json(course);
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseService.deleteCourseById(req.params.id);
        if (course) {
            res.status(200).json({ message: 'Course deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteCourse = deleteCourse;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseService.getCourseDetails(req.params.id);
        if (course) {
            res.status(200).json(course);
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCourse = getCourse;
// courently not in use , same alternative it the user course servise
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield courseService.getAllCourseDetails();
        // console.log("courses", courses);
        res.status(200).json({ data: courses });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCourses = getCourses;
const getCoursesbyTeacher = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const courses = yield courseService.getAllCourseDetailsbyTeacher((_b = (_a = _req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null);
        // console.log("courses",courses);
        res.status(200).json({ data: courses });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCoursesbyTeacher = getCoursesbyTeacher;
const updateContents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateContents = updateContents;
