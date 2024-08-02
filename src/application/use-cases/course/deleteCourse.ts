import { deleteCourseById } from '../../services/courseService';
import { ICourse } from '../../../infrastructure/database/models/Course';
export const execute = async (id: string): Promise<ICourse | null> => {
  return deleteCourseById(id);
};
