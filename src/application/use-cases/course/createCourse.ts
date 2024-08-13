// src/application/use-cases/course/createCourse.ts

import { CourseDTO } from '../../../interfaces/dots/CourseDTO';
import { createNewCourse } from '../../services/courseService';
import { ICourse } from '../../../infrastructure/database/models/Course';

export const execute = async (courseData: CourseDTO): Promise<ICourse> => {
  return createNewCourse(courseData as ICourse)
};
/// courseData
// return createNewCourse(courseData)