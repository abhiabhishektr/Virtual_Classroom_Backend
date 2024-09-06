// // src/application/use-cases/NotificationUseCase.ts
// import { IPushNotificationRepository } from '../repositories/PushNotificationRepository';
// import { INotificationStatusRepository } from '../repositories/NotificationStatusRepository';
// import { INotification } from '../../infrastructure/database/models/PushNotificationSchema';
// import { INotificationStatus } from '../../infrastructure/database/models/NotificationStatusSchema';

// export const createNotificationUseCase = (
//     notificationRepository: IPushNotificationRepository,
//     statusRepository: INotificationStatusRepository
// ) => ({
//     addNotification: async (notificationData: Omit<INotification, '_id'>): Promise<INotification> => {
//         return notificationRepository.createNotification(notificationData);
//     },
//     getNotificationsForUser: async (userId: string): Promise<INotification[]> => {
//         return notificationRepository.getNotificationsByRecipient(userId);
//     },
//     markNotificationAsSeen: async (userId: string, notificationId: string): Promise<INotificationStatus | null> => {
//         return statusRepository.markAsSeen(userId, notificationId);
//     },
//     getNotificationStatusForUser: async (userId: string, notificationId: string): Promise<INotificationStatus | null> => {
//         return statusRepository.getNotificationStatus(userId, notificationId);
//     }
// });
