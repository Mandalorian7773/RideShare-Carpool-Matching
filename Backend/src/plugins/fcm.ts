import { FastifyPluginAsync } from 'fastify';
import * as admin from 'firebase-admin';

declare module 'fastify' {
  interface FastifyInstance {
    fcm: admin.messaging.Messaging;
  }
}

const fcmPlugin: FastifyPluginAsync = async (fastify) => {
  try {
   
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      
      if (!projectId) {
        fastify.log.warn('FIREBASE_PROJECT_ID not set, FCM will not be available');
        return;
      }
      
      const config: admin.AppOptions = {
        projectId: projectId
      };
      
      if (credentialsPath) {
        config.credential = admin.credential.cert(credentialsPath);
      }
      
      admin.initializeApp(config);
      fastify.log.info('Firebase Admin SDK initialized');
    }

    const fcm = admin.messaging();
    fastify.decorate('fcm', fcm);
    
    fastify.log.info('FCM plugin registered successfully');
  } catch (error: any) {
    fastify.log.error(`Failed to initialize FCM: ${error.message}`);
  }
};

export default fcmPlugin;