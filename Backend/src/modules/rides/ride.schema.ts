import { z } from 'zod';

export const createRideSchema = z.object({
  body: z.object({
    pickupLatitude: z.number().min(-90).max(90),
    pickupLongitude: z.number().min(-180).max(180),
    destinationLatitude: z.number().min(-90).max(90),
    destinationLongitude: z.number().min(-180).max(180),
    pickupAddress: z.string().optional(),
    destinationAddress: z.string().optional(),
    departureTime: z.string().datetime(),
    totalSeats: z.number().int().min(1).max(10),
    pricePerSeat: z.number().min(0)
  })
});

export const searchRidesSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().min(1).max(100),
    timeWindow: z.number().min(0).max(1440)
  })
});

export const requestSeatSchema = z.object({
  body: z.object({
    rideId: z.number().int().positive()
  })
});

export const approveSeatSchema = z.object({
  body: z.object({
    seatRequestId: z.number().int().positive()
  })
});

export const startRideSchema = z.object({
  body: z.object({
    rideId: z.number().int().positive()
  })
});

export const endRideSchema = z.object({
  body: z.object({
    rideId: z.number().int().positive()
  })
});

export const cancelRideSchema = z.object({
  body: z.object({
    rideId: z.number().int().positive()
  })
});

export const sendChatMessageSchema = z.object({
  body: z.object({
    rideId: z.number().int().positive(),
    content: z.string().min(1).max(1000)
  })
});

export const getChatMessagesSchema = z.object({
  params: z.object({
    rideId: z.string()
  })
});

export const addRatingSchema = z.object({
  body: z.object({
    rideId: z.number().int().positive(),
    reviewedUserId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional()
  })
});

export const getUserRatingsSchema = z.object({
  params: z.object({
    userId: z.string()
  })
});