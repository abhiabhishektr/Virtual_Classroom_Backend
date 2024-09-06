import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createPushNotificationUseCase } from '../../../application/use-cases/admin/PushNotificationUseCase';
import { createPushNotificationRepository } from '../../../application/repositories/PushNotificationRepository';
import Notification from '../../../infrastructure/database/models/PushNotificationSchema';

const pushNotificationRepository = createPushNotificationRepository();
const pushNotificationUseCase = createPushNotificationUseCase(pushNotificationRepository);

export const initPushNotificationController = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        socket.on('admin-notification', async (notificationPayload: { title: string; message: string; recipientType: 'all' | 'teachers'; recipient?: string }) => {
            console.log("notificationPayload: ", notificationPayload);
            const { title, message, recipientType, recipient } = notificationPayload;

            try {
                const notificationData = new Notification({
                    title,
                    message,
                    recipientType,
                    recipientId: recipient || 'all',
                    createdAt: new Date(),
                    link: ''
                });

                await pushNotificationUseCase.addNotification(notificationData);

                if (recipientType === 'all') {
                    if (recipient && recipient !== 'all') {
                        io.to(recipient).emit('receive-notification', { title, message });
                    } else {
                        io.emit('receive-notification', { title, message });
                    }
                } else if (recipientType === 'teachers') {
                    if (recipient && recipient !== 'all') {
                        io.to(recipient).emit('receive-notification', { title, message });
                    } else {
                        io.to('teachers').emit('receive-notification', { title, message });
                    }
                }

                console.log(`Notification sent: ${title} - ${message}`);
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        });
    });
};


export const notificationController = async (req: Request, res: Response): Promise<void> => {
    try {

        const user = (req as any).user;
        let notifications = await pushNotificationUseCase.getNotificationsForUser(user.id);
        // console.log("notifications: ", notifications);
        // console.log("user: ", user);
        res.status(200).json({ notifications });
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: 'Internal Server Error!' });

    }

};