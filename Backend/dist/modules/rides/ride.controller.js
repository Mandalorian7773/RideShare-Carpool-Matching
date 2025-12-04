"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideController = void 0;
const ride_service_1 = require("./ride.service");
class RideController {
    constructor(fastify) {
        this.service = new ride_service_1.RideService(fastify);
    }
    async createRide(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const userRole = request.user.role;
            if (userRole !== 'driver') {
                return reply.status(403).send({
                    success: false,
                    error: 'Only drivers can create rides'
                });
            }
            const ride = await this.service.createRide(request.body, userId);
            return reply.status(201).send({
                success: true,
                data: ride
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to create ride'
            });
        }
    }
    async searchRides(request, reply) {
        try {
            const results = await this.service.searchRides(request.body);
            return reply.status(200).send({
                success: true,
                data: results
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to search rides'
            });
        }
    }
    async nearbyRideSearch(request, reply) {
        try {
            const searchParams = request.body;
            const results = await this.service.nearbyRideSearch(searchParams);
            return reply.status(200).send({
                success: true,
                data: results
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to search nearby rides'
            });
        }
    }
    async requestSeat(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const userRole = request.user.role;
            if (userRole !== 'rider') {
                return reply.status(403).send({
                    success: false,
                    error: 'Only riders can request seats'
                });
            }
            const seatRequest = await this.service.requestSeat(request.body.rideId, userId);
            return reply.status(201).send({
                success: true,
                data: seatRequest
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to request seat'
            });
        }
    }
    async approveSeat(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const result = await this.service.approveSeat(request.body.seatRequestId);
            return reply.status(200).send({
                success: true,
                data: result
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to approve seat'
            });
        }
    }
    async startRide(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const ride = await this.service.startRide(request.body.rideId, userId);
            return reply.status(200).send({
                success: true,
                data: ride
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to start ride'
            });
        }
    }
    async endRide(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const ride = await this.service.endRide(request.body.rideId, userId);
            return reply.status(200).send({
                success: true,
                data: ride
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to end ride'
            });
        }
    }
    async cancelRide(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const ride = await this.service.cancelRide(request.body.rideId, userId);
            return reply.status(200).send({
                success: true,
                data: ride
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to cancel ride'
            });
        }
    }
    async sendMessage(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const body = request.body;
            const message = await this.service.sendMessage(body.rideId, userId, body.content);
            return reply.status(201).send({
                success: true,
                data: message
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to send message'
            });
        }
    }
    async getMessages(request, reply) {
        try {
            const rideId = parseInt(request.params.rideId);
            const messages = await this.service.getMessages(rideId);
            return reply.status(200).send({
                success: true,
                data: messages
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to get messages'
            });
        }
    }
    async addRating(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const body = request.body;
            const rating = await this.service.addRating(body.rideId, userId, body.reviewedUserId, body.rating, body.comment);
            return reply.status(201).send({
                success: true,
                data: rating
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to add rating'
            });
        }
    }
    async getUserRatings(request, reply) {
        try {
            const userId = parseInt(request.params.userId);
            const ratings = await this.service.getUserRatings(userId);
            return reply.status(200).send({
                success: true,
                data: ratings
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to get ratings'
            });
        }
    }
    async getCurrentRides(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const rides = await this.service.getCurrentRides(userId);
            return reply.status(200).send({
                success: true,
                data: rides
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to get current rides'
            });
        }
    }
    async getUpcomingRides(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const rides = await this.service.getUpcomingRides(userId);
            return reply.status(200).send({
                success: true,
                data: rides
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to get upcoming rides'
            });
        }
    }
    async getPastRides(request, reply) {
        try {
            if (!request.user) {
                return reply.status(401).send({
                    success: false,
                    error: 'Unauthorized'
                });
            }
            const userId = request.user.id;
            const rides = await this.service.getPastRides(userId);
            return reply.status(200).send({
                success: true,
                data: rides
            });
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: error.message || 'Failed to get past rides'
            });
        }
    }
}
exports.RideController = RideController;
//# sourceMappingURL=ride.controller.js.map