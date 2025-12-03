import { FastifyPluginAsync } from 'fastify';
import { Server } from 'socket.io';
declare module 'fastify' {
    interface FastifyInstance {
        io: Server;
    }
}
declare const websocketPlugin: FastifyPluginAsync;
export default websocketPlugin;
//# sourceMappingURL=websocket.d.ts.map