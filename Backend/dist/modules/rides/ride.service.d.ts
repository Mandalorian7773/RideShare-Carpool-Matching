import { FastifyInstance } from 'fastify';
import { Ride, SeatRequest, Message, Rating, CreateRideRequest, GeoSearchRequest } from './ride.types';
export declare class RideService {
    private repository;
    constructor(fastify: FastifyInstance);
    createRide(rideData: CreateRideRequest, driverId: number): Promise<Ride>;
    searchRides(searchParams: GeoSearchRequest): Promise<Array<{
        ride: Ride;
        distance: number;
    }>>;
    requestSeat(rideId: number, riderId: number): Promise<SeatRequest>;
    approveSeat(seatRequestId: number): Promise<{
        seatRequest: SeatRequest;
        ride: Ride;
    }>;
    startRide(rideId: number, driverId: number): Promise<Ride>;
    endRide(rideId: number, driverId: number): Promise<Ride>;
    cancelRide(rideId: number, userId: number): Promise<Ride>;
    sendMessage(rideId: number, senderId: number, content: string): Promise<Message>;
    getMessages(rideId: number): Promise<Message[]>;
    addRating(rideId: number, reviewerId: number, reviewedUserId: number, rating: number, comment?: string): Promise<Rating>;
    getUserRatings(userId: number): Promise<Rating[]>;
}
//# sourceMappingURL=ride.service.d.ts.map