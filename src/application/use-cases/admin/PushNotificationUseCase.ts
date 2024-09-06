// src/application/use-cases/admin/PushNotificationUseCase.ts
import { IPushNotificationRepository } from '../../../application/repositories/PushNotificationRepository';
import { INotification } from '../../../infrastructure/database/models/PushNotificationSchema';

export const createPushNotificationUseCase = (repository: IPushNotificationRepository) => ({
    addNotification: async (notificationData: Object): Promise<INotification> => {
        return repository.createNotification(notificationData);
    },
    getNotificationsForUser: async (userId: string): Promise<INotification[]> => {
        return repository.getNotificationsByRecipient(userId);
    }
});
