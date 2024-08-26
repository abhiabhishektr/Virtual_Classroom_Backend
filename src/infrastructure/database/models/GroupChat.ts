// src/infrastructure/database/models/GroupChat.ts

import mongoose, { Document, Schema } from 'mongoose';

// Define the message schema
interface IMessage {
  senderId: string; // Reference to the user
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true }, // Reference to the User model
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false }); // _id: false to avoid creating an extra `_id` for messages

// Define the group chat schema
export interface IGroupChat extends Document {
  roomId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const groupChatSchema = new Schema<IGroupChat>({
  roomId: { type: String, unique: true, required: true }, // Unique identifier for the chat room
  messages: [messageSchema], // Embedded messages array
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
groupChatSchema.pre('save', function (next) {
    this.updatedAt = new Date(); // Correctly set updatedAt as a Date object
    next();
  });
  
// Create and export the model
const GroupChat = mongoose.model<IGroupChat>('GroupChat', groupChatSchema);
export default GroupChat;
