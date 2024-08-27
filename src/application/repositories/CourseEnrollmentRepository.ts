// src/application/repositories/CourseEnrollmentRepository.ts
import EnrollmentModel, { IEnrollment } from '../../infrastructure/database/models/Enrollment';
import CourseModel, { ICourse } from '../../infrastructure/database/models/Course';
import mongoose from 'mongoose';
import { User } from '../../infrastructure/database/models/User';

export interface IUserCourseRepository {
    getUserPurchasedCourses(userId: string): Promise<ICourse[]>;
    groups(userId: string): Promise<string[]>;
    enrollCourse(userId: string, courseId: string, paymentId?: string, amount?: number): Promise<IEnrollment>;
    getEnrollment(userId: string, paymentId?: string, courseId?: string): Promise<IEnrollment | null>;
    getCourseById(courseId: string): Promise<ICourse | null>; // Added to fetch course details
    getCourseAmountById(courseId: string): Promise<number | null>;
    isCoursePurchased(userId: string, courseId: string): Promise<boolean>;
    getCourseDetailsWithContents(userId: string, courseId: string): Promise<{ course: ICourse | null, isPurchased: boolean, modules: any[]  }>; 

}


export const createUserCourseRepository = (): IUserCourseRepository => ({
    getUserPurchasedCourses: async (userId: string): Promise<ICourse[]> => {
        const userIdObj = mongoose.Types.ObjectId(userId); // Convert to ObjectId

        // Find all enrollments for the given user
        const enrollments = await EnrollmentModel.find({
            userId: userIdObj,
            'courses.status': 'paid' // Ensure the enrollment status is 'paid'
        });
        // Extract course IDs from enrollments
        const courseIds = enrollments
            .map(enrollment => enrollment.courses.map(courseDetail => courseDetail.courseId))
            .reduce((acc, courseIdArray) => acc.concat(courseIdArray), []); // Flatten array

        // Find all courses based on the extracted course IDs
        return await CourseModel.find({ _id: { $in: courseIds } }, { instructorId: 0 });
    },
    groups: async (userId: string): Promise<string[]> => {
        const userIdObj = mongoose.Types.ObjectId(userId); 
        const enrollments = await EnrollmentModel.aggregate([
            { $match: { userId: userIdObj } },
            
            { 
                $unwind: "$courses" 
            },
            { $match: { "courses.status": "paid" } },
            { 
                $lookup: {
                    from: "courses", 
                    localField: "courses.courseId",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            { $unwind: "$courseDetails" }, 
            { 
                $addFields: {
                    "courseDetails.instructorId": { $toObjectId: "$courseDetails.instructorId" }
                }
            },
            { 
                $lookup: {
                    from: "users",
                    localField: "courseDetails.instructorId",
                    foreignField: "_id",
                    as: "instructorDetails"
                }
            },
            { $unwind: "$instructorDetails" },
            {
                $project: {
                    _id: 0, 
                    groupId: "$courses.courseId",
                    groupName: "$courseDetails.title",
                    teacherEmail: "$instructorDetails.email"
                }
            }
        ]);
        
    
        return enrollments;
    },
    enrollCourse: async (userId: string, courseId: string, paymentId?: string, amount?: number): Promise<IEnrollment> => {
        const userIdObj = mongoose.Types.ObjectId(userId); // Convert to ObjectId
        const courseIdObj = mongoose.Types.ObjectId(courseId); // Convert to ObjectId

        // Create a new enrollment
        const newEnrollment = new EnrollmentModel({
            userId: userIdObj,
            courses: [{
                courseId: courseIdObj,
                price: amount,
                ...(paymentId ? { paymentId } : {})
            }]
        });
        return await newEnrollment.save();
    },
    getEnrollment: async (userId: string, paymentId?: string, courseId?: string): Promise<IEnrollment | null> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        console.log(`userIdObj: ${userIdObj} paymentId: ${paymentId}`);

        // First, let's just try to find the document
        const data = await EnrollmentModel.findOne({
            userId: userIdObj,
            'courses.paymentId': paymentId
        });
        console.log('Found data:', data);

        if (!data) {
            console.log('No matching document found');
            return null;
        }

        // If we found a document, now let's update it
        const enrollment = await EnrollmentModel.findOneAndUpdate(
            {
                userId: userIdObj,
                'courses.paymentId': paymentId
            },
            { $set: { 'courses.$.status': 'paid' } },
            { new: true }
        );
        if (courseId) {
            await CourseModel.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
        }
        console.log('Updated enrollment:', enrollment);

        return enrollment;
    },
    getCourseById: async (courseId: string): Promise<ICourse | null> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);

        try {
            const courseDetails = await CourseModel.aggregate([
                { $match: { _id: courseIdObj } },
                {
                    $addFields: {
                        instructorId: { $toObjectId: "$instructorId" }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructorId',
                        foreignField: '_id',
                        as: 'instructorDetails'
                    }
                },
                { $unwind: { path: '$instructorDetails', preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        instructorName: { $ifNull: ['$instructorDetails.name', 'N/A'] },
                        instructorEmail: { $ifNull: ['$instructorDetails.email', 'N/A'] }
                    }
                },
                {
                    $project: {
                        instructorDetails: 0
                    }
                }
            ]);

            // console.log('courseDetails', courseDetails);

            return courseDetails.length ? courseDetails[0] : null;
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw error;
        }
    },
    getCourseAmountById: async (courseId: string): Promise<number | null> => {
        const courseIdObj = mongoose.Types.ObjectId(courseId);
        console.log('courseIdObj:', courseIdObj);

        try {
            const course = await CourseModel.findById(courseIdObj).lean();
            // console.log('Raw course data:', course);

            if (!course) {
                console.log('No course found with this ID');
                return null;
            }

            if (!('fees' in course)) {
                console.log('Course found, but no fees field present');
                return null;
            }

            return course.fees;
        } catch (error) {
            console.error('Error fetching course amount:', error);
            throw error;
        }
    },
    isCoursePurchased: async (userId: string, courseId: string): Promise<boolean> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
    
        // Check if there is an enrollment for the user with the given course ID and status is 'paid'
        const enrollment = await EnrollmentModel.findOne({
            userId: userIdObj,
            'courses.courseId': courseIdObj,
            'courses.status': 'paid'
        });
    
        // Return true if enrollment exists with 'paid' status, otherwise false
        return !!enrollment;
    },
    getCourseDetailsWithContents: async (userId: string, courseId: string): Promise<{ course: ICourse | null, isPurchased: boolean, modules: any[], rating: number }> => {
        const userIdObj = mongoose.Types.ObjectId(userId);
        const courseIdObj = mongoose.Types.ObjectId(courseId);
    
        const result = await CourseModel.aggregate([
            { $match: { _id: courseIdObj } },
            {
                $lookup: {
                    from: 'enrollments',
                    let: { courseId: courseIdObj, userId: userIdObj },
                    pipeline: [
                        { $unwind: "$courses" },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                        { $eq: ["$courses.courseId", "$$courseId"] },
                                        { $eq: ["$courses.status", "paid"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'enrollments'
                }
            },
            {
                $lookup: {
                    from: 'modules',
                    let: { courseId: courseIdObj },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                        { $unwind: "$modules" },
                        {
                            $lookup: {
                                from: 'userprogresses',
                                let: { courseId: courseIdObj, userId: userIdObj },
                                pipeline: [
                                    { $match: { $expr: { $and: [
                                        { $eq: ["$courseId", "$$courseId"] },
                                        { $eq: ["$userId", "$$userId"] }
                                    ] } } },
                                    {
                                        $project: {
                                            _id: 0,
                                            completedContentIds: 1,
                                            importantContentIds: 1
                                        }
                                    }
                                ],
                                as: 'userProgress'
                            }
                        },
                        {
                            $addFields: {
                                userProgress: { $arrayElemAt: ["$userProgress", 0] }
                            }
                        },
                        {
                            $project: {
                                _id: "$modules._id",
                                title: "$modules.title",
                                contents: {
                                    $map: {
                                        input: {
                                            $cond: [
                                                { $gt: [{ $size: { $ifNull: ["$enrollments", []] } }, 0] },
                                                "$modules.contents",
                                                {
                                                    $map: {
                                                        input: "$modules.contents",
                                                        as: "content",
                                                        in: {
                                                            $mergeObjects: [
                                                                "$$content",
                                                                {
                                                                    url: { $cond: [{ $eq: ["$$content.type", "video"] }, "$$content.url", "$$REMOVE"] },
                                                                    isCompleted: { $in: ["$$content._id", { $ifNull: ["$userProgress.completedContentIds", []] }] },
                                                                    isImportant: { $in: ["$$content._id", { $ifNull: ["$userProgress.importantContentIds", []] }] }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        as: "content",
                                        in: "$$content"
                                    }
                                }
                            }
                        }
                    ],
                    as: 'modules'
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    let: { courseId: courseIdObj },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$courseId", "$$courseId"] } } },
                        { $group: { _id: "$courseId", averageRating: { $avg: "$rating" } } }
                    ],
                    as: 'rating'
                }
            },
            {
                $addFields: {
                    instructorId: { $toObjectId: "$instructorId" },
                    rating: { $ifNull: [{ $arrayElemAt: ["$rating.averageRating", 0] }, 0] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructorDetails'
                }
            },
            {
                $addFields: {
                    isPurchased: { $gt: [{ $size: { $ifNull: ["$enrollments", []] } }, 0] },
                    instructorEmail: { $arrayElemAt: ["$instructorDetails.email", 0] },
                    instructorName: { $arrayElemAt: ["$instructorDetails.name", 0] },
                    instructorProfilePicture: { $arrayElemAt: ["$instructorDetails.profilePicture", 0] }
                }
            },
            {
                $project: {
                    instructorId: 0,
                    enrollments: 0,
                    instructorDetails: 0
                }
            }
        ]);
    
        if (result.length > 0) {
            const course = result[0];
            return { course, isPurchased: course.isPurchased, modules: course.modules, rating: course.rating };
        } else {
            return { course: null, isPurchased: false, modules: [], rating: 0 };
        }
    }
    
    
    
    
});

// 11