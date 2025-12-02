import admin from 'firebase-admin';
import { FastifyInstance } from 'fastify';
declare module 'fastify' {
    interface FastifyInstance {
        fcm: admin.messaging.Messaging;
    }
}
declare const fcmPlugin: (fastify: FastifyInstance) => Promise<void>;
export default fcmPlugin;
//# sourceMappingURL=fcm.d.ts.map