// src/application/repositories/courseRepository.ts
import Course from "../../infrastructure/database/models/Course";
import { ICourse } from "../../infrastructure/database/models/Course";

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


// courseRepository.ts
export const getAllCourses = async (
  search: string = '',
  sort: string = 'title',
  filter: object = {},
  page: number = 1,
  limit: number = 10
): Promise<ICourse[]> => {

  const skip = (page - 1) * limit;

  let sortField = 'title';
  let sortOrder = 1;

  if (sort === 'high-low') {
    sortField = 'fees';
    sortOrder = -1;
  } else if (sort === 'low-high') {
    sortField = 'fees';
    sortOrder = 1;
  } else {
    sortField = sort;
  }

  const matchStage = {
    'modules.modules.contents.url': { $exists: true, $ne: '' },
    title: { $regex: search, $options: 'i' },
    isBlocked: false,
    ...filter
  };


  const courses = await Course.aggregate([
    {
      $lookup: {
        from: 'enrollments',
        let: { courseId: '$_id' },
        pipeline: [
          { $unwind: '$courses' },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$courses.courseId', '$$courseId'] },
                  { $eq: ['$courses.status', 'paid'] }
                ]
              }
            }
          },
          { $group: { _id: null, isPurchased: { $first: { $literal: true } } } }
        ],
        as: 'enrollmentInfo'
      }
    },
    {
      $unwind: {
        path: '$enrollmentInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'modules',
        localField: '_id',
        foreignField: 'courseId',
        as: 'modules'
      }
    },
    {
      $lookup: {
        from: 'wishlists',
        let: { courseId: '$_id' },
        pipeline: [
          { $unwind: '$courses' },
          {
            $match: {
              $expr: { $eq: ['$courses', '$$courseId'] }
            }
          },
          { $group: { _id: null, isBookmarked: { $first: { $literal: true } } } }
        ],
        as: 'wishlistInfo'
      }
    },
    {
      $unwind: {
        path: '$wishlistInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    { $match: matchStage },
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        title: 1,
        description: 1,
        instructorId: 1,
        duration: 1,
        startDate: 1,
        fees: 1,
        category: 1,
        imageUrl: 1,
        isBlocked: 1,
        enrollmentCount: 1,
        isPurchased: { $ifNull: ['$enrollmentInfo.isPurchased', false] },
        isBookmarked: { $ifNull: ['$wishlistInfo.isBookmarked', false] }
      }
    }
  ]);
  

  return courses;
};



// src/application/repositories/courseRepository.ts

export const countDocumentsDb = async (
  search: string = '',
  filter: object = {}
): Promise<number> => {
  try {
    // Ensure search is a string
    if (typeof search !== 'string') {
      throw new Error('Search parameter must be a string.');
    }

    // Construct the query object
    const query: any = {
      ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
      isBlocked: false,
      ...filter // Apply additional filters
    };


    // If query is empty, return total document count without filtering
    if (Object.keys(query).length === 0) {
      const totalCount = await Course.estimatedDocumentCount();
      return totalCount;
    }

    // Count documents matching the query
    const count = await Course.countDocuments(query);


    return count;
  } catch (error: any) {
    throw new Error(`Error in repository layer counting documents: ${error.message}`);
  }
};






export const getCoursesByTeacher = async (instructorId: string): Promise<ICourse[]> => {
  return Course.find({ instructorId }).exec(); // Query to find courses by teacherId
};