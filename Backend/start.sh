#!/bin/bash

# Exit on any error
set -e

echo "Starting Rideshare Backend Application..."

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo "Loading production environment variables..."
    export $(cat .env.production | xargs)
else
    echo "Warning: .env.production file not found, using default environment variables."
fi

# Start the application
echo "Starting application..."
npm start