// src/application/services/courseService.ts
import { createCourse, updateCourse, deleteCourse, getCourseById, getAllCourses, getCoursesByTeacher } from '../repositories/courseRepository';
import { ICourse } from '../../infrastructure/database/models/Course';
import { CourseDTO, courseListingDTO, CourseTeacherDTO, mapToCourseListingDTO } from '../../interfaces/dots/CourseDTO';

export const createNewCourse = async (courseData: ICourse): Promise<ICourse> => {
  // console.log("courseData",courseData);
  return createCourse(courseData);
};

export const updateExistingCourse = async (id: string, courseData: Partial<CourseDTO>): Promise<ICourse | null> => {
  return updateCourse(id, courseData);
};

export const deleteCourseById = async (id: string): Promise<ICourse | null> => {
  return deleteCourse(id);
};

export const getCourseDetails = async (id: string): Promise<ICourse | null> => {
  return getCourseById(id);
};



export const getAllCourseDetails = async (): Promise<courseListingDTO[]> => {
  const response = await getAllCourses(); // Assume this returns the full course data
  return response.map(mapToCourseListingDTO);
};


export const getAllCourseDetailsbyTeacher = async (instructorId: string): Promise<CourseTeacherDTO[]> => {
  const courses = await getCoursesByTeacher(instructorId);
  return courses.map((course) => ({
    id: course._id.toString(),
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    fees: course.fees,
  }));
}