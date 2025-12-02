"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const socket_io_1 = require("socket.io");
const websocketPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    const io = new socket_io_1.Server(fastify.server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    fastify.decorate('io', io);
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('join-ride', (rideId) => {
            socket.join(`ride-${rideId}`);
            console.log(`User ${socket.id} joined ride ${rideId}`);
        });
        socket.on('leave-ride', (rideId) => {
            socket.leave(`ride-${rideId}`);
            console.log(`User ${socket.id} left ride ${rideId}`);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
});
exports.default = websocketPlugin;
//# sourceMappingURL=websocket.js.map