import { FastifyInstance } from 'fastify';
import { RideController } from './ride.controller';

export async function rideRoutes(fastify: FastifyInstance) {
  const controller = new RideController(fastify);
  
  // Ride Lifecycle APIs
  fastify.post('/rides/create', { preHandler: fastify.authenticate }, controller.createRide.bind(controller));
  fastify.post('/rides/search', controller.searchRides.bind(controller));
  fastify.post('/rides/nearby', controller.nearbyRideSearch.bind(controller));
  fastify.post('/rides/request', { preHandler: fastify.authenticate }, controller.requestSeat.bind(controller));
  fastify.post('/rides/approve', { preHandler: fastify.authenticate }, controller.approveSeat.bind(controller));
  fastify.post('/rides/start', { preHandler: fastify.authenticate }, controller.startRide.bind(controller));
  fastify.post('/rides/end', { preHandler: fastify.authenticate }, controller.endRide.bind(controller));
  fastify.post('/rides/cancel', { preHandler: fastify.authenticate }, controller.cancelRide.bind(controller));

  // Rides Listing APIs
  fastify.get('/rides/current', { preHandler: fastify.authenticate }, controller.getCurrentRides.bind(controller));
  fastify.get('/rides/upcoming', { preHandler: fastify.authenticate }, controller.getUpcomingRides.bind(controller));
  fastify.get('/rides/past', { preHandler: fastify.authenticate }, controller.getPastRides.bind(controller));

  // Chat APIs
  fastify.post('/chat/send', { preHandler: fastify.authenticate }, controller.sendMessage.bind(controller));
  fastify.get('/chat/:rideId', controller.getMessages.bind(controller));

  // Ratings APIs
  fastify.post('/ratings/add', { preHandler: fastify.authenticate }, controller.addRating.bind(controller));
  fastify.get('/ratings/:userId', controller.getUserRatings.bind(controller));
}