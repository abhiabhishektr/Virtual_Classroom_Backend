// src/repositories/adminRepository.ts
import Course from '../../infrastructure/database/models/Course';
import { User } from '../../infrastructure/database/models/User';
import TeacherRequest from '../../infrastructure/database/models/TeacherRequest';
import Enrollment from '../../infrastructure/database/models/Enrollment';
import moment from 'moment';


export interface MonthlyCourseSale {
    totalSales: number;
    month: string;
}

export interface MonthlyTeacherRequest {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    month: string;
}

export interface LatestTeacher {
    status: string;
    bio: string;
    createdAt: Date;
    user: {
        email: string;
        name: string;
    };
}

export interface DashboardData {
    totalCourses: number;
    totalStudents: number;
    totalTeachers: number;
    pendingApplications: number;
    monthlyCourseSales: MonthlyCourseSale[];
    newTeacherRegistrations: MonthlyTeacherRequest[];
    recentApplications: LatestTeacher[];
}

export interface IAdminRepository {
    getDashboardData(): Promise<DashboardData>;
}

export const createAdminRepository = (): IAdminRepository => ({
    getDashboardData: async (): Promise<DashboardData> => {
        const totalCourses = await Course.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'user' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const pendingApplications = await TeacherRequest.countDocuments({ status: 'pending' });



        const monthlyCourseSales = await Enrollment.aggregate([
            {
                $match: {
                    'courses.status': 'paid',
                    'courses.purchaseDate': {
                        $gte: moment().subtract(7, 'months').startOf('month').toDate()
                    }
                },
            },
            {
                $unwind: '$courses',
            },
            {
                $group: {
                    _id: { $month: '$courses.purchaseDate' },
                    totalSales: { $sum: '$courses.price' },
                    year: { $first: { $year: '$courses.purchaseDate' } } // Store the year
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $dateToString: { format: '%B', date: { $dateFromParts: { year: '$year', month: '$_id' } } }
                    },
                    totalSales: 1,
                },
            },
        ]);

        console.log("monthlyCourseSales: ", monthlyCourseSales);


        const monthlyTeacherRequestData = await TeacherRequest.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    totalRequests: { $sum: 1 },
                    pendingRequests: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    approvedRequests: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
                    rejectedRequests: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
                    year: { $first: { $year: "$createdAt" } } // Store the year
                },
            },
            {
                $sort: { _id: 1 }, // Sort by month ascending
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $dateToString: {
                            format: '%B',
                            date: { $dateFromParts: { year: '$year', month: '$_id' } }
                        }
                    },
                    totalRequests: 1,
                    pendingRequests: 1,
                    approvedRequests: 1,
                    rejectedRequests: 1,
                },
            },
        ]);
        console.log("monthlyTeacherRequestData: ", monthlyTeacherRequestData);



        const latestTeacher = await TeacherRequest.aggregate([
            {
                $addFields: {
                    userId: { $toObjectId: "$userId" }
                }
            },
            {
                $lookup: {
                    from: 'users', // Collection name
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 1 // Limit to the latest application
            },
            {
                $project: {
                    _id: 0,
                    bio: 1,
                    createdAt: 1,
                    status: 1,
                    'user.name': 1,
                    'user.email': 1
                }
            }
        ]);
        
        console.log("latestTeacher: ", latestTeacher);



        return {
            totalCourses,
            totalStudents,
            totalTeachers,
            pendingApplications,
            monthlyCourseSales: monthlyCourseSales,
            newTeacherRegistrations: monthlyTeacherRequestData,
            recentApplications: latestTeacher
        };
    },
});
