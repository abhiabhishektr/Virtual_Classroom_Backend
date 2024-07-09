// backend/src/main/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from '../interfaces/middlewares/errorHandler';
import { authMiddleware } from '../interfaces/middlewares/authMiddleware';
import authenticationRoutes from '../interfaces/routes/authenticationRoutes';
import profileRoutes from '../interfaces/routes/profileRoutes';
// import classroomRoutes from '../interfaces/routes/classroomRoutes';
// import notificationRoutes from '../interfaces/routes/notificationRoutes';



declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        // add other properties as needed
      };
    }
  }
}

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.setupErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use('/api/auth', authenticationRoutes);
    this.app.use('/api/profile', authMiddleware, profileRoutes);
    // this.app.use('/api/classroom', authMiddleware, classroomRoutes);
    // this.app.use('/api/notifications', authMiddleware, notificationRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
