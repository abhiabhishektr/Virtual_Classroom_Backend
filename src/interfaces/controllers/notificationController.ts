// // backend/src/interfaces/controllers/notificationController.ts

// import { Request, Response } from 'express';
// import { getNotifications } from '../../application/use-cases/notification';

// export const getNotifications = async (req: Request, res: Response) => {
//   try {
//     const notifications = await getNotifications((req as any).user);
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
