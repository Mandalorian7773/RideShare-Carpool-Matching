"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const ride_repository_1 = require("./ride.repository");
class RideService {
    constructor(fastify) {
        this.repository = new ride_repository_1.RideRepository(fastify.db);
    }
    async createRide(rideData, driverId) {
        return this.repository.createRide(rideData, driverId);
    }
    async searchRides(searchParams) {
        return this.repository.searchRides(searchParams);
    }
    async requestSeat(rideId, riderId) {
        return this.repository.requestSeat(rideId, riderId);
    }
    async approveSeat(seatRequestId) {
        return this.repository.approveSeat(seatRequestId);
    }
    async startRide(rideId, driverId) {
        return this.repository.startRide(rideId, driverId);
    }
    async endRide(rideId, driverId) {
        return this.repository.endRide(rideId, driverId);
    }
    async cancelRide(rideId, userId) {
        return this.repository.cancelRide(rideId, userId);
    }
    async sendMessage(rideId, senderId, content) {
        return this.repository.sendMessage(rideId, senderId, content);
    }
    async getMessages(rideId) {
        return this.repository.getMessages(rideId);
    }
    async addRating(rideId, reviewerId, reviewedUserId, rating, comment) {
        return this.repository.addRating(rideId, reviewerId, reviewedUserId, rating, comment);
    }
    async getUserRatings(userId) {
        return this.repository.getUserRatings(userId);
    }
}
exports.RideService = RideService;
//# sourceMappingURL=ride.service.js.map