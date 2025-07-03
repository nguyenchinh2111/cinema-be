#!/bin/bash

# Cinema Backend Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Starting deployment process..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Pull latest changes
print_status "Pulling latest changes from repository..."
git pull origin main

# Build Docker image
print_status "Building Docker image..."
docker build -t cinema-backend:latest .

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Start new containers
print_status "Starting new containers..."
docker-compose up -d

# Wait for application to be ready
print_status "Waiting for application to start..."
sleep 30

# Health check
print_status "Performing health check..."
if curl -f http://localhost:4000/ > /dev/null 2>&1; then
    print_status "✅ Deployment successful! Application is running."
else
    print_error "❌ Health check failed. Please check the logs."
    docker-compose logs app
    exit 1
fi

# Clean up old Docker images
print_status "Cleaning up old Docker images..."
docker image prune -f

print_status "🎉 Deployment completed successfully!"
print_status "API is available at: http://localhost:4000"
print_status "Swagger documentation: http://localhost:4000/api-docs"
