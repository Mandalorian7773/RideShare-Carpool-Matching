-- Simplified schema without PostGIS for testing

-- Rides table (simplified without geometry)
CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    driver_id INTEGER REFERENCES users(id) NOT NULL,
    pickup_latitude DECIMAL(10, 8) NOT NULL,
    pickup_longitude DECIMAL(11, 8) NOT NULL,
    destination_latitude DECIMAL(10, 8) NOT NULL,
    destination_longitude DECIMAL(11, 8) NOT NULL,
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

-- Seat requests table
CREATE TABLE IF NOT EXISTS seat_requests (
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
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    ride_id INTEGER REFERENCES rides(id) NOT NULL,
    sender_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
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

-- Add password column to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_seat_requests_ride_id ON seat_requests(ride_id);
CREATE INDEX IF NOT EXISTS idx_seat_requests_rider_id ON seat_requests(rider_id);
CREATE INDEX IF NOT EXISTS idx_seat_requests_status ON seat_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_ride_id ON messages(ride_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ride_id ON ratings(ride_id);
CREATE INDEX IF NOT EXISTS idx_ratings_reviewed_user_id ON ratings(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password);