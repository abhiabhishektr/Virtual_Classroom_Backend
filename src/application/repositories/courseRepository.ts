// src/application/repositories/courseRepository.ts
import Course from "../../infrastructure/database/models/Course";
import {ICourse} from "../../infrastructure/database/models/Course";
import {CourseTeacherDTO} from "../../interfaces/dots/CourseDTO";

export const createCourse = async (courseData: ICourse): Promise<ICourse> => {
  const course = new Course(courseData);
  return course.save();
};

export const updateCourse = async (id: string, courseData: Partial<ICourse>): Promise<ICourse | null> => {
  return Course.findByIdAndUpdate(id, courseData, { new: true });
};

export const deleteCourse = async (id: string): Promise<ICourse | null> => {
  return Course.findByIdAndDelete(id);
};

export const getCourseById = async (id: string): Promise<ICourse | null> => {
  return Course.findById(id);
};

export const getAllCourses = async (): Promise<ICourse[]> => {
  return Course.find();
};

export const getCoursesByTeacher = async (instructorId: string): Promise<ICourse[]> => {
  return Course.find({ instructorId }).exec(); // Query to find courses by teacherId
};