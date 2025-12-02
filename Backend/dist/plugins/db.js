"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const pg_1 = require("pg");
const dbPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'rideshare',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    };
    const pool = new pg_1.Pool({
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
    }
    catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
    fastify.decorate('db', pool);
    fastify.addHook('onClose', async () => {
        await pool.end();
    });
});
exports.default = dbPlugin;
//# sourceMappingURL=db.js.map