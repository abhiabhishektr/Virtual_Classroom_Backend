// src/infrastructure/database/models/PushNotificationSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    title: string;
    message: string;
    recipientType: 'all' | 'teachers';
    recipientId: string; // 'all' or specific user ID
    createdAt: Date;
    link?: string; // Optional link
}

const NotificationSchema: Schema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipientType: { type: String, enum: ['students', 'teachers', 'all'], required: true },
    recipientId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    link: { type: String, required: false }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);

