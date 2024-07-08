// backend/src/main/server.ts

import { App } from './app';
import dotenv from 'dotenv';
import { connectDB } from '../infrastructure/database/mongoDB';

dotenv.config();

const app = new App();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.start(PORT);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
