// src/application/services/courseService.ts
import { createCourse, updateCourse, deleteCourse, getCourseById, getAllCourses, getCoursesByTeacher, countDocumentsDb } from '../repositories/courseRepository';
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



// courseService.ts
export const getAllCourseDetails = async (
  search: string = '',
  sort: string = 'title',
  filter: object = {},
  page: number = 1,
  limit: number = 10
): Promise<courseListingDTO[]> => {
  console.log("search: ", search, "sort: ", sort, "filter: ", filter, "page: ", page, "limit: ", limit);
  
  // Set default values if search, sort, or filter are empty
  const effectiveSearch = search.trim() || ''; // Default to empty string if search is empty or whitespace
  const effectiveSort = sort.trim() || 'title'; // Default to 'title' if sort is empty or whitespace
  const effectiveFilter = typeof filter === 'object' && Object.keys(filter).length > 0 ? filter : {}; // Default to empty object if filter is not provided or empty
  
  // Fetch course details from the repository
  const response = await getAllCourses(effectiveSearch, effectiveSort, effectiveFilter, page, limit);
  
  
  // Map and return the course details
  return response.map(mapToCourseListingDTO);
};


export const countDocuments = async (
  search: string = '',
  filter: object = {}
): Promise<number> => {
  try {
    // Call the repository function to get the count of documents
    const count = await countDocumentsDb(search, filter);
    return count;
  } catch (error: any) {
    throw new Error(`Error in service layer counting documents: ${error.message}`);
  }
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
