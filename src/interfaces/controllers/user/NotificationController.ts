// // src/presentation/controllers/NotificationController.ts
// import { Request, Response } from 'express';
// import { createNotificationUseCase } from '../../application/use-cases/NotificationUseCase';
// import { createPushNotificationRepository } from '../../application/repositories/PushNotificationRepository';
// import { createNotificationStatusRepository } from '../../application/repositories/NotificationStatusRepository';

// const notificationUseCase = createNotificationUseCase(
//     createPushNotificationRepository(),
//     createNotificationStatusRepository()
// );

// export const NotificationController = {
//     createNotification: async (req: Request, res: Response) => {
//         try {
//             const notification = await notificationUseCase.addNotification(req.body);
//             res.status(201).json(notification);
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to create notification' });
//         }
//     },

//     getUserNotifications: async (req: Request, res: Response) => {
//         try {
//             const userId = req.params.userId;
//             const notifications = await notificationUseCase.getNotificationsForUser(userId);
//             res.status(200).json(notifications);
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to fetch notifications' });
//         }
//     },

//     markAsSeen: async (req: Request, res: Response) => {
//         try {
//             const { userId, notificationId } = req.params;
//             const status = await notificationUseCase.markNotificationAsSeen(userId, notificationId);
//             res.status(200).json(status);
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to mark notification as seen' });
//         }
//     },

//     getNotificationStatus: async (req: Request, res: Response) => {
//         try {
//             const { userId, notificationId } = req.params;
//             const status = await notificationUseCase.getNotificationStatusForUser(userId, notificationId);
//             res.status(200).json(status);
//         } catch (error) {
//             res.status(500).json({ error: 'Failed to fetch notification status' });
//         }
//     }
// };
