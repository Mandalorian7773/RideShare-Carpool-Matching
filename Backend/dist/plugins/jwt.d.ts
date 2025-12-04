import { FastifyPluginAsync } from 'fastify';
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
    }
    interface FastifyRequest {
        user?: {
            id: number;
            email: string;
            role: string;
        };
    }
}
declare const jwtPlugin: FastifyPluginAsync;
export default jwtPlugin;
//# sourceMappingURL=jwt.d.ts.map