"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const database_service_1 = require("../services/database.service");
const jwtPlugin = async (fastify) => {
    const secret = process.env.JWT_SECRET || 'my_jwt_secret_key';
    fastify.post('/api/auth/login', async (request, reply) => {
        const { email, password } = request.body;
        if (!email || !password) {
            return reply.status(400).send({
                success: false,
                error: 'Email and password are required'
            });
        }
        try {
            const client = await database_service_1.dbService.getClient();
            try {
                const result = await client.query('SELECT id, email, role FROM users WHERE email = $1 AND password = $2', [email, password]);
                if (result.rows.length === 0) {
                    return reply.status(401).send({
                        success: false,
                        error: 'Invalid credentials'
                    });
                }
                const user = result.rows[0];
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '24h' });
                return reply.status(200).send({
                    success: true,
                    data: {
                        token,
                        user: {
                            id: user.id,
                            email: user.email,
                            role: user.role
                        }
                    }
                });
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to login'
            });
        }
    });
    fastify.post('/api/auth/register', async (request, reply) => {
        const { email, password, role, firstName, lastName } = request.body;
        if (!email || !password || !role) {
            return reply.status(400).send({
                success: false,
                error: 'Email, password, and role are required'
            });
        }
        if (role !== 'driver' && role !== 'rider') {
            return reply.status(400).send({
                success: false,
                error: 'Role must be either driver or rider'
            });
        }
        try {
            const client = await database_service_1.dbService.getClient();
            try {
                const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
                if (existingUser.rows.length > 0) {
                    return reply.status(409).send({
                        success: false,
                        error: 'User already exists'
                    });
                }
                const result = await client.query('INSERT INTO users (email, password, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role', [email, password, role, firstName || null, lastName || null]);
                const user = result.rows[0];
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '24h' });
                return reply.status(201).send({
                    success: true,
                    data: {
                        token,
                        user: {
                            id: user.id,
                            email: user.email,
                            role: user.role
                        }
                    }
                });
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to register user'
            });
        }
    });
};
exports.default = jwtPlugin;
//# sourceMappingURL=jwt.js.map