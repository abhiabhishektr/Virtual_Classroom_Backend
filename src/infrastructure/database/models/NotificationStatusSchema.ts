// src/infrastructure/database/models/NotificationStatusSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationStatus extends Document {
    userId: string;
    notificationId: string;
    seen: boolean;
    seenAt?: Date;
}

const NotificationStatusSchema: Schema = new Schema({
    userId: { type: String, required: true },
    notificationId: { type: Schema.Types.ObjectId, ref: 'Notification', required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date }
});

export default mongoose.model<INotificationStatus>('NotificationStatus', NotificationStatusSchema);
