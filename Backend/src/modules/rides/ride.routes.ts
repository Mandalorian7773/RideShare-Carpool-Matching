import { FastifyInstance } from 'fastify';
import { RideController } from './ride.controller';

export async function rideRoutes(fastify: FastifyInstance) {
  const controller = new RideController(fastify);

  // Ride Lifecycle APIs
  fastify.post('/rides/create', controller.createRide.bind(controller));
  fastify.post('/rides/search', controller.searchRides.bind(controller));
  fastify.post('/rides/request', controller.requestSeat.bind(controller));
  fastify.post('/rides/approve', controller.approveSeat.bind(controller));
  fastify.post('/rides/start', controller.startRide.bind(controller));
  fastify.post('/rides/end', controller.endRide.bind(controller));
  fastify.post('/rides/cancel', controller.cancelRide.bind(controller));

  // Rides Listing APIs
  fastify.get('/rides/current', controller.getCurrentRides.bind(controller));
  fastify.get('/rides/upcoming', controller.getUpcomingRides.bind(controller));
  fastify.get('/rides/past', controller.getPastRides.bind(controller));

  // Chat APIs
  fastify.post('/chat/send', controller.sendMessage.bind(controller));
  fastify.get('/chat/:rideId', controller.getMessages.bind(controller));

  // Ratings APIs
  fastify.post('/ratings/add', controller.addRating.bind(controller));
  fastify.get('/ratings/:userId', controller.getUserRatings.bind(controller));
}