import { IAdminRepository, DashboardData } from '../../repositories/adminRepository';

export const getDashboardDataUseCase = (repository: IAdminRepository) => ({
  getDashboardData: async (): Promise<DashboardData> => {
    return repository.getDashboardData();
  },
});