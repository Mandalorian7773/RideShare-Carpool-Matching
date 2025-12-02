"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRatingsSchema = exports.addRatingSchema = exports.getChatMessagesSchema = exports.sendChatMessageSchema = exports.cancelRideSchema = exports.endRideSchema = exports.startRideSchema = exports.approveSeatSchema = exports.requestSeatSchema = exports.searchRidesSchema = exports.createRideSchema = void 0;
const zod_1 = require("zod");
exports.createRideSchema = zod_1.z.object({
    body: zod_1.z.object({
        pickupLatitude: zod_1.z.number().min(-90).max(90),
        pickupLongitude: zod_1.z.number().min(-180).max(180),
        destinationLatitude: zod_1.z.number().min(-90).max(90),
        destinationLongitude: zod_1.z.number().min(-180).max(180),
        pickupAddress: zod_1.z.string().optional(),
        destinationAddress: zod_1.z.string().optional(),
        departureTime: zod_1.z.string().datetime(),
        totalSeats: zod_1.z.number().int().min(1).max(10),
        pricePerSeat: zod_1.z.number().min(0)
    })
});
exports.searchRidesSchema = zod_1.z.object({
    body: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        radius: zod_1.z.number().min(1).max(100),
        timeWindow: zod_1.z.number().min(0).max(1440)
    })
});
exports.requestSeatSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.number().int().positive()
    })
});
exports.approveSeatSchema = zod_1.z.object({
    body: zod_1.z.object({
        seatRequestId: zod_1.z.number().int().positive()
    })
});
exports.startRideSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.number().int().positive()
    })
});
exports.endRideSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.number().int().positive()
    })
});
exports.cancelRideSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.number().int().positive()
    })
});
exports.sendChatMessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.number().int().positive(),
        content: zod_1.z.string().min(1).max(1000)
    })
});
exports.getChatMessagesSchema = zod_1.z.object({
    params: zod_1.z.object({
        rideId: zod_1.z.string()
    })
});
exports.addRatingSchema = zod_1.z.object({
    body: zod_1.z.object({
        rideId: zod_1.z.number().int().positive(),
        reviewedUserId: zod_1.z.number().int().positive(),
        rating: zod_1.z.number().int().min(1).max(5),
        comment: zod_1.z.string().optional()
    })
});
exports.getUserRatingsSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string()
    })
});
//# sourceMappingURL=ride.schema.js.map