
import { ICourseRepository } from '../../repositories/CourseRepositoryAdmin';
import { ICourse } from '../../../infrastructure/database/models/Course';

export const createCourseUseCase = (repository: ICourseRepository) => ({
    blockCourse: async (courseId: string): Promise<ICourse | null> => {
        return repository.blockCourse(courseId);
    },
    unblockCourse: async (courseId: string): Promise<ICourse | null> => {
        return repository.unblockCourse(courseId);
    },
    getCourses: async (): Promise<ICourse[]> => {
        return repository.getCourses();
    },

});
