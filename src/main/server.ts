// backend/src/main/server.ts

import { App } from './app';
import * as dotenv from 'dotenv';
import { connectDB } from '../infrastructure/database/mongoDB';
import { redisClient } from './redisClient'; // Adjust the path as needed

dotenv.config();

const app = new App();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Connect to Redis and MongoDB, then start the app
async function startServer() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    await connectDB();
    console.log('Connected to MongoDB');

    app.start(PORT);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

  

// App
// Encapsulation: 
// Reusability: testing ,versioning,microservices,Muti Env (dev,pdtn)
// Structure: 