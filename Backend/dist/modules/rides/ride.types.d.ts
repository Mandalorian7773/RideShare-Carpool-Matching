export interface User {
    id: number;
    uuid: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    role: 'driver' | 'rider';
    rating: number;
    ratingCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Ride {
    id: number;
    uuid: string;
    driverId: number;
    pickupLocation: {
        latitude: number;
        longitude: number;
    };
    destinationLocation: {
        latitude: number;
        longitude: number;
    };
    pickupAddress?: string;
    destinationAddress?: string;
    departureTime: Date;
    availableSeats: number;
    totalSeats: number;
    pricePerSeat: number;
    status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
export interface SeatRequest {
    id: number;
    uuid: string;
    rideId: number;
    riderId: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
export interface Message {
    id: number;
    uuid: string;
    rideId: number;
    senderId: number;
    content: string;
    createdAt: Date;
}
export interface Rating {
    id: number;
    uuid: string;
    rideId: number;
    reviewerId: number;
    reviewedUserId: number;
    rating: number;
    comment?: string;
    createdAt: Date;
}
export interface GeoSearchRequest {
    latitude: number;
    longitude: number;
    radius: number;
    timeWindow: number;
}
export interface GeoSearchResponse {
    rides: Array<{
        ride: Ride;
        distance: number;
    }>;
}
export interface CreateRideRequest {
    pickupLatitude: number;
    pickupLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
    pickupAddress?: string;
    destinationAddress?: string;
    departureTime: Date;
    totalSeats: number;
    pricePerSeat: number;
}
export interface RequestSeatRequest {
    rideId: number;
}
export interface ApproveSeatRequest {
    seatRequestId: number;
}
export interface ChatMessageRequest {
    rideId: number;
    content: string;
}
export interface AddRatingRequest {
    rideId: number;
    reviewedUserId: number;
    rating: number;
    comment?: string;
}
//# sourceMappingURL=ride.types.d.ts.map