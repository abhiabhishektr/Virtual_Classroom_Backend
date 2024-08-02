import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const authAndTeacherMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
        (req as any).user = { id: decoded.id };

        if (decoded.role === 'admin' || decoded.role === 'teacher') {
            console.log('Access granted. User is a teacher or admin.');
            next();
        } else {
            res.status(403).json({ message: 'Access denied. You must be a teacher or admin.' });
        }
    } catch (err: any) {
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};
    