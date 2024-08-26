// src/main/socket.ts

import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { redisClient } from './redisClient'; // Adjust the path as needed
import { authService } from '../application/services/authService';
import { initGroupChatController } from '../interfaces/controllers/user/groupChatController';

export function initSocket(server: Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:5173', // Your frontend URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = authService.verifyToken(token);
        (socket as any).user = { id: decoded.id }; // Attach user info (ID) to socket object
        next();
      } catch (err) {
        console.error('Invalid token:', err);
        next(new Error('Authentication error'));
      }
    } else {
      next(new Error('Authentication error'));
    }
  });

  // Initialize the group chat controller
  initGroupChatController(io);


  io.on('connection', (socket) => {
    console.log('New Socket.IO connection:', socket.id);

    const userId = getUserIdFromSocket(socket); // Extract user ID from the socket object
    if (userId) {
      redisClient.set(`user:${userId}`, socket.id);
      console.log(`User connected: user:${userId}, socket ID: ${socket.id}`);
    }

    // Handle incoming messages
    // socket.on('sendMessage', (message) => {
    //   console.log('Received message:', message);
    //   socket.emit('echo', `Echo: ${message}`);
    // });

    socket.on('group-message', (message) => {
      console.log('Received message from group:', message);
      socket.emit('echo', `Echo: ${message}`);
    });

    // Handle socket disconnection
    socket.on('disconnect', async () => {
      console.log('Socket.IO connection closed:', socket.id);
      if (userId) {
        await redisClient.del(`user:${userId}`);
      }
    });
  });

  return io;
}

// Extract user ID from the socket object
function getUserIdFromSocket(socket: any): string | null {
  return socket.user?.id || null;
}




// Use Compression Algorithms: Employ gzip or
//  Brotli compression to reduce the size of data transmitted over the network.

// **Batch updates and send deltas** are the most effective
//  for minimizing data and optimizing performance.