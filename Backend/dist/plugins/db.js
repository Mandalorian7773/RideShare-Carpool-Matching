"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dbPlugin = async (fastify) => {
    const config = {
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
    const pool = new pg_1.Pool({
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
    try {
        const client = await pool.connect();
        fastify.log.info('Database connected successfully');
        client.release();
    }
    catch (err) {
        fastify.log.error(`Database connection error: ${err.message}`);
        throw err;
    }
    fastify.decorate('db', pool);
    fastify.addHook('onClose', async () => {
        await pool.end();
        fastify.log.info('Database connection pool closed');
    });
};
exports.default = dbPlugin;
//# sourceMappingURL=db.js.map