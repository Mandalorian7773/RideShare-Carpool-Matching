"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.register(cors_1.default, {
    origin: '*'
});
// Properly configure JWT with a fallback secret if JWT_SECRET is not defined
fastify.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || "fallback_secret_key"
}).ready((err) => {
    if (err)
        throw err;
});
