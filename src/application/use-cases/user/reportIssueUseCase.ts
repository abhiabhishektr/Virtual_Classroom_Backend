// src/application/use-cases/user/reportIssueUseCase.ts
import { IReportIssueRepository } from "../../repositories/reportIssueRepository";
import { IReportIssue } from '../../../infrastructure/database/models/ReportIssue';

export const createReportIssueUseCase = (repository: IReportIssueRepository) => ({
  saveReport: async (userId: string, courseId: string, issueType: string, description: string): Promise<IReportIssue | null> => {
    return repository.saveReport(userId, courseId, issueType, description);
  },
  getReports: async (): Promise<IReportIssue[]> => {
    return repository.getReports();
  },
});