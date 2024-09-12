// src/application/repositories/reportIssueRepository.ts

import { IReportIssue } from '../../infrastructure/database/models/ReportIssue';
import ReportIssue from '../../infrastructure/database/models/ReportIssue';

export interface IReportIssueRepository {
    saveReport(userId: string, courseId: string, issueType: string, description: string): Promise<IReportIssue | null>;
    getReports(): Promise<IReportIssue[]>; // Get all reports
}

export const createReportIssueRepository = (): IReportIssueRepository => ({
    saveReport: async (userId: string, courseId: string, issueType: string, description: string): Promise<IReportIssue | null> => {
        try {
            const newReport = new ReportIssue({
                userId,
                courseId,
                issueType,
                description
            });
            const savedReport = await newReport.save();
            return savedReport;
        } catch (error) {
            console.error('Error saving report:', error); // Log the error for debugging
            return null;
        }
    },
    getReports: async (): Promise<any[]> => { // Use any[] for now, adjust later
        const reports = await ReportIssue.aggregate([
            {
                $lookup: {
                    from: 'users', // Collection name of users
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }, // Unwind the 'user' array
            {
                $lookup: {
                    from: 'courses', // Collection name of courses
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' }, // Unwind the 'course' array
            {
                $project: {
                    _id: 0, // Exclude the original _id field
                    username: '$user.name', // Get the user name
                    courseName: '$course.title', // Get the course title
                    issueType: 1, // Include the issueType
                    description: 1, // Include the description
                    createdAt: 1 // Include the createdAt
                }
            }
        ])
        return reports;
    }
});