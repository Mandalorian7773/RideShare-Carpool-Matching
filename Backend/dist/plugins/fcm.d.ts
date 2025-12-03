import { FastifyPluginAsync } from 'fastify';
import * as admin from 'firebase-admin';
declare module 'fastify' {
    interface FastifyInstance {
        fcm: admin.messaging.Messaging;
    }
}
declare const fcmPlugin: FastifyPluginAsync;
export default fcmPlugin;
//# sourceMappingURL=fcm.d.ts.map