import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
interface UserPayload {
    id: number;
    role: string;
    email: string;
}
interface FastifyRequestWithUser extends FastifyRequest {
    user?: UserPayload;
}
export declare class RideController {
    private service;
    constructor(fastify: FastifyInstance);
    createRide(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    searchRides(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    requestSeat(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    approveSeat(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    startRide(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    endRide(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    cancelRide(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    sendMessage(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    getMessages(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    addRating(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    getUserRatings(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getCurrentRides(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    getUpcomingRides(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
    getPastRides(request: FastifyRequestWithUser, reply: FastifyReply): Promise<never>;
}
export {};
//# sourceMappingURL=ride.controller.d.ts.map