// src/middlewares/mockAuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const mockAccessToken = 'mockAccessTokenString'; // Replace with your mock access token
// const mockRefreshToken = 'mockRefreshTokenString'; // Replace with your mock refresh token

export const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {


    // Set the access token only if it's not already present
    if (!req.headers['authorization']) {
        req.headers['authorization'] = `Bearer ${mockAccessToken}`;
    }

    // Set the refresh token only if it's not already present
    // if (!req.headers['refresh-token']) {
    //     req.headers['refresh-token'] = `Bearer ${mockRefreshToken}`;
    // }

    next();
};
