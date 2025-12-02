import { createClient } from 'redis';
declare module 'fastify' {
    interface FastifyInstance {
        redis: ReturnType<typeof createClient>;
    }
}
declare const redisPlugin: (fastify: import("fastify/fastify").FastifyInstance<import("fastify/fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify/fastify").FastifyBaseLogger, import("fastify/fastify").FastifyTypeProviderDefault>) => Promise<void>;
export default redisPlugin;
//# sourceMappingURL=redis.d.ts.map