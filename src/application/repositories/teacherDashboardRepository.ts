// src/application/repositories/teacherDashboardRepository.ts
import moment from 'moment';
import Course, { ICourse } from '../../infrastructure/database/models/Course';
import Enrollment from '../../infrastructure/database/models/Enrollment';

// ... (Other interfaces and types)

export interface CourseSalesData {
    id: number;
    title: string;
    price: string;
    sales: number;
}

export interface ITeacherRepository {
    getCourseSalesData(teacherId: string): Promise<CourseSalesData[]>; // New function
    getSalesData(teacherId: string): Promise<MonthlySales[]>;
}

export interface MonthlySales {
    month: string;
    totalSales: number;
}

export const createTeacherRepository = (): ITeacherRepository => ({
    getCourseSalesData: async (teacherId: string): Promise<CourseSalesData[]> => {
        const courseSalesData = await Course.aggregate([
            {
                $match: {
                    instructorId: teacherId // Match courses based on the teacher's ID
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    price: '$fees',
                    sales: '$enrollmentCount'
                }
            }
        ]);
        // console.log("courseSalesData: ", courseSalesData);

        return courseSalesData;
    },
    getSalesData: async (teacherId: string): Promise<MonthlySales[]> => {
        const sixMonthsAgo = moment().subtract(6, 'months').startOf('month').toDate();

        const monthlySales = await Course.aggregate([
            {
                $match: {
                    instructorId: teacherId 
                }
            },
            {
                $lookup: {
                    from: 'enrollments', // Assuming your Enrollment collection is named 'enrollments'
                    localField: '_id', 
                    foreignField: 'courses.courseId',
                    as: 'enrollmentData'
                }
            },
            {
                $unwind: '$enrollmentData'
            },
            {
                $unwind: '$enrollmentData.courses'
            },
            {
                $match: {
                    'enrollmentData.courses.status': 'paid',
                    'enrollmentData.courses.purchaseDate': { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$enrollmentData.courses.purchaseDate' },
                        year: { $year: '$enrollmentData.courses.purchaseDate' }
                    },
                    totalSales: { $sum: '$enrollmentData.courses.price' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $dateToString: {
                            format: '%B %Y',
                            date: {
                                $dateFromParts: {
                                    year: '$_id.year',
                                    month: '$_id.month'
                                }
                            }
                        }
                    },
                    totalSales: 1
                }
            }
        ]);
        console.log("monthlySales: ", monthlySales);

        return monthlySales;
    }
});