#!/bin/bash

# Cinema Backend Development Setup Script
# This script sets up the development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}$1${NC}"
}

print_header "🎬 Cinema Backend Development Setup"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_status "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "✅ npm $(npm --version) detected"

# Install dependencies
print_status "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "📄 Creating .env file from template..."
    cp .env.example .env
    print_warning "Please update the .env file with your configuration"
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    print_status "✅ Docker detected"
    
    # Ask if user wants to set up with Docker
    read -p "Do you want to set up the development environment with Docker? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "🐳 Setting up Docker development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        print_status "✅ Docker containers started"
        print_status "📊 phpMyAdmin available at: http://localhost:8080"
    fi
else
    print_warning "Docker is not installed. You'll need to set up MySQL manually."
fi

# Run tests to ensure everything is working
print_status "🧪 Running tests..."
if npm test; then
    print_status "✅ All tests passed"
else
    print_warning "Some tests failed. Please check the output above."
fi

print_header "🎉 Setup Complete!"
echo "========================================"
print_status "Available commands:"
echo "  npm run start:dev     - Start development server"
echo "  npm run start:debug   - Start with debugging"
echo "  npm run test          - Run unit tests"
echo "  npm run test:e2e      - Run e2e tests"
echo "  npm run test:cov      - Run tests with coverage"
echo "  npm run lint          - Run linting"
echo "  npm run build         - Build for production"
echo ""
print_status "Development server will be available at: http://localhost:4000"
print_status "Swagger documentation: http://localhost:4000/api-docs"
echo ""
print_status "To start development:"
echo "  npm run start:dev"
