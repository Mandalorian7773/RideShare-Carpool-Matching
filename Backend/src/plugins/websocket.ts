import fp from 'fastify-plugin';
import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

const websocketPlugin = fp(async (fastify: FastifyInstance) => {
  const io = new Server(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  fastify.decorate('io', io);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-ride', (rideId) => {
      socket.join(`ride-${rideId}`);
      console.log(`User ${socket.id} joined ride ${rideId}`);
    });

    socket.on('leave-ride', (rideId) => {
      socket.leave(`ride-${rideId}`);
      console.log(`User ${socket.id} left ride ${rideId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
});

export default websocketPlugin;