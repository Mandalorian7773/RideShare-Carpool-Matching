import fp from 'fastify-plugin';
import { Pool, QueryResult } from 'pg';
import { FastifyInstance } from 'fastify';

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
}

const dbPlugin = fp(async (fastify: FastifyInstance) => {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'rideshare',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  };

  const pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });

  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }

  fastify.decorate('db', pool);

  fastify.addHook('onClose', async () => {
    await pool.end();
  });
});

export default dbPlugin;