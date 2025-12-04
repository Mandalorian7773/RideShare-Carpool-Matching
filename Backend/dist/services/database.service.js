"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const pg_1 = require("pg");
class DatabaseService {
    constructor() {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'rideshare',
            user: process.env.DB_USER || 'rideshare_user',
            password: process.env.DB_PASSWORD || 'password123',
            ssl: process.env.DB_SSL === 'true',
            maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
            connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
            idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000')
        };
        this.pool = new pg_1.Pool({
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
    }
    async initialize() {
        try {
            const client = await this.pool.connect();
            console.log('Database connected successfully');
            client.release();
        }
        catch (err) {
            console.error(`Database connection error: ${err.message}`);
            throw err;
        }
    }
    async getClient() {
        return await this.pool.connect();
    }
    async close() {
        await this.pool.end();
        console.log('Database connection pool closed');
    }
}
exports.dbService = new DatabaseService();
//# sourceMappingURL=database.service.js.map