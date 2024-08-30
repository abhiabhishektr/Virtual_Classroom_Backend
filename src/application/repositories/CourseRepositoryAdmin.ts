import CourseModel, { ICourse } from '../../infrastructure/database/models/Course';

export interface ICourseRepository {
    blockCourse(courseId: string): Promise<ICourse | null>;
    unblockCourse(courseId: string): Promise<ICourse | null>;
    getCourses(): Promise<ICourse[]>;
}

export const createCourseRepository = (): ICourseRepository => ({
    blockCourse: async (courseId: string): Promise<ICourse | null> => {
        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { isBlocked: true } },
            { new: true }
        );
        return course;
    },
    unblockCourse: async (courseId: string): Promise<ICourse | null> => {
        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { isBlocked: false } },
            { new: true }
        );
        return course;
    },
    getCourses: async (): Promise<ICourse[]> => {
        return await CourseModel.find();
    },

});
