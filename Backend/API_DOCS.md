# Rideshare Lite+ API Documentation

## Authentication
All APIs require JWT authentication in the Authorization header:
```
Authorization: Bearer <token>
```

## Ride Lifecycle APIs

### POST /api/rides/create
Create a new ride (Driver only)

**Request:**
```json
{
  "pickupLatitude": 40.7128,
  "pickupLongitude": -74.0060,
  "pickupAddress": "New York City, NY",
  "destinationLatitude": 41.8781,
  "destinationLongitude": -87.6298,
  "destinationAddress": "Chicago, IL",
  "departureTime": "2023-12-01T10:00:00Z",
  "totalSeats": 4,
  "pricePerSeat": 25.50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "driverId": 1,
    "pickupLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "destinationLocation": {
      "latitude": 41.8781,
      "longitude": -87.6298
    },
    "pickupAddress": "New York City, NY",
    "destinationAddress": "Chicago, IL",
    "departureTime": "2023-12-01T10:00:00.000Z",
    "availableSeats": 4,
    "totalSeats": 4,
    "pricePerSeat": 25.50,
    "status": "open",
    "createdAt": "2023-11-01T10:00:00.000Z",
    "updatedAt": "2023-11-01T10:00:00.000Z"
  }
}
```

### POST /api/rides/search
Search for rides near a location

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 10,
  "timeWindow": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ride": {
        "id": 1,
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "driverId": 1,
        "pickupLocation": {
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "destinationLocation": {
          "latitude": 41.8781,
          "longitude": -87.6298
        },
        "pickupAddress": "New York City, NY",
        "destinationAddress": "Chicago, IL",
        "departureTime": "2023-12-01T10:00:00.000Z",
        "availableSeats": 4,
        "totalSeats": 4,
        "pricePerSeat": 25.50,
        "status": "open",
        "createdAt": "2023-11-01T10:00:00.000Z",
        "updatedAt": "2023-11-01T10:00:00.000Z"
      },
      "distance": 0.5
    }
  ]
}
```

### POST /api/rides/request
Request a seat on a ride (Rider only)

**Request:**
```json
{
  "rideId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
    "rideId": 1,
    "riderId": 2,
    "status": "pending",
    "createdAt": "2023-11-01T11:00:00.000Z",
    "updatedAt": "2023-11-01T11:00:00.000Z"
  }
}
```

### POST /api/rides/approve
Approve a seat request (Driver only)

**Request:**
```json
{
  "seatRequestId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "seatRequest": {
      "id": 1,
      "uuid": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "rideId": 1,
      "riderId": 2,
      "status": "approved",
      "createdAt": "2023-11-01T11:00:00.000Z",
      "updatedAt": "2023-11-01T12:00:00.000Z"
    },
    "ride": {
      "id": 1,
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "driverId": 1,
      "pickupLocation": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "destinationLocation": {
        "latitude": 41.8781,
        "longitude": -87.6298
      },
      "pickupAddress": "New York City, NY",
      "destinationAddress": "Chicago, IL",
      "departureTime": "2023-12-01T10:00:00.000Z",
      "availableSeats": 3,
      "totalSeats": 4,
      "pricePerSeat": 25.50,
      "status": "open",
      "createdAt": "2023-11-01T10:00:00.000Z",
      "updatedAt": "2023-11-01T12:00:00.000Z"
    }
  }
}
```

### POST /api/rides/start
Start a ride (Driver only)

**Request:**
```json
{
  "rideId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "driverId": 1,
    "pickupLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "destinationLocation": {
      "latitude": 41.8781,
      "longitude": -87.6298
    },
    "pickupAddress": "New York City, NY",
    "destinationAddress": "Chicago, IL",
    "departureTime": "2023-12-01T10:00:00.000Z",
    "availableSeats": 3,
    "totalSeats": 4,
    "pricePerSeat": 25.50,
    "status": "in_progress",
    "createdAt": "2023-11-01T10:00:00.000Z",
    "updatedAt": "2023-11-01T13:00:00.000Z"
  }
}
```

### POST /api/rides/end
End a ride (Driver only)

**Request:**
```json
{
  "rideId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "driverId": 1,
    "pickupLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "destinationLocation": {
      "latitude": 41.8781,
      "longitude": -87.6298
    },
    "pickupAddress": "New York City, NY",
    "destinationAddress": "Chicago, IL",
    "departureTime": "2023-12-01T10:00:00.000Z",
    "availableSeats": 3,
    "totalSeats": 4,
    "pricePerSeat": 25.50,
    "status": "completed",
    "createdAt": "2023-11-01T10:00:00.000Z",
    "updatedAt": "2023-11-01T14:00:00.000Z"
  }
}
```

### POST /api/rides/cancel
Cancel a ride (Driver or approved rider)

**Request:**
```json
{
  "rideId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "driverId": 1,
    "pickupLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "destinationLocation": {
      "latitude": 41.8781,
      "longitude": -87.6298
    },
    "pickupAddress": "New York City, NY",
    "destinationAddress": "Chicago, IL",
    "departureTime": "2023-12-01T10:00:00.000Z",
    "availableSeats": 3,
    "totalSeats": 4,
    "pricePerSeat": 25.50,
    "status": "cancelled",
    "createdAt": "2023-11-01T10:00:00.000Z",
    "updatedAt": "2023-11-01T15:00:00.000Z"
  }
}
```

## Rides Listing APIs

### GET /api/rides/current
Get current rides (in progress)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "driverId": 1,
      "pickupLocation": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "destinationLocation": {
        "latitude": 41.8781,
        "longitude": -87.6298
      },
      "pickupAddress": "New York City, NY",
      "destinationAddress": "Chicago, IL",
      "departureTime": "2023-12-01T10:00:00.000Z",
      "availableSeats": 3,
      "totalSeats": 4,
      "pricePerSeat": 25.50,
      "status": "in_progress",
      "createdAt": "2023-11-01T10:00:00.000Z",
      "updatedAt": "2023-11-01T13:00:00.000Z"
    }
  ]
}
```

### GET /api/rides/upcoming
Get upcoming rides

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "uuid": "c3d4e5f6-g7h8-9012-cdef-gh3456789012",
      "driverId": 1,
      "pickupLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "destinationLocation": {
        "latitude": 36.1699,
        "longitude": -115.1398
      },
      "pickupAddress": "Los Angeles, CA",
      "destinationAddress": "Las Vegas, NV",
      "departureTime": "2023-12-10T09:00:00.000Z",
      "availableSeats": 4,
      "totalSeats": 4,
      "pricePerSeat": 30.00,
      "status": "open",
      "createdAt": "2023-11-05T10:00:00.000Z",
      "updatedAt": "2023-11-05T10:00:00.000Z"
    }
  ]
}
```

### GET /api/rides/past
Get past rides

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "uuid": "d4e5f6g7-h8i9-0123-defg-hi4567890123",
      "driverId": 2,
      "pickupLocation": {
        "latitude": 47.6062,
        "longitude": -122.3321
      },
      "destinationLocation": {
        "latitude": 45.5152,
        "longitude": -122.6784
      },
      "pickupAddress": "Seattle, WA",
      "destinationAddress": "Portland, OR",
      "departureTime": "2023-10-15T08:00:00.000Z",
      "availableSeats": 2,
      "totalSeats": 4,
      "pricePerSeat": 20.00,
      "status": "completed",
      "createdAt": "2023-10-01T10:00:00.000Z",
      "updatedAt": "2023-10-15T12:00:00.000Z"
    }
  ]
}
```

## Chat APIs

### POST /api/chat/send
Send a chat message

**Request:**
```json
{
  "rideId": 1,
  "content": "Are we meeting at the usual spot?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "e5f6g7h8-i9j0-1234-efgh-ij5678901234",
    "rideId": 1,
    "senderId": 2,
    "content": "Are we meeting at the usual spot?",
    "createdAt": "2023-11-01T13:30:00.000Z"
  }
}
```

### GET /api/chat/{rideId}
Get chat messages for a ride

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uuid": "e5f6g7h8-i9j0-1234-efgh-ij5678901234",
      "rideId": 1,
      "senderId": 2,
      "content": "Are we meeting at the usual spot?",
      "createdAt": "2023-11-01T13:30:00.000Z"
    },
    {
      "id": 2,
      "uuid": "f6g7h8i9-j0k1-2345-fghi-jk6789012345",
      "rideId": 1,
      "senderId": 1,
      "content": "Yes, at the Starbucks on 5th Avenue.",
      "createdAt": "2023-11-01T13:32:00.000Z"
    }
  ]
}
```

## Ratings APIs

### POST /api/ratings/add
Add a rating (after ride ends)

**Request:**
```json
{
  "rideId": 1,
  "reviewedUserId": 1,
  "rating": 5,
  "comment": "Great driver, very punctual!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "uuid": "g7h8i9j0-k1l2-3456-ghij-kl7890123456",
    "rideId": 1,
    "reviewerId": 2,
    "reviewedUserId": 1,
    "rating": 5,
    "comment": "Great driver, very punctual!",
    "createdAt": "2023-11-01T15:30:00.000Z"
  }
}
```

### GET /api/ratings/{userId}
Get ratings for a user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uuid": "g7h8i9j0-k1l2-3456-ghij-kl7890123456",
      "rideId": 1,
      "reviewerId": 2,
      "reviewedUserId": 1,
      "rating": 5,
      "comment": "Great driver, very punctual!",
      "createdAt": "2023-11-01T15:30:00.000Z"
    }
  ]
}
```