"use strict";
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
exports.getCoursesByTeacher = exports.getAllCourses = exports.getCourseById = exports.deleteCourse = exports.updateCourse = exports.createCourse = void 0;
// src/application/repositories/courseRepository.ts
const Course_1 = __importDefault(require("../../infrastructure/database/models/Course"));
const createCourse = (courseData) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new Course_1.default(courseData);
    return course.save();
});
exports.createCourse = createCourse;
const updateCourse = (id, courseData) => __awaiter(void 0, void 0, void 0, function* () {
    return Course_1.default.findByIdAndUpdate(id, courseData, { new: true });
});
exports.updateCourse = updateCourse;
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Course_1.default.findByIdAndDelete(id);
});
exports.deleteCourse = deleteCourse;
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Course_1.default.findById(id);
});
exports.getCourseById = getCourseById;
const getAllCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    return Course_1.default.find();
});
exports.getAllCourses = getAllCourses;
const getCoursesByTeacher = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    return Course_1.default.find({ instructorId }).exec(); // Query to find courses by teacherId
});
exports.getCoursesByTeacher = getCoursesByTeacher;
