import fp from 'fastify-plugin';
import admin from 'firebase-admin';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    fcm: admin.messaging.Messaging;
  }
}

const fcmPlugin = fp(async (fastify: FastifyInstance) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }

  const fcm = admin.messaging();
  fastify.decorate('fcm', fcm);
});

export default fcmPlugin;