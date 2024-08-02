"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
// backend/src/main/redisClient.ts
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: 'localhost', // Redis server host
        port: 6379, // Redis server port
    }
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
