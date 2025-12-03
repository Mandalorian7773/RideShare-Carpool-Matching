"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisPlugin = async (fastify) => {
    const redisClient = (0, redis_1.createClient)({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        },
        password: process.env.REDIS_PASSWORD || undefined
    });
    redisClient.on('error', (err) => {
        fastify.log.error(`Redis Client Error: ${err.message}`);
    });
    redisClient.on('connect', () => {
        fastify.log.info('Redis Client Connected');
    });
    redisClient.on('ready', () => {
        fastify.log.info('Redis Client Ready');
    });
    await redisClient.connect();
    fastify.decorate('redis', redisClient);
    fastify.addHook('onClose', async () => {
        await redisClient.quit();
        fastify.log.info('Redis connection closed');
    });
};
exports.default = redisPlugin;
//# sourceMappingURL=redis.js.map