// src/interfaces/routes/live&Chat/chatRoutes.ts

import { Router } from 'express';
import { getGroups, getMessages } from '../../controllers/user/chatController';
// getMessages, sendMessage, createGroup
const router = Router();

// Get the group IDs (room IDs) the user is connected to
router.get('/group', getGroups);

// Get messages from a specific group (room)
router.get('/groups/:groupId/messages', getMessages);

// Send a message to a specific group (room)
// router.post('/groups/:groupId/messages', sendMessage);


export default router;
