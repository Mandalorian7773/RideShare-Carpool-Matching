import { FastifyPluginAsync } from 'fastify';
import { Server } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

const websocketPlugin: FastifyPluginAsync = async (fastify) => {
  const io = new Server(fastify.server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    }
  });

  fastify.decorate('io', io);

  io.on('connection', (socket) => {
    fastify.log.info(`User connected: ${socket.id}`);

    socket.on('join-ride', (rideId) => {
      socket.join(`ride-${rideId}`);
      fastify.log.debug(`User ${socket.id} joined ride ${rideId}`);
    });

    socket.on('leave-ride', (rideId) => {
      socket.leave(`ride-${rideId}`);
      fastify.log.debug(`User ${socket.id} left ride ${rideId}`);
    });

    socket.on('disconnect', () => {
      fastify.log.info(`User disconnected: ${socket.id}`);
    });
  });

  // Log when the server starts listening
  fastify.addHook('onReady', () => {
    fastify.log.info('WebSocket server initialized');
  });
};

export default websocketPlugin;