"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const ride_routes_1 = require("./modules/rides/ride.routes");
const db_1 = __importDefault(require("./plugins/db"));
const redis_1 = __importDefault(require("./plugins/redis"));
const websocket_1 = __importDefault(require("./plugins/websocket"));
const fcm_1 = __importDefault(require("./plugins/fcm"));
dotenv_1.default.config();
const app = (0, fastify_1.default)({
    logger: true
});
app.register(db_1.default);
app.register(redis_1.default);
app.register(websocket_1.default);
app.register(fcm_1.default);
app.register(ride_routes_1.rideRoutes, { prefix: '/api' });
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
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();
exports.default = app;
//# sourceMappingURL=app.js.map