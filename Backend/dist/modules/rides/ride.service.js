"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const ride_repository_1 = require("./ride.repository");
const database_service_1 = require("../../services/database.service");
class RideService {
    constructor(fastify) {
        const mockDb = {
            query: async (query, values) => {
                const client = await database_service_1.dbService.getClient();
                try {
                    return await client.query(query, values);
                }
                finally {
                    client.release();
                }
            },
            connect: async () => {
                return await database_service_1.dbService.getClient();
            }
        };
        this.repository = new ride_repository_1.RideRepository(mockDb);
    }
    async createRide(rideData, driverId) {
        return this.repository.createRide(rideData, driverId);
    }
    async searchRides(searchParams) {
        return this.repository.searchRides(searchParams);
    }
    async nearbyRideSearch(searchParams) {
        return this.repository.nearbyRideSearch(searchParams);
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
    async getCurrentRides(userId) {
        return this.repository.getCurrentRides(userId);
    }
    async getUpcomingRides(userId) {
        return this.repository.getUpcomingRides(userId);
    }
    async getPastRides(userId) {
        return this.repository.getPastRides(userId);
    }
}
exports.RideService = RideService;
//# sourceMappingURL=ride.service.js.map