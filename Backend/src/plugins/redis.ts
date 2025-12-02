import fp from 'fastify-plugin';
import { createClient } from 'redis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: ReturnType<typeof createClient>;
  }
}

const redisPlugin = fp(async (fastify) => {
  const redisClient = createClient({
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

export default redisPlugin;