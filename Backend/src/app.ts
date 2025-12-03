import fastify from 'fastify';
import * as dotenv from 'dotenv';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { rideRoutes } from './modules/rides/ride.routes';
import dbPlugin from './plugins/db';
import redisPlugin from './plugins/redis';
import websocketPlugin from './plugins/websocket';
import fcmPlugin from './plugins/fcm';

dotenv.config();

const app = fastify({ 
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'production' ? undefined : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Security plugins
app.register(helmet);
app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Register database and other plugins
app.register(dbPlugin);
app.register(redisPlugin);
app.register(websocketPlugin);
app.register(fcmPlugin);

// Register routes
app.register(rideRoutes, { prefix: '/api' });

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Global error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  // Send error response
  reply.status(500).send({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (error as Error).message
  });
});

// 404 handler
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: 'Route not found'
  });
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    app.log.info(`Server listening on ${host}:${port}`);
    app.log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export default app;