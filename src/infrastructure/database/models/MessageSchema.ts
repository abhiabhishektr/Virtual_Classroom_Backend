import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    groupId: string;
    senderId: string;
    message: string;
}

export interface IGroupChatReturn extends Document {
    roomId: string;
    messages: IMessageReturn[];
    createdAt: Date;
    updatedAt: Date;
  }
export interface IMessageReturn extends Document {
    sender_email: string;
    senderName: string;
    content: string;
    timestamp?: Date; 
    isRead?: boolean; 
}

const MessageSchema: Schema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
 