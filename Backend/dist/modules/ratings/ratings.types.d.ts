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
export interface AddRatingRequest {
    rideId: number;
    reviewedUserId: number;
    rating: number;
    comment?: string;
}
export interface GetUserRatingsRequest {
    userId: number;
}
//# sourceMappingURL=ratings.types.d.ts.map