import { Request, Response } from 'express';
import { userRepository } from '../../../application/repositories/userRepository';
import { createAdminRepository } from '../../../application/repositories/adminRepository';
import { getDashboardDataUseCase } from '../../../application/use-cases/admin/getDashboardDataUseCase';

const adminRepository = createAdminRepository();
const getDashboardData = getDashboardDataUseCase(adminRepository);


export const getUsers = async (req: Request, res: Response) => {
  
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req: Request, res: Response) => {

  const userId = req.params.id;
  try {
    await userRepository.blockUser(userId);
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    await userRepository.unblockUser(userId);
    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getDashboardDataController = async (req: Request, res: Response) => {
  try {
    const dashboardData = await getDashboardData.getDashboardData(); 

    res.status(200).json({data: dashboardData});
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' }); 
  }
};