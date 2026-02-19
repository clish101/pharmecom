#!/bin/bash
set -e

# Ensure we're in the vaccine-orders-pro directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Building React frontend..."
echo "Working directory: $(pwd)"

# Install dependencies (don't clean, let npm handle caching)
npm install

# Build the frontend
echo "Running Vite build..."
npm run build

echo "Frontend built successfully at $(pwd)/backend/staticfiles"

# Setup Django backend
echo "Setting up Django backend..."
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

echo "Build completed successfully!"
