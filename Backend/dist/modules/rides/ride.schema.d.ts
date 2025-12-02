import { z } from 'zod';
export declare const createRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        pickupLatitude: z.ZodNumber;
        pickupLongitude: z.ZodNumber;
        destinationLatitude: z.ZodNumber;
        destinationLongitude: z.ZodNumber;
        pickupAddress: z.ZodOptional<z.ZodString>;
        destinationAddress: z.ZodOptional<z.ZodString>;
        departureTime: z.ZodString;
        totalSeats: z.ZodNumber;
        pricePerSeat: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const searchRidesSchema: z.ZodObject<{
    body: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        radius: z.ZodNumber;
        timeWindow: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const requestSeatSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const approveSeatSchema: z.ZodObject<{
    body: z.ZodObject<{
        seatRequestId: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const startRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const endRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const cancelRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const sendChatMessageSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getChatMessagesSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const addRatingSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
        reviewedUserId: z.ZodNumber;
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getUserRatingsSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=ride.schema.d.ts.map