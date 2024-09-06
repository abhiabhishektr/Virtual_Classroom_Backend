// src/interfaces/controllers/user/groupChatController.ts
import { Server, Socket } from 'socket.io';
import { createGroupChatUseCase } from '../../../application/use-cases/groupChat/GroupChatUseCase';
import { createGroupChatRepository } from '../../../application/repositories/GroupChatRepository';

// Initialize the GroupChatUseCase with the repository
const groupChatRepository = createGroupChatRepository();
const groupChatUseCase = createGroupChatUseCase(groupChatRepository);

export const initGroupChatController = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('group-message', async (messagePayload: { roomId: string, senderEmail: string, content: string, name: string }) => {
            const senderId = (socket as any).user.id;

            const { roomId, senderEmail, content, name } = messagePayload;
            // console.log(`Received message from ${senderId} in room ${roomId}: ${content}`);

            try {
                await groupChatUseCase.addMessage(roomId, senderId, content);
                io.to(roomId).emit('message', { content, senderName: name, sender_id: senderEmail });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

    });
};

