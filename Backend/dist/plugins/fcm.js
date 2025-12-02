"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fcmPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    if (!firebase_admin_1.default.apps.length) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
    }
    const fcm = firebase_admin_1.default.messaging();
    fastify.decorate('fcm', fcm);
});
exports.default = fcmPlugin;
//# sourceMappingURL=fcm.js.map