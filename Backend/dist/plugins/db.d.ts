import { FastifyPluginAsync } from 'fastify';
import { Pool } from 'pg';
declare module 'fastify' {
    interface FastifyInstance {
        db: Pool;
    }
}
declare const dbPlugin: FastifyPluginAsync;
export default dbPlugin;
//# sourceMappingURL=db.d.ts.map