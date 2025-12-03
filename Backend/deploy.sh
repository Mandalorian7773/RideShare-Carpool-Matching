#!/bin/bash

# Deployment script for Rideshare Backend

set -e  # Exit on any error

echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "Installing production dependencies..."
npm ci --only=production

echo "Building the application..."
npm run build

echo "Creating logs directory..."
mkdir -p logs

echo "Deployment completed successfully!"
echo ""
echo "To start the application, run:"
echo "  npm start"
echo ""
echo "To start the application with PM2, run:"
echo "  npx pm2 start ecosystem.config.js"
echo ""
echo "To start the application in development mode, run:"
echo "  npm run dev"