"use strict";
// backend/src/main/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("../interfaces/middlewares/errorHandler");
const authMiddleware_1 = require("../interfaces/middlewares/authMiddleware");
const authenticationRoutes_1 = __importDefault(require("../interfaces/routes/authenticationRoutes"));
const profileRoutes_1 = __importDefault(require("../interfaces/routes/profileRoutes"));
const TeacherRoutes_1 = __importDefault(require("../interfaces/routes/teacher/TeacherRoutes"));
// import classroomRoutes from '../interfaces/routes/classroomRoutes';
// import notificationRoutes from '../interfaces/routes/notificationRoutes';
// -----------------
const adminMiddleware_1 = require("../interfaces/middlewares/adminMiddleware");
const adminUserRoutes_1 = __importDefault(require("../interfaces/routes/admin/adminUserRoutes"));
const teacherAuthMiddleware_1 = require("../interfaces/middlewares/teacherAuthMiddleware");
const mockAuthMiddleware_1 = require("../interfaces/middlewares/mockAuthMiddleware");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configureMiddleware();
        this.configureRoutes();
        this.setupErrorHandling();
    }
    configureMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)('dev')); //  dev-log format  
        this.app.use(express_1.default.json());
    }
    configureRoutes() {
        if (process.env.NODE_ENV === 'development') {
            this.app.use(mockAuthMiddleware_1.mockAuthMiddleware);
        }
        this.app.use('/api/auth', authenticationRoutes_1.default);
        this.app.use('/api/profile', authMiddleware_1.authMiddleware, profileRoutes_1.default);
        this.app.use('/api/teacher', teacherAuthMiddleware_1.authAndTeacherMiddleware, TeacherRoutes_1.default);
        // this.app.use('/api/classroom', authMiddleware, classroomRoutes);
        // this.app.use('/api/notifications', authMiddleware, notificationRoutes);
        // --------admin routes-----------
        this.app.use('/api/admin', adminMiddleware_1.adminMiddleware, adminUserRoutes_1.default);
    }
    setupErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
exports.App = App;
