-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('driver', 'rider')) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rides table
CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    driver_id INTEGER REFERENCES users(id) NOT NULL,
    pickup_location GEOMETRY(POINT, 4326) NOT NULL,
    destination_location GEOMETRY(POINT, 4326) NOT NULL,
    pickup_address TEXT,
    destination_address TEXT,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    available_seats INTEGER NOT NULL,
    total_seats INTEGER NOT NULL,
    price_per_seat DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial indexes for geo-search
CREATE INDEX idx_rides_pickup_location ON rides USING GIST(pickup_location);
CREATE INDEX idx_rides_destination_location ON rides USING GIST(destination_location);

-- Seat requests table
CREATE TABLE seat_requests (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    ride_id INTEGER REFERENCES rides(id) NOT NULL,
    rider_id INTEGER REFERENCES users(id) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ride_id, rider_id)
);

-- Messages table for chat
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    ride_id INTEGER REFERENCES rides(id) NOT NULL,
    sender_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    ride_id INTEGER REFERENCES rides(id) NOT NULL,
    reviewer_id INTEGER REFERENCES users(id) NOT NULL,
    reviewed_user_id INTEGER REFERENCES users(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ride_id, reviewer_id, reviewed_user_id)
);

-- Create indexes for performance
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_seat_requests_ride_id ON seat_requests(ride_id);
CREATE INDEX idx_seat_requests_rider_id ON seat_requests(rider_id);
CREATE INDEX idx_seat_requests_status ON seat_requests(status);
CREATE INDEX idx_messages_ride_id ON messages(ride_id);
CREATE INDEX idx_ratings_ride_id ON ratings(ride_id);
CREATE INDEX idx_ratings_reviewed_user_id ON ratings(reviewed_user_id);