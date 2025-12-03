import { FastifyInstance } from 'fastify';
import { Ride, SeatRequest, Message, Rating, CreateRideRequest, GeoSearchRequest, User } from './ride.types';
export declare class RideRepository {
    private db;
    constructor(db: FastifyInstance['db']);
    createUser(email: string, role: 'driver' | 'rider'): Promise<User>;
    getUserById(id: number): Promise<User | null>;
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
    getCurrentRides(userId: number): Promise<Ride[]>;
    getUpcomingRides(userId: number): Promise<Ride[]>;
    getPastRides(userId: number): Promise<Ride[]>;
}
//# sourceMappingURL=ride.repository.d.ts.map