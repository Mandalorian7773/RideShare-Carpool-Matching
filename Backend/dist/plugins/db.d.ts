import { Pool } from 'pg';
import { FastifyInstance } from 'fastify';
declare module 'fastify' {
    interface FastifyInstance {
        db: Pool;
    }
}
declare const dbPlugin: (fastify: FastifyInstance) => Promise<void>;
export default dbPlugin;
//# sourceMappingURL=db.d.ts.map