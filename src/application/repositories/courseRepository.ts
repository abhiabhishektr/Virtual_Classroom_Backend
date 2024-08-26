// src/application/repositories/courseRepository.ts
import Course from "../../infrastructure/database/models/Course";
import {ICourse} from "../../infrastructure/database/models/Course";

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
  const courses = await Course.aggregate([
    {
      $lookup: {
        from: 'modules',
        localField: '_id',
        foreignField: 'courseId',
        as: 'modules'
      }
    },
    {
      $match: {
        'modules.modules.contents.url': { $exists: true, $ne: '' } // Ensure there are contents in modules
      }
    },
    {
      $project: {
        title:1,
        description:1,
        instructorId:1,
        duration:1,
        startDate: 1,
        fees:1,
        category:1,
        imageUrl: 1,
        isBlocked:1,
        enrollmentCount:1,
      }
    }
  ]);

  return courses;
};


export const getCoursesByTeacher = async (instructorId: string): Promise<ICourse[]> => {
  return Course.find({ instructorId }).exec(); // Query to find courses by teacherId
};