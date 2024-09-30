// backend/src/main/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from '../interfaces/middlewares/errorHandler';
import { authMiddleware } from '../interfaces/middlewares/authMiddleware';
import authenticationRoutes from '../interfaces/routes/user/authenticationRoutes';
import profileRoutes from '../interfaces/routes/user/profileRoutes';
import chatRoutes from '../interfaces/routes/live&Chat/chatRoutes';
import TeacherRoutes from '../interfaces/routes/teacher/TeacherRoutes';
// import classroomRoutes from '../interfaces/routes/classroomRoutes';
// import notificationRoutes from '../interfaces/routes/notificationRoutes';
// -----------------
import { adminMiddleware } from '../interfaces/middlewares/adminMiddleware';
import adminUserRoutes from '../interfaces/routes/admin/adminUserRoutes';
// -----------------
import { User } from '../types/user';
import { authAndTeacherMiddleware } from '../interfaces/middlewares/teacherAuthMiddleware';
import { mockAuthMiddleware } from '../interfaces/middlewares/mockAuthMiddleware';
import passport from 'passport';
import { DEFAULT_FRONTEND_LINK } from '../utils/Constants';
const cookieParser = require('cookie-parser');



declare global {
  namespace Express {
    interface Request {
      user?: User; // Ensure User type is correctly defined and imported
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
    // this.app.use(cors());
    this.app.use(cors({
      origin: DEFAULT_FRONTEND_LINK, // Add your frontend URL here
      methods: 'GET,POST,PUT,DELETE,PATCH',
      credentials: true
    }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(morgan('dev')); //  dev-log format  
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(mockAuthMiddleware);
    }

    this.app.use('/api/auth', authenticationRoutes);
    this.app.use('/api/profile', authMiddleware, profileRoutes);
    this.app.use('/api/chat', authMiddleware, chatRoutes);
    
    this.app.use('/api/teacher', authAndTeacherMiddleware, TeacherRoutes);
    // this.app.use('/api/classroom', authMiddleware, classroomRoutes);
    // this.app.use('/api/notifications', authMiddleware, notificationRoutes);
    // --------admin routes-----------
    this.app.use('/api/admin', adminMiddleware, adminUserRoutes);
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
