"use strict";
// backend/src/application/services/authService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redisClient_1 = require("../../main/redisClient");
// import { promisify } from 'util';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const ACCESS_TOKEN_EXPIRY = '15h'; // 15 minutes 
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
// // // testing
// const ACCESS_TOKEN_EXPIRY = '10s'; // 30 seconds
// const REFRESH_TOKEN_EXPIRY = '1m';  // 2 minutes
// const setAsync = promisify(redisClient.set).bind(redisClient);
exports.authService = {
    hashPassword: (password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(password, salt);
    }),
    verifyPassword: (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, hashedPassword);
    }),
    generateTokens: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        yield exports.authService.storeRefreshToken(user.id, refreshToken); // Store refresh token
        return { accessToken, refreshToken };
    }),
    verifyToken: (token) => {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    },
    storeRefreshToken: (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient_1.redisClient.set(userId, refreshToken, { EX: 7 * 24 * 60 * 60 });
        // await redisClient.set(userId, refreshToken,{ EX: 1 * 60 }); // testing
        // await setAsync(userId, refreshToken, 'EX', 7 * 24 * 60 * 60); // Store for 7 days
    }),
    refreshToken: (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
            const storedToken = yield redisClient_1.redisClient.get(decoded.id);
            if (storedToken !== refreshToken) {
                throw new Error('Invalid refresh token');
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
            const newRefreshToken = jsonwebtoken_1.default.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
            yield exports.authService.storeRefreshToken(decoded.id, newRefreshToken);
            return { accessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            return null;
        }
    }),
    removeRefreshToken: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient_1.redisClient.del(userId);
    })
};
