// // src/application/repositories/NotificationStatusRepository.ts
// import NotificationStatus, { INotificationStatus } from '../../infrastructure/database/models/NotificationStatusSchema';

// export interface INotificationStatusRepository {
//     markAsSeen(userId: string, notificationId: string): Promise<INotificationStatus | null>;
//     getNotificationStatus(userId: string, notificationId: string): Promise<INotificationStatus | null>;
// }

// export const createNotificationStatusRepository = (): INotificationStatusRepository => ({
//     markAsSeen: async (userId: string, notificationId: string): Promise<INotificationStatus | null> => {
//         return await NotificationStatus.findOneAndUpdate(
//             { userId, notificationId },
//             { seen: true, seenAt: new Date() },
//             { new: true, upsert: true }
//         );
//     },
//     getNotificationStatus: async (userId: string, notificationId: string): Promise<INotificationStatus | null> => {
//         return await NotificationStatus.findOne({ userId, notificationId });
//     }
// });
