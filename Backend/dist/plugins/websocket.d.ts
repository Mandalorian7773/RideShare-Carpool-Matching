import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';
declare module 'fastify' {
    interface FastifyInstance {
        io: Server;
    }
}
declare const websocketPlugin: (fastify: FastifyInstance) => Promise<void>;
export default websocketPlugin;
//# sourceMappingURL=websocket.d.ts.map