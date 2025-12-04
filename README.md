# Rideshare Carpool Matching Platform

A production-ready carpool matching platform built with Node.js, Fastify, and PostgreSQL.

## Features

- User authentication (drivers and riders)
- Ride creation and management
- Real-time ride search and discovery
- Seat booking and approval system
- Ride lifecycle management (start, end, cancel)
- In-app messaging
- Rating and review system
- Ride history tracking

## Tech Stack

- **Backend**: Node.js with Fastify framework
- **Database**: PostgreSQL with PostGIS for geospatial data
- **Authentication**: JWT-based authentication
- **Real-time**: WebSocket for live updates
- **Push Notifications**: Firebase Cloud Messaging
- **Containerization**: Docker and Docker Compose

## Getting Started

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 1.29+

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd RideShare-Carpool-Matching

# Start services
docker-compose up -d

# Access the API at http://localhost:3000
```

### Development Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## API Documentation

API documentation is available in `Backend/API_DOCS.md`.

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Testing

Run tests with:

```bash
npm test
```

## License

MIT

## Support

For support, please open an issue on the repository.