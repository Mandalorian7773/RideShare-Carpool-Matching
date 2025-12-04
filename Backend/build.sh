#!/bin/bash

# Exit on any error
set -e

echo "Building Rideshare Backend Application..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist

# Install all dependencies (including dev dependencies for building)
echo "Installing all dependencies..."
npm ci

# Build TypeScript files
echo "Compiling TypeScript files..."
npm run build

# Remove dev dependencies to reduce production package size
echo "Removing development dependencies..."
npm prune --production

# Verify build
if [ -d "dist" ] && [ -f "dist/app.js" ]; then
    echo "Build successful!"
    echo "Build artifacts are located in the 'dist' directory."
    echo "To start the application, run: npm start"
else
    echo "Build failed!"
    exit 1
fi