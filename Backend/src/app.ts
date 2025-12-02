import fastify from 'fastify';
import dotenv from 'dotenv';
import { rideRoutes } from './modules/rides/ride.routes';
import dbPlugin from './plugins/db';
import redisPlugin from './plugins/redis';
import websocketPlugin from './plugins/websocket';
import fcmPlugin from './plugins/fcm';

dotenv.config();

const app = fastify({ 
  logger: true 
});

app.register(dbPlugin);
app.register(redisPlugin);
app.register(websocketPlugin);
app.register(fcmPlugin);

app.register(rideRoutes, { prefix: '/api' });

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  reply.status(500).send({
    success: false,
    error: 'Internal Server Error'
  });
});

app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: 'Route not found'
  });
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

export default app;