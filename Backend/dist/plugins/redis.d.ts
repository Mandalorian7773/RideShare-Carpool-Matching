import { FastifyPluginAsync } from 'fastify';
import { createClient } from 'redis';
declare module 'fastify' {
    interface FastifyInstance {
        redis: ReturnType<typeof createClient>;
    }
}
declare const redisPlugin: FastifyPluginAsync;
export default redisPlugin;
//# sourceMappingURL=redis.d.ts.map