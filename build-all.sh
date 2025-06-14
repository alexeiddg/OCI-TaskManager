#!/bin/bash

# Exit if any command fails
set -e

# Go to project root
cd "$(dirname "$0")"

# Step 0: Maven build
echo "🛠️ Running Maven clean install from root..."
mvn clean install -DskipTests

# Step 1: Build & push Telegram Docker image
echo "🐳 Building Telegram Docker image..."
cd telegram
docker build --platform=linux/amd64 \
  -f Dockerfile \
  -t {registry}/{namespace}/{repository}:{tag} \
  .

echo "🚀 Pushing Telegram image to OCIR..."
docker push {registry}/{namespace}/{repository}:{tag}
cd ..

# Step 2: Build & push Web Docker image
echo "🐳 Building Web Docker image..."
cd web
docker build --platform=linux/amd64 \
  -f Dockerfile \
  -t {registry}/{namespace}/{repository}:{tag} \
  .

echo "🚀 Pushing Web image to OCIR..."
docker push {registry}/{namespace}/{repository}:{tag}
cd ..

# Step 3: Build & push Frontend Docker image
echo "🐳 Building Frontend Docker image..."
cd frontend
docker build --platform=linux/amd64 \
  -f Dockerfile \
  -t {registry}/{namespace}/{repository}:{tag} \
  .

echo "🚀 Pushing Frontend image to OCIR..."
docker push {registry}/{namespace}/{repository}:{tag}
cd ..

# Step 4: Cleanup Docker system
echo "🧹 Cleaning up unused Docker resources..."
docker system prune -a --volumes --force

echo "✅ All builds, pushes, and cleanup completed successfully."
