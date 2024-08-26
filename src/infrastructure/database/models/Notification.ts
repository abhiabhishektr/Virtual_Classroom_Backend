import mongoose, { Schema, Document } from 'mongoose';
import { DEFAULT_NOTIFICATION_LINK } from '../../../utils/Constants'; // Adjust the path as needed

interface INotification {
  title: string;
  message: string;
  date: Date;
  link: string; // Add the link field
}

interface IUser extends Document {
  userId: string;
  notifications: INotification[];
}

const notificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  link: { type: String, default: DEFAULT_NOTIFICATION_LINK } // Set default value
});

const userSchema: Schema = new Schema({
  userId: { type: String, required: true },
  notifications: [notificationSchema] // Use the notification schema
});

// Middleware to ensure only the last 10 notifications are kept
userSchema.pre('save', function (next) {
    if ((this as IUser).notifications.length > 10) {
      (this as IUser).notifications = (this as IUser).notifications.slice(-10); // Keep only the last 10 notifications
    }
    next();
  });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
