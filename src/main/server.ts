// backend/src/main/server.ts

import { App } from './app';
import * as dotenv from 'dotenv'; //allows accessing all functionalities and constants provided by dotenv
import { connectDB } from '../infrastructure/database/mongoDB';

dotenv.config();

const app = new App();
// const PORT = process.env.PORT || 5000;
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;


connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    app.start(PORT);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });


// App
// Encapsulation: 
// Reusability: testing ,versioning,microservices,Muti Env (dev,pdtn)
// Structure: 