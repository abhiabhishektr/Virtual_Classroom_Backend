// import User, { IUser } from '../../infrastructure/database/models/User';
// import { INotification } from '';
// import mongoose from 'mongoose';

// export interface IUserNotificationRepository {
//     addNotification(userId: string, notification: INotification): Promise<IUser | null>;
//     getNotifications(userId: string): Promise<INotification[]>;
//     clearNotifications(userId: string): Promise<IUser | null>;
// }

// export const createUserNotificationRepository = (): IUserNotificationRepository => ({
//     addNotification: async (userId: string, notification: INotification): Promise<IUser | null> => {
//         const userIdObj = mongoose.Types.ObjectId(userId); // Convert to ObjectId

//         // Add the new notification to the user's notifications array
//         const updatedUser = await User.findOneAndUpdate(
//             { userId: userIdObj },
//             { $push: { notifications: notification } },
//             { new: true }
//         );

//         return updatedUser;
//     },

//     getNotifications: async (userId: string): Promise<INotification[]> => {
//         const userIdObj = mongoose.Types.ObjectId(userId); // Convert to ObjectId

//         // Retrieve user and return the notifications
//         const user = await User.findOne({ userId: userIdObj }, { notifications: 1 });

//         return user ? user.notifications : [];
//     },

//     clearNotifications: async (userId: string): Promise<IUser | null> => {
//         const userIdObj = mongoose.Types.ObjectId(userId); // Convert to ObjectId

//         // Clear all notifications
//         const updatedUser = await User.findOneAndUpdate(
//             { userId: userIdObj },
//             { $set: { notifications: [] } },
//             { new: true }
//         );

//         return updatedUser;
//     }
// });
