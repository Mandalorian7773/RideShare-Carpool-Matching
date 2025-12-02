# Rideshare Lite+ API Documentation

## Base URL
```
http://localhost:3000/api
```

## Ride Endpoints

### Create Ride
**POST** `/rides/create`
Create a new ride as a driver.

**Request Body:**
```json
{
  "pickupLatitude": 12.9716,
  "pickupLongitude": 77.5946,
  "destinationLatitude": 12.9716,
  "destinationLongitude": 77.5946,
  "pickupAddress": "Pickup location address",
  "destinationAddress": "Destination address",
  "departureTime": "2023-12-31T10:00:00Z",
  "totalSeats": 4,
  "pricePerSeat": 100.00
}
```

### Search Rides
**POST** `/rides/search`
Search for nearby rides as a rider.

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "radius": 5, // in kilometers
  "timeWindow": 60 // in minutes
}
```

### Request Seat
**POST** `/rides/request`
Request a seat on a ride as a rider.

**Request Body:**
```json
{
  "rideId": 1
}
```

### Approve Seat
**POST** `/rides/approve`
Approve a seat request as a driver.

**Request Body:**
```json
{
  "seatRequestId": 1
}
```

### Start Ride
**POST** `/rides/start`
Start a ride as a driver.

**Request Body:**
```json
{
  "rideId": 1
}
```

### End Ride
**POST** `/rides/end`
End a ride as a driver.

**Request Body:**
```json
{
  "rideId": 1
}
```

### Cancel Ride
**POST** `/rides/cancel`
Cancel a ride as a driver or approved rider.

**Request Body:**
```json
{
  "rideId": 1
}
```

## Chat Endpoints

### Send Message
**POST** `/chat/send`
Send a chat message for a ride.

**Request Body:**
```json
{
  "rideId": 1,
  "content": "Hello everyone!"
}
```

### Get Messages
**GET** `/chat/:rideId`
Get all chat messages for a ride.

## Ratings Endpoints

### Add Rating
**POST** `/ratings/add`
Add a rating for a user after a ride.

**Request Body:**
```json
{
  "rideId": 1,
  "reviewedUserId": 2,
  "rating": 5,
  "comment": "Great experience!"
}
```

### Get User Ratings
**GET** `/ratings/:userId`
Get all ratings for a user.

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```