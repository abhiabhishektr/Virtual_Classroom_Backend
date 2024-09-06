// src/application/use-cases/Teacher/TeacherDashboardUseCase.ts
import { ITeacherRepository, CourseSalesData, MonthlySales } from '../../repositories/teacherDashboardRepository';

export const teacherDashboardUseCase = (repository: ITeacherRepository) => ({
  getCourseSalesData: async (teacherId: string): Promise<CourseSalesData[]> => { 
    return repository.getCourseSalesData(teacherId);
  },
  getSalesData: async (teacherId: string): Promise<MonthlySales[]> => {
    return repository.getSalesData(teacherId);
  }
});