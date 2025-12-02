export interface NotificationPayload {
    title: string;
    body: string;
    topic?: string;
    tokens?: string[];
    data?: Record<string, any>;
}
export interface SendNotificationRequest {
    userId: number;
    title: string;
    body: string;
    data?: Record<string, any>;
}
export interface SendRideNotificationRequest {
    rideId: number;
    type: 'seat_requested' | 'seat_approved' | 'ride_started' | 'ride_cancelled';
    data?: Record<string, any>;
}
//# sourceMappingURL=notifications.types.d.ts.map