// src/application/repositories/CourseEnrollmentRepository.ts
import EnrollmentModel, { IEnrollment } from '../../infrastructure/database/models/Enrollment';
import CourseModel, { ICourse } from '../../infrastructure/database/models/Course';
import mongoose from 'mongoose';
import { User } from '../../infrastructure/database/models/User';

export interface IUserCourseRepository {
    getUserPurchasedCourses(userId: string): Promise<ICourse[]>;
    enrollCourse(userId: string, courseId: string, paymentId?: string, amount?: number): Promise<IEnrollment>;
    getEnrollment(userId: string, paymentId?: string): Promise<IEnrollment | null>;
    getCourseById(courseId: string): Promise<ICourse | null>; // Added to fetch course details
    getCourseAmountById(courseId: string): Promise<number | null>;
    isCoursePurchased(userId: string, courseId: string): Promise<boolean>;
}

export const createUserCourseRepository = (): IUserCourseRepository => ({
    getUserPurchasedCourses: async (userId: string): Promise<ICourse[]> => {
        const userIdObj = mongoose.Types.ObjectId(userId); // Convert to ObjectId

        // Find all enrollments for the given user
        const enrollments = await EnrollmentModel.find({ userId: userIdObj });

        // Extract course IDs from enrollments
        const courseIds = enrollments
            .map(enrollment => enrollment.courses.map(courseDetail => courseDetail.courseId))
            .reduce((acc, courseIdArray) => acc.concat(courseIdArray), []); // Flatten array

        // Find all courses based on the extracted course IDs
        return await CourseModel.find({ _id: { $in: courseIds } }, { instructorId: 0 });
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
    getEnrollment: async (userId: string, paymentId?: string): Promise<IEnrollment | null> => {
        const userIdObj =  mongoose.Types.ObjectId(userId);
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

        // Check if there is an enrollment for the user with the given course ID
        const enrollment = await EnrollmentModel.findOne({
            userId: userIdObj,
            'courses.courseId': courseIdObj
        });

        // Return true if enrollment exists, otherwise false
        return !!enrollment;
    }
});
