import { CourseDTO } from '../../../interfaces/dots/CourseDTO';
import { updateExistingCourse } from '../../services/courseService';
import { ICourse } from '../../../infrastructure/database/models/Course';

export const execute = async (id: string, courseData: Partial<CourseDTO>): Promise<ICourse | null> => {
  return updateExistingCourse(id, courseData);
};
