// src/application/repositories/GroupChatRepository.ts
import GroupChatModel, { IGroupChat } from '../../infrastructure/database/models/GroupChat';
import { IGroupChatReturn } from '../../infrastructure/database/models/MessageSchema';

export interface IGroupChatRepository {
    getMessages(roomId: string): Promise<IGroupChatReturn[]>;
    addMessage(roomId: string, senderId: string, content: string): Promise<IGroupChat>;
}

export const createGroupChatRepository = (): IGroupChatRepository => ({
    getMessages: async (roomId: string): Promise<IGroupChatReturn[]> => {   
        const result = await GroupChatModel.aggregate([
            { $match: { roomId: roomId } }, // Match the roomId
            { 
                $unwind: "$messages" // Unwind the messages array
            },
            {
                $addFields: {
                    "messages.senderId": { $toObjectId: "$messages.senderId" } // Convert senderId to ObjectId
                }
            },
            {
                $lookup: {
                    from: "users", // User collection
                    localField: "messages.senderId", // Match senderId with _id in users collection
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            { 
                $unwind: "$senderDetails" // Unwind sender details
            },
            {
                $group: {
                    _id: "$_id",
                    roomId: { $first: "$roomId" },
                    messages: {
                        $push: {
                            sender_email: "$senderDetails.email",
                            senderName: "$senderDetails.name",
                            content: "$messages.content",
                            timestamp: "$messages.timestamp",
                            isRead: "$messages.isRead"
                        }
                    },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id
                    roomId: 1,
                    messages: 1,
                    // createdAt: 1,
                    // updatedAt: 1
                }
            }
        ]);
    
        return result as IGroupChatReturn[];
    },
    addMessage: async (roomId: string, senderId: string, content: string): Promise<IGroupChat> => {

        let groupChat = await GroupChatModel.findOne({ roomId: roomId });
    
        if (groupChat) {       
            groupChat.messages.push({ senderId, content, timestamp: new Date() });
        } else {
            groupChat = new GroupChatModel({
                roomId: roomId,
                messages: [{ senderId, content, timestamp: new Date() }]
            });
        }
    
        return groupChat.save();
    }
});
