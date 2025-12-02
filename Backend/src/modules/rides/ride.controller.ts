import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RideService } from './ride.service';
import { 
  CreateRideRequest,
  GeoSearchRequest,
  RequestSeatRequest,
  ApproveSeatRequest,
  ChatMessageRequest,
  AddRatingRequest
} from './ride.types';

interface UserPayload {
  id: number;
  role: string;
  email: string;
}

interface FastifyRequestWithUser extends FastifyRequest {
  user?: UserPayload;
}

export class RideController {
  private service: RideService;

  constructor(fastify: FastifyInstance) {
    this.service = new RideService(fastify);
  }

  async createRide(request: FastifyRequestWithUser, reply: FastifyReply) {
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
      
      const ride = await this.service.createRide(request.body as CreateRideRequest, userId);
      return reply.status(201).send({
        success: true,
        data: ride
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to create ride'
      });
    }
  }

  async searchRides(request: FastifyRequest, reply: FastifyReply) {
    try {
      const results = await this.service.searchRides(request.body as GeoSearchRequest);
      return reply.status(200).send({
        success: true,
        data: results
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to search rides'
      });
    }
  }

  async requestSeat(request: FastifyRequestWithUser, reply: FastifyReply) {
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
      
      const seatRequest = await this.service.requestSeat((request.body as RequestSeatRequest).rideId, userId);
      return reply.status(201).send({
        success: true,
        data: seatRequest
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to request seat'
      });
    }
  }

  async approveSeat(request: FastifyRequestWithUser, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const userId = request.user.id;
      
      const result = await this.service.approveSeat((request.body as ApproveSeatRequest).seatRequestId);
      
      (request.server as any).io.to(`ride-${result.ride.id}`).emit('seat-approved', {
        rideId: result.ride.id,
        seatRequestId: result.seatRequest.id
      });
      
      console.log(`Sending push notification for approved seat request ${result.seatRequest.id}`);
      
      return reply.status(200).send({
        success: true,
        data: result
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to approve seat'
      });
    }
  }

  async startRide(request: FastifyRequestWithUser, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const userId = request.user.id;
      
      const ride = await this.service.startRide((request.body as { rideId: number }).rideId, userId);
      
      (request.server as any).io.to(`ride-${ride.id}`).emit('ride-started', {
        rideId: ride.id
      });
      
      return reply.status(200).send({
        success: true,
        data: ride
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to start ride'
      });
    }
  }

  async endRide(request: FastifyRequestWithUser, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const userId = request.user.id;
      
      const ride = await this.service.endRide((request.body as { rideId: number }).rideId, userId);
      
      (request.server as any).io.to(`ride-${ride.id}`).emit('ride-ended', {
        rideId: ride.id
      });
      
      return reply.status(200).send({
        success: true,
        data: ride
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to end ride'
      });
    }
  }

  async cancelRide(request: FastifyRequestWithUser, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const userId = request.user.id;
      
      const ride = await this.service.cancelRide((request.body as { rideId: number }).rideId, userId);
      
      (request.server as any).io.to(`ride-${ride.id}`).emit('ride-cancelled', {
        rideId: ride.id
      });
      
      console.log(`Sending push notification for cancelled ride ${ride.id}`);
      
      return reply.status(200).send({
        success: true,
        data: ride
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to cancel ride'
      });
    }
  }

  async sendMessage(request: FastifyRequestWithUser, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const userId = request.user.id;
      const body = request.body as ChatMessageRequest;
      
      const message = await this.service.sendMessage(
        body.rideId,
        userId,
        body.content
      );
      
      (request.server as any).io.to(`ride-${body.rideId}`).emit('chat-message', {
        messageId: message.id,
        rideId: message.rideId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt
      });
      
      return reply.status(201).send({
        success: true,
        data: message
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to send message'
      });
    }
  }

  async getMessages(request: FastifyRequest, reply: FastifyReply) {
    try {
      const rideId = parseInt((request.params as { rideId: string }).rideId);
      const messages = await this.service.getMessages(rideId);
      return reply.status(200).send({
        success: true,
        data: messages
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to get messages'
      });
    }
  }

  async addRating(request: FastifyRequestWithUser, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Unauthorized'
        });
      }
      
      const userId = request.user.id;
      const body = request.body as AddRatingRequest;
      
      const rating = await this.service.addRating(
        body.rideId,
        userId,
        body.reviewedUserId,
        body.rating,
        body.comment
      );
      
      return reply.status(201).send({
        success: true,
        data: rating
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to add rating'
      });
    }
  }

  async getUserRatings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = parseInt((request.params as { userId: string }).userId);
      const ratings = await this.service.getUserRatings(userId);
      return reply.status(200).send({
        success: true,
        data: ratings
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to get ratings'
      });
    }
  }
}