import fastify from 'fastify';
import * as dotenv from 'dotenv';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { rideRoutes } from './modules/rides/ride.routes';
import websocketPlugin from './plugins/websocket';
import fcmPlugin from './plugins/fcm';
import jwtPlugin from './plugins/jwt';
import { dbService } from './services/database.service';
import * as jwt from 'jsonwebtoken';

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

app.register(helmet);
app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

app.addHook('onReady', async () => {
  try {
    await dbService.initialize();
    app.log.info('Database service initialized successfully');
  } catch (err) {
    app.log.error({ err }, 'Failed to initialize database service');
    throw err;
  }
});

const secret = process.env.JWT_SECRET || 'my_jwt_secret_key';
app.decorate('authenticate', async (request: any, reply: any) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader) {
    return reply.status(401).send({
      success: false,
      error: 'Missing authorization header'
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded: any = jwt.verify(token, secret);
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

app.register(jwtPlugin);

app.register(websocketPlugin);
app.register(fcmPlugin);

app.register(rideRoutes, { prefix: '/api' });

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    app.log.info(`Server listening on ${host}:${port}`);
    app.log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (err) {
    app.log.error({ err }, 'Server startup error');
    process.exit(1);
  }
};

app.ready((err) => {
  if (err) {
    app.log.error({ err }, 'Failed to start server');
    process.exit(1);
  }
  start();
});

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

app.setErrorHandler((error, request, reply) => {
  app.log.error({ err: error }, 'Unhandled server error');
  
  reply.status(500).send({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (error as Error).message
  });
});

app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: 'Route not found'
  });
});

export default app;