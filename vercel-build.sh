#!/bin/bash

# Exit on error
set -e

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the project
echo "Building the project..."
npm run build

# Verify the build output
echo "Verifying build output..."
ls -la dist/

echo "Build completed successfully!"
