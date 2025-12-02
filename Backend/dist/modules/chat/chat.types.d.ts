export interface ChatMessage {
    id: number;
    uuid: string;
    rideId: number;
    senderId: number;
    content: string;
    createdAt: Date;
}
export interface SendMessageRequest {
    rideId: number;
    content: string;
}
export interface GetMessagesRequest {
    rideId: number;
}
//# sourceMappingURL=chat.types.d.ts.map