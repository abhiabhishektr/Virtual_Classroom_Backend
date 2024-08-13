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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourseDetailsbyTeacher = exports.getAllCourseDetails = exports.getCourseDetails = exports.deleteCourseById = exports.updateExistingCourse = exports.createNewCourse = void 0;
// src/application/services/courseService.ts
const courseRepository_1 = require("../repositories/courseRepository");
const CourseDTO_1 = require("../../interfaces/dots/CourseDTO");
const createNewCourse = (courseData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("courseData", courseData);
    return (0, courseRepository_1.createCourse)(courseData);
});
exports.createNewCourse = createNewCourse;
const updateExistingCourse = (id, courseData) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, courseRepository_1.updateCourse)(id, courseData);
});
exports.updateExistingCourse = updateExistingCourse;
const deleteCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, courseRepository_1.deleteCourse)(id);
});
exports.deleteCourseById = deleteCourseById;
const getCourseDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, courseRepository_1.getCourseById)(id);
});
exports.getCourseDetails = getCourseDetails;
const getAllCourseDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, courseRepository_1.getAllCourses)(); // Assume this returns the full course data
    return response.map(CourseDTO_1.mapToCourseListingDTO);
});
exports.getAllCourseDetails = getAllCourseDetails;
const getAllCourseDetailsbyTeacher = (instructorId) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield (0, courseRepository_1.getCoursesByTeacher)(instructorId);
    return courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        fees: course.fees,
    }));
});
exports.getAllCourseDetailsbyTeacher = getAllCourseDetailsbyTeacher;
