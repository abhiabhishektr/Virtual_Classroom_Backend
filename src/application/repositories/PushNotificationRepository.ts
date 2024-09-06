// src/application/repositories/PushNotificationRepository.ts
import Notification, { INotification } from '../../infrastructure/database/models/PushNotificationSchema';

export interface IPushNotificationRepository {
    createNotification(notificationData:Object): Promise<INotification>;
    getNotificationsByRecipient(recipientId: string): Promise<INotification[]>;
}

export const createPushNotificationRepository = (): IPushNotificationRepository => ({
    createNotification: async (notificationData: Omit<INotification, '_id'>): Promise<INotification> => {
        const notification = new Notification(notificationData);
        return await notification.save();
    },
    getNotificationsByRecipient: async (recipientId: string): Promise<INotification[]> => {
        return await Notification.find({
            $or: [
                { recipientType: 'all' ,recipientId},
                { recipientType: 'teachers', recipientId }
            ]
        }).sort({ createdAt: -1 }).exec();
    }
});
