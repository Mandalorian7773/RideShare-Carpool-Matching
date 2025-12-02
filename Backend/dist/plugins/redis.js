"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const redis_1 = require("redis");
const redisPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    const redisClient = (0, redis_1.createClient)({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        },
        password: process.env.REDIS_PASSWORD || undefined
    });
    redisClient.on('error', (err) => {
        console.error('Redis Client Error', err);
    });
    await redisClient.connect();
    fastify.decorate('redis', redisClient);
    fastify.addHook('onClose', async () => {
        await redisClient.quit();
    });
});
exports.default = redisPlugin;
//# sourceMappingURL=redis.js.map