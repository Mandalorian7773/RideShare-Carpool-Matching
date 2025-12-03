import { FastifyPluginAsync } from 'fastify';
import { createClient } from 'redis';

declare module 'fastify' {
  interface FastifyInstance {
    redis: ReturnType<typeof createClient>;
  }
}

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  const redisClient = createClient({
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

  // Close Redis connection when app closes
  fastify.addHook('onClose', async () => {
    await redisClient.quit();
    fastify.log.info('Redis connection closed');
  });
};

export default redisPlugin;