import { FastifyInstance } from 'fastify';
import { PoolClient } from 'pg';
import { 
  Ride, 
  SeatRequest, 
  Message, 
  Rating, 
  CreateRideRequest, 
  GeoSearchRequest,
  User,
  NearbyRideSearchRequest
} from './ride.types';

export class RideRepository {
  constructor(private db: FastifyInstance['db']) {}

  async createUser(email: string, role: 'driver' | 'rider'): Promise<User> {
    const query = `
      INSERT INTO users (email, role)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await this.db.query(query, [email, role]);
    return result.rows[0];
  }

  async getUserById(id: number): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async nearbyRideSearch(searchParams: NearbyRideSearchRequest): Promise<any[]> {
    const query = `
      SELECT
        id,
        driver_id,
        ride_time,
        total_seats,
        available_seats,
        status,
        ST_Distance(
          pickup_location,
          ST_MakePoint($1, $2)::geography
        ) AS distance_meters
      FROM rides
      WHERE
        status = 'open'
        AND available_seats > 0
        AND ride_time > NOW()
        AND ST_DWithin(
          pickup_location,
          ST_MakePoint($1, $2)::geography,
          $3
        )
      ORDER BY distance_meters
      LIMIT 20;
    `;
    
    const values = [
      searchParams.lng,
      searchParams.lat,
      searchParams.radius
    ];
    
    const result = await this.db.query(query, values);
    return result.rows;
  }

  async createRide(rideData: CreateRideRequest, driverId: number): Promise<Ride> {
    const query = `
      INSERT INTO rides (
        driver_id,
        pickup_location,
        destination_location,
        pickup_address,
        destination_address,
        departure_time,
        available_seats,
        total_seats,
        price_per_seat
      )
      VALUES (
        $1,
        ST_SetSRID(ST_MakePoint($2, $3), 4326),
        ST_SetSRID(ST_MakePoint($4, $5), 4326),
        $6,
        $7,
        $8,
        $9,
        $9,
        $10
      )
      RETURNING 
        id, uuid, driver_id, 
        ST_Y(pickup_location) as pickup_latitude,
        ST_X(pickup_location) as pickup_longitude,
        ST_Y(destination_location) as destination_latitude,
        ST_X(destination_location) as destination_longitude,
        pickup_address, destination_address,
        departure_time, available_seats, total_seats, price_per_seat,
        status, created_at, updated_at
    `;
    
    const values = [
      driverId,
      rideData.pickupLongitude,
      rideData.pickupLatitude,
      rideData.destinationLongitude,
      rideData.destinationLatitude,
      rideData.pickupAddress,
      rideData.destinationAddress,
      rideData.departureTime,
      rideData.totalSeats,
      rideData.pricePerSeat
    ];
    
    const result = await this.db.query(query, values);
    const row = result.rows[0];
    
    return {
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async searchRides(searchParams: GeoSearchRequest): Promise<Array<{ride: Ride, distance: number}>> {
    const query = `
      SELECT 
        r.id, r.uuid, r.driver_id,
        ST_Y(r.pickup_location) as pickup_latitude,
        ST_X(r.pickup_location) as pickup_longitude,
        ST_Y(r.destination_location) as destination_latitude,
        ST_X(r.destination_location) as destination_longitude,
        r.pickup_address, r.destination_address,
        r.departure_time, r.available_seats, r.total_seats, r.price_per_seat,
        r.status, r.created_at, r.updated_at,
        ST_Distance(
          r.pickup_location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 as distance_meters
      FROM rides r
      WHERE 
        r.status = 'open'
        AND r.available_seats > 0
        AND r.departure_time >= NOW()
        AND r.departure_time <= NOW() + INTERVAL '${searchParams.timeWindow} minutes'
        AND ST_DWithin(
          r.pickup_location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3 * 1000
        )
      ORDER BY distance_meters ASC
      LIMIT 20
    `;
    
    const values = [
      searchParams.longitude,
      searchParams.latitude,
      searchParams.radius
    ];
    
    const result = await this.db.query(query, values);
    
    return result.rows.map(row => ({
      ride: {
        id: row.id,
        uuid: row.uuid,
        driverId: row.driver_id,
        pickupLocation: {
          latitude: parseFloat(row.pickup_latitude),
          longitude: parseFloat(row.pickup_longitude)
        },
        destinationLocation: {
          latitude: parseFloat(row.destination_latitude),
          longitude: parseFloat(row.destination_longitude)
        },
        pickupAddress: row.pickup_address,
        destinationAddress: row.destination_address,
        departureTime: new Date(row.departure_time),
        availableSeats: row.available_seats,
        totalSeats: row.total_seats,
        pricePerSeat: row.price_per_seat,
        status: row.status,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      },
      distance: parseFloat(row.distance_meters)
    }));
  }

  async requestSeat(rideId: number, riderId: number): Promise<SeatRequest> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Lock the ride row to prevent race conditions
      const rideQuery = `
        SELECT available_seats FROM rides 
        WHERE id = $1 
        FOR UPDATE
      `;
      const rideResult = await client.query(rideQuery, [rideId]);
      
      if (rideResult.rows.length === 0) {
        throw new Error('Ride not found');
      }
      
      if (rideResult.rows[0].available_seats <= 0) {
        throw new Error('No available seats');
      }
      
      // Insert seat request
      const insertQuery = `
        INSERT INTO seat_requests (ride_id, rider_id)
        VALUES ($1, $2)
        ON CONFLICT (ride_id, rider_id) 
        DO UPDATE SET status = 'pending', updated_at = NOW()
        RETURNING *
      `;
      
      const insertResult = await client.query(insertQuery, [rideId, riderId]);
      
      await client.query('COMMIT');
      
      const row = insertResult.rows[0];
      return {
        id: row.id,
        uuid: row.uuid,
        rideId: row.ride_id,
        riderId: row.rider_id,
        status: row.status,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async approveSeat(seatRequestId: number): Promise<{seatRequest: SeatRequest, ride: Ride}> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Get and lock the seat request
      const seatRequestQuery = `
        SELECT * FROM seat_requests 
        WHERE id = $1 
        FOR UPDATE
      `;
      const seatRequestResult = await client.query(seatRequestQuery, [seatRequestId]);
      
      if (seatRequestResult.rows.length === 0) {
        throw new Error('Seat request not found');
      }
      
      const seatRequestRow = seatRequestResult.rows[0];
      
      if (seatRequestRow.status !== 'pending') {
        throw new Error('Seat request is not pending');
      }
      
      // Get and lock the ride
      const rideQuery = `
        SELECT * FROM rides 
        WHERE id = $1 
        FOR UPDATE
      `;
      const rideResult = await client.query(rideQuery, [seatRequestRow.ride_id]);
      
      if (rideResult.rows.length === 0) {
        throw new Error('Ride not found');
      }
      
      const rideRow = rideResult.rows[0];
      
      if (rideRow.available_seats <= 0) {
        throw new Error('No available seats');
      }
      
      // Update seat request status
      const updateSeatRequestQuery = `
        UPDATE seat_requests 
        SET status = 'approved', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const updatedSeatRequestResult = await client.query(updateSeatRequestQuery, [seatRequestId]);
      
      // Decrement available seats
      const updateRideQuery = `
        UPDATE rides 
        SET available_seats = available_seats - 1,
            status = CASE 
              WHEN available_seats - 1 = 0 THEN 'full' 
              ELSE status 
            END,
            updated_at = NOW()
        WHERE id = $1
        RETURNING 
          id, uuid, driver_id,
          ST_Y(pickup_location) as pickup_latitude,
          ST_X(pickup_location) as pickup_longitude,
          ST_Y(destination_location) as destination_latitude,
          ST_X(destination_location) as destination_longitude,
          pickup_address, destination_address,
          departure_time, available_seats, total_seats, price_per_seat,
          status, created_at, updated_at
      `;
      const updatedRideResult = await client.query(updateRideQuery, [seatRequestRow.ride_id]);
      
      await client.query('COMMIT');
      
      const updatedSeatRequestRow = updatedSeatRequestResult.rows[0];
      const updatedRideRow = updatedRideResult.rows[0];
      
      return {
        seatRequest: {
          id: updatedSeatRequestRow.id,
          uuid: updatedSeatRequestRow.uuid,
          rideId: updatedSeatRequestRow.ride_id,
          riderId: updatedSeatRequestRow.rider_id,
          status: updatedSeatRequestRow.status,
          createdAt: new Date(updatedSeatRequestRow.created_at),
          updatedAt: new Date(updatedSeatRequestRow.updated_at)
        },
        ride: {
          id: updatedRideRow.id,
          uuid: updatedRideRow.uuid,
          driverId: updatedRideRow.driver_id,
          pickupLocation: {
            latitude: parseFloat(updatedRideRow.pickup_latitude),
            longitude: parseFloat(updatedRideRow.pickup_longitude)
          },
          destinationLocation: {
            latitude: parseFloat(updatedRideRow.destination_latitude),
            longitude: parseFloat(updatedRideRow.destination_longitude)
          },
          pickupAddress: updatedRideRow.pickup_address,
          destinationAddress: updatedRideRow.destination_address,
          departureTime: new Date(updatedRideRow.departure_time),
          availableSeats: updatedRideRow.available_seats,
          totalSeats: updatedRideRow.total_seats,
          pricePerSeat: updatedRideRow.price_per_seat,
          status: updatedRideRow.status,
          createdAt: new Date(updatedRideRow.created_at),
          updatedAt: new Date(updatedRideRow.updated_at)
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async startRide(rideId: number, driverId: number): Promise<Ride> {
    const query = `
      UPDATE rides 
      SET status = 'in_progress', updated_at = NOW()
      WHERE id = $1 AND driver_id = $2
      RETURNING 
        id, uuid, driver_id,
        ST_Y(pickup_location) as pickup_latitude,
        ST_X(pickup_location) as pickup_longitude,
        ST_Y(destination_location) as destination_latitude,
        ST_X(destination_location) as destination_longitude,
        pickup_address, destination_address,
        departure_time, available_seats, total_seats, price_per_seat,
        status, created_at, updated_at
    `;
    
    const result = await this.db.query(query, [rideId, driverId]);
    
    if (result.rows.length === 0) {
      throw new Error('Ride not found or unauthorized');
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async endRide(rideId: number, driverId: number): Promise<Ride> {
    const query = `
      UPDATE rides 
      SET status = 'completed', updated_at = NOW()
      WHERE id = $1 AND driver_id = $2
      RETURNING 
        id, uuid, driver_id,
        ST_Y(pickup_location) as pickup_latitude,
        ST_X(pickup_location) as pickup_longitude,
        ST_Y(destination_location) as destination_latitude,
        ST_X(destination_location) as destination_longitude,
        pickup_address, destination_address,
        departure_time, available_seats, total_seats, price_per_seat,
        status, created_at, updated_at
    `;
    
    const result = await this.db.query(query, [rideId, driverId]);
    
    if (result.rows.length === 0) {
      throw new Error('Ride not found or unauthorized');
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async cancelRide(rideId: number, userId: number): Promise<Ride> {
    const query = `
      UPDATE rides 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND (driver_id = $2 OR id IN (
        SELECT ride_id FROM seat_requests WHERE rider_id = $2 AND status = 'approved'
      ))
      RETURNING 
        id, uuid, driver_id,
        ST_Y(pickup_location) as pickup_latitude,
        ST_X(pickup_location) as pickup_longitude,
        ST_Y(destination_location) as destination_latitude,
        ST_X(destination_location) as destination_longitude,
        pickup_address, destination_address,
        departure_time, available_seats, total_seats, price_per_seat,
        status, created_at, updated_at
    `;
    
    const result = await this.db.query(query, [rideId, userId]);
    
    if (result.rows.length === 0) {
      throw new Error('Ride not found or unauthorized');
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async sendMessage(rideId: number, senderId: number, content: string): Promise<Message> {
    const query = `
      INSERT INTO messages (ride_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await this.db.query(query, [rideId, senderId, content]);
    const row = result.rows[0];
    
    return {
      id: row.id,
      uuid: row.uuid,
      rideId: row.ride_id,
      senderId: row.sender_id,
      content: row.content,
      createdAt: new Date(row.created_at)
    };
  }

  async getMessages(rideId: number): Promise<Message[]> {
    const query = `
      SELECT * FROM messages 
      WHERE ride_id = $1 
      ORDER BY created_at ASC
    `;
    
    const result = await this.db.query(query, [rideId]);
    
    return result.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      rideId: row.ride_id,
      senderId: row.sender_id,
      content: row.content,
      createdAt: new Date(row.created_at)
    }));
  }

  async addRating(rideId: number, reviewerId: number, reviewedUserId: number, rating: number, comment?: string): Promise<Rating> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      
      // Check if ride exists and is completed
      const rideQuery = `
        SELECT status FROM rides 
        WHERE id = $1 AND status = 'completed'
      `;
      const rideResult = await client.query(rideQuery, [rideId]);
      
      if (rideResult.rows.length === 0) {
        throw new Error('Ride not found or not completed');
      }
      
      // Check if reviewer was part of the ride
      const participantQuery = `
        SELECT 1 FROM rides r
        LEFT JOIN seat_requests sr ON r.id = sr.ride_id AND sr.status = 'approved'
        WHERE r.id = $1 AND (r.driver_id = $2 OR sr.rider_id = $2)
      `;
      const participantResult = await client.query(participantQuery, [rideId, reviewerId]);
      
      if (participantResult.rows.length === 0) {
        throw new Error('Reviewer was not part of this ride');
      }
      
      // Check if rating already exists
      const existingRatingQuery = `
        SELECT 1 FROM ratings 
        WHERE ride_id = $1 AND reviewer_id = $2 AND reviewed_user_id = $3
      `;
      const existingRatingResult = await client.query(existingRatingQuery, [rideId, reviewerId, reviewedUserId]);
      
      if (existingRatingResult.rows.length > 0) {
        throw new Error('Rating already exists for this ride and user');
      }
      
      // Insert rating
      const insertRatingQuery = `
        INSERT INTO ratings (ride_id, reviewer_id, reviewed_user_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const insertRatingResult = await client.query(insertRatingQuery, [rideId, reviewerId, reviewedUserId, rating, comment]);
      
      // Update user's average rating
      const updateUserRatingQuery = `
        UPDATE users 
        SET 
          rating = (
            (rating * rating_count) + $1
          ) / (rating_count + 1),
          rating_count = rating_count + 1,
          updated_at = NOW()
        WHERE id = $2
      `;
      await client.query(updateUserRatingQuery, [rating, reviewedUserId]);
      
      await client.query('COMMIT');
      
      const row = insertRatingResult.rows[0];
      return {
        id: row.id,
        uuid: row.uuid,
        rideId: row.ride_id,
        reviewerId: row.reviewer_id,
        reviewedUserId: row.reviewed_user_id,
        rating: row.rating,
        comment: row.comment,
        createdAt: new Date(row.created_at)
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    const query = `
      SELECT * FROM ratings 
      WHERE reviewed_user_id = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await this.db.query(query, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      rideId: row.ride_id,
      reviewerId: row.reviewer_id,
      reviewedUserId: row.reviewed_user_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: new Date(row.created_at)
    }));
  }

  async getCurrentRides(userId: number): Promise<Ride[]> {
    const query = `
      SELECT 
        r.id, r.uuid, r.driver_id,
        ST_Y(r.pickup_location) as pickup_latitude,
        ST_X(r.pickup_location) as pickup_longitude,
        ST_Y(r.destination_location) as destination_latitude,
        ST_X(r.destination_location) as destination_longitude,
        r.pickup_address, r.destination_address,
        r.departure_time, r.available_seats, r.total_seats, r.price_per_seat,
        r.status, r.created_at, r.updated_at
      FROM rides r
      WHERE r.status = 'in_progress'
        AND (
          r.driver_id = $1 
          OR r.id IN (
            SELECT ride_id FROM seat_requests 
            WHERE rider_id = $1 AND status = 'approved'
          )
        )
      ORDER BY r.departure_time ASC
    `;
    
    const result = await this.db.query(query, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  async getUpcomingRides(userId: number): Promise<Ride[]> {
    const query = `
      SELECT 
        r.id, r.uuid, r.driver_id,
        ST_Y(r.pickup_location) as pickup_latitude,
        ST_X(r.pickup_location) as pickup_longitude,
        ST_Y(r.destination_location) as destination_latitude,
        ST_X(r.destination_location) as destination_longitude,
        r.pickup_address, r.destination_address,
        r.departure_time, r.available_seats, r.total_seats, r.price_per_seat,
        r.status, r.created_at, r.updated_at
      FROM rides r
      WHERE r.status IN ('open', 'approved', 'full')
        AND r.departure_time > NOW()
        AND (
          r.driver_id = $1 
          OR r.id IN (
            SELECT ride_id FROM seat_requests 
            WHERE rider_id = $1 AND status = 'approved'
          )
        )
      ORDER BY r.departure_time ASC
    `;
    
    const result = await this.db.query(query, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  async getPastRides(userId: number): Promise<Ride[]> {
    const query = `
      SELECT 
        r.id, r.uuid, r.driver_id,
        ST_Y(r.pickup_location) as pickup_latitude,
        ST_X(r.pickup_location) as pickup_longitude,
        ST_Y(r.destination_location) as destination_latitude,
        ST_X(r.destination_location) as destination_longitude,
        r.pickup_address, r.destination_address,
        r.departure_time, r.available_seats, r.total_seats, r.price_per_seat,
        r.status, r.created_at, r.updated_at
      FROM rides r
      WHERE r.status IN ('completed', 'cancelled')
        AND (
          r.driver_id = $1 
          OR r.id IN (
            SELECT ride_id FROM seat_requests 
            WHERE rider_id = $1 AND status = 'approved'
          )
        )
      ORDER BY r.departure_time DESC
    `;
    
    const result = await this.db.query(query, [userId]);
    
    return result.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      driverId: row.driver_id,
      pickupLocation: {
        latitude: parseFloat(row.pickup_latitude),
        longitude: parseFloat(row.pickup_longitude)
      },
      destinationLocation: {
        latitude: parseFloat(row.destination_latitude),
        longitude: parseFloat(row.destination_longitude)
      },
      pickupAddress: row.pickup_address,
      destinationAddress: row.destination_address,
      departureTime: new Date(row.departure_time),
      availableSeats: row.available_seats,
      totalSeats: row.total_seats,
      pricePerSeat: row.price_per_seat,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }
}