"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAuthMiddleware = void 0;
const mockAccessToken = 'mockAccessTokenString'; // Replace with your mock access token
// const mockRefreshToken = 'mockRefreshTokenString'; // Replace with your mock refresh token
const mockAuthMiddleware = (req, res, next) => {
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
exports.mockAuthMiddleware = mockAuthMiddleware;
