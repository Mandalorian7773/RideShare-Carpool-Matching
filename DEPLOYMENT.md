# Deployment Guide

This guide explains how to deploy the Rideshare application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 1.29 or higher

## Deployment Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RideShare-Carpool-Matching
   ```

2. Build and start the services:
   ```bash
   docker-compose up -d
   ```

3. The application will be available at:
   - API: http://localhost:3000
   - Database: postgres://rideshare_user:password123@localhost:5432/rideshare

## Configuration

The application can be configured using environment variables in the `docker-compose.yml` file:

- `NODE_ENV`: Application environment (production)
- `DB_HOST`: Database host (database)
- `DB_PORT`: Database port (5432)
- `DB_NAME`: Database name (rideshare)
- `DB_USER`: Database user (rideshare_user)
- `DB_PASSWORD`: Database password (password123)
- `JWT_SECRET`: Secret key for JWT token signing

## Health Checks

The application includes health checks:
- API health: http://localhost:3000/health

## Scaling

To scale the backend service:
```bash
docker-compose up -d --scale backend=3
```

## Monitoring

View logs:
```bash
docker-compose logs -f backend
docker-compose logs -f database
```

## Backup and Restore

Backup database:
```bash
docker-compose exec database pg_dump -U rideshare_user rideshare > backup.sql
```

Restore database:
```bash
docker-compose exec -T database psql -U rideshare_user rideshare < backup.sql
```

## Troubleshooting

1. If containers fail to start, check the logs:
   ```bash
   docker-compose logs backend
   docker-compose logs database
   ```

2. Ensure ports 3000 and 5432 are not already in use.

3. For database connection issues, verify the database credentials in `docker-compose.yml`.

## Updating the Application

To update the application:

1. Pull the latest changes:
   ```bash
   git pull
   ```

2. Rebuild and restart services:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```