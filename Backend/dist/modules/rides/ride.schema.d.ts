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
    }, "strip", z.ZodTypeAny, {
        totalSeats: number;
        pricePerSeat: number;
        departureTime: string;
        pickupLatitude: number;
        pickupLongitude: number;
        destinationLatitude: number;
        destinationLongitude: number;
        pickupAddress?: string | undefined;
        destinationAddress?: string | undefined;
    }, {
        totalSeats: number;
        pricePerSeat: number;
        departureTime: string;
        pickupLatitude: number;
        pickupLongitude: number;
        destinationLatitude: number;
        destinationLongitude: number;
        pickupAddress?: string | undefined;
        destinationAddress?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        totalSeats: number;
        pricePerSeat: number;
        departureTime: string;
        pickupLatitude: number;
        pickupLongitude: number;
        destinationLatitude: number;
        destinationLongitude: number;
        pickupAddress?: string | undefined;
        destinationAddress?: string | undefined;
    };
}, {
    body: {
        totalSeats: number;
        pricePerSeat: number;
        departureTime: string;
        pickupLatitude: number;
        pickupLongitude: number;
        destinationLatitude: number;
        destinationLongitude: number;
        pickupAddress?: string | undefined;
        destinationAddress?: string | undefined;
    };
}>;
export declare const searchRidesSchema: z.ZodObject<{
    body: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        radius: z.ZodNumber;
        timeWindow: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
        radius: number;
        timeWindow: number;
    }, {
        latitude: number;
        longitude: number;
        radius: number;
        timeWindow: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        latitude: number;
        longitude: number;
        radius: number;
        timeWindow: number;
    };
}, {
    body: {
        latitude: number;
        longitude: number;
        radius: number;
        timeWindow: number;
    };
}>;
export declare const requestSeatSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rideId: number;
    }, {
        rideId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rideId: number;
    };
}, {
    body: {
        rideId: number;
    };
}>;
export declare const approveSeatSchema: z.ZodObject<{
    body: z.ZodObject<{
        seatRequestId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        seatRequestId: number;
    }, {
        seatRequestId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        seatRequestId: number;
    };
}, {
    body: {
        seatRequestId: number;
    };
}>;
export declare const startRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rideId: number;
    }, {
        rideId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rideId: number;
    };
}, {
    body: {
        rideId: number;
    };
}>;
export declare const endRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rideId: number;
    }, {
        rideId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rideId: number;
    };
}, {
    body: {
        rideId: number;
    };
}>;
export declare const cancelRideSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rideId: number;
    }, {
        rideId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rideId: number;
    };
}, {
    body: {
        rideId: number;
    };
}>;
export declare const sendChatMessageSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        rideId: number;
        content: string;
    }, {
        rideId: number;
        content: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rideId: number;
        content: string;
    };
}, {
    body: {
        rideId: number;
        content: string;
    };
}>;
export declare const getChatMessagesSchema: z.ZodObject<{
    params: z.ZodObject<{
        rideId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        rideId: string;
    }, {
        rideId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        rideId: string;
    };
}, {
    params: {
        rideId: string;
    };
}>;
export declare const addRatingSchema: z.ZodObject<{
    body: z.ZodObject<{
        rideId: z.ZodNumber;
        reviewedUserId: z.ZodNumber;
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        rideId: number;
        reviewedUserId: number;
        rating: number;
        comment?: string | undefined;
    }, {
        rideId: number;
        reviewedUserId: number;
        rating: number;
        comment?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        rideId: number;
        reviewedUserId: number;
        rating: number;
        comment?: string | undefined;
    };
}, {
    body: {
        rideId: number;
        reviewedUserId: number;
        rating: number;
        comment?: string | undefined;
    };
}>;
export declare const getUserRatingsSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
    }, {
        userId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        userId: string;
    };
}, {
    params: {
        userId: string;
    };
}>;
//# sourceMappingURL=ride.schema.d.ts.map