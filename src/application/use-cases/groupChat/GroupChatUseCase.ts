// src/application/use-cases/groupChat/GroupChatUseCase.ts
import { IGroupChatRepository } from '../../repositories/GroupChatRepository';
import { IGroupChat } from '../../../infrastructure/database/models/GroupChat';
import { IGroupChatReturn } from '../../../infrastructure/database/models/MessageSchema';

export const createGroupChatUseCase = (repository: IGroupChatRepository) => ({
    getMessages: async (roomId: string): Promise<IGroupChatReturn[]> => {
        return repository.getMessages(roomId);
    },
    addMessage: async (roomId: string, senderId: string, content: string): Promise<IGroupChat> => {
        return repository.addMessage(roomId, senderId, content);
    }
});
