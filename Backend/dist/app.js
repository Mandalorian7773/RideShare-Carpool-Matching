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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv = __importStar(require("dotenv"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const cors_1 = __importDefault(require("@fastify/cors"));
const ride_routes_1 = require("./modules/rides/ride.routes");
const db_1 = __importDefault(require("./plugins/db"));
const redis_1 = __importDefault(require("./plugins/redis"));
const websocket_1 = __importDefault(require("./plugins/websocket"));
const fcm_1 = __importDefault(require("./plugins/fcm"));
dotenv.config();
const app = (0, fastify_1.default)({
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
app.register(helmet_1.default);
app.register(cors_1.default, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});
app.register(db_1.default);
app.register(redis_1.default);
app.register(websocket_1.default);
app.register(fcm_1.default);
app.register(ride_routes_1.rideRoutes, { prefix: '/api' });
app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});
app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(500).send({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
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
        const host = process.env.HOST || '0.0.0.0';
        await app.listen({ port, host });
        app.log.info(`Server listening on ${host}:${port}`);
        app.log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
exports.default = app;
//# sourceMappingURL=app.js.map