import { FastifyPluginAsync } from 'fastify';
import { Pool } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    db: Pool;
  }
}

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
  connectionTimeout?: number;
  idleTimeout?: number;
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'rideshare',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000')
  };

  const pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ssl: config.ssl,
    max: config.maxConnections,
    idleTimeoutMillis: config.idleTimeout,
    connectionTimeoutMillis: config.connectionTimeout
  });

  // Check database connection
  try {
    const client = await pool.connect();
    fastify.log.info('Database connected successfully');
    client.release();
  } catch (err: any) {
    fastify.log.error(`Database connection error: ${err.message}`);
    throw err;
  }

  fastify.decorate('db', pool);

  // Close pool when app closes
  fastify.addHook('onClose', async () => {
    await pool.end();
    fastify.log.info('Database connection pool closed');
  });
};

export default dbPlugin;