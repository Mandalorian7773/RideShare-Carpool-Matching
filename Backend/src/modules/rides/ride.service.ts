import { FastifyInstance } from 'fastify';
import { RideRepository } from './ride.repository';
import { 
  Ride, 
  SeatRequest, 
  Message, 
  Rating, 
  CreateRideRequest, 
  GeoSearchRequest,
  User
} from './ride.types';

export class RideService {
  private repository: RideRepository;

  constructor(fastify: FastifyInstance) {
    this.repository = new RideRepository(fastify.db);
  }

  async createRide(rideData: CreateRideRequest, driverId: number): Promise<Ride> {
    return this.repository.createRide(rideData, driverId);
  }

  async searchRides(searchParams: GeoSearchRequest): Promise<Array<{ride: Ride, distance: number}>> {
    return this.repository.searchRides(searchParams);
  }

  async requestSeat(rideId: number, riderId: number): Promise<SeatRequest> {
    return this.repository.requestSeat(rideId, riderId);
  }

  async approveSeat(seatRequestId: number): Promise<{seatRequest: SeatRequest, ride: Ride}> {
    return this.repository.approveSeat(seatRequestId);
  }

  async startRide(rideId: number, driverId: number): Promise<Ride> {
    return this.repository.startRide(rideId, driverId);
  }

  async endRide(rideId: number, driverId: number): Promise<Ride> {
    return this.repository.endRide(rideId, driverId);
  }

  async cancelRide(rideId: number, userId: number): Promise<Ride> {
    return this.repository.cancelRide(rideId, userId);
  }

  async sendMessage(rideId: number, senderId: number, content: string): Promise<Message> {
    return this.repository.sendMessage(rideId, senderId, content);
  }

  async getMessages(rideId: number): Promise<Message[]> {
    return this.repository.getMessages(rideId);
  }

  async addRating(rideId: number, reviewerId: number, reviewedUserId: number, rating: number, comment?: string): Promise<Rating> {
    return this.repository.addRating(rideId, reviewerId, reviewedUserId, rating, comment);
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return this.repository.getUserRatings(userId);
  }

  async getCurrentRides(userId: number): Promise<Ride[]> {
    return this.repository.getCurrentRides(userId);
  }

  async getUpcomingRides(userId: number): Promise<Ride[]> {
    return this.repository.getUpcomingRides(userId);
  }

  async getPastRides(userId: number): Promise<Ride[]> {
    return this.repository.getPastRides(userId);
  }
}