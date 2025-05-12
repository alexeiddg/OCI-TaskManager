#!/bin/bash

# Exit if any command fails
set -e

# Prompt for OS platform
echo "🖥️  What operating system are you using?"
select os in "macOS (Apple Silicon)" "Windows (x86_64/amd64)" "Other"; do
  case $os in
    "macOS (Apple Silicon)")
      PLATFORM="linux/arm64"
      break
      ;;
    "Windows (x86_64/amd64)")
      PLATFORM="linux/amd64"
      break
      ;;
    "Other")
      echo "⚠️ Defaulting to linux/amd64. You can change this manually."
      PLATFORM="linux/amd64"
      break
      ;;
    *)
      echo "Invalid option. Please try again."
      ;;
  esac
done

# Go to project root
cd "$(dirname "$0")"

# Step 0: Maven build
echo "🛠️ Running Maven clean install from root..."
mvn clean install -DskipTests

# Step 1: Build Telegram Docker image
echo "🐳 Building Telegram Docker image with platform=$PLATFORM..."
cd telegram
docker build --platform="$PLATFORM" \
  -f Dockerfile \
  -t mtdr-telegram:latest \
  .
cd ..

# Step 2: Build Web Docker image
echo "🐳 Building Web Docker image with platform=$PLATFORM..."
cd web
docker build --platform="$PLATFORM" \
  -f Dockerfile \
  -t mtdr-web:latest \
  .
cd ..

# Step 3: Build Frontend Docker image
echo "🐳 Building Frontend Docker image with platform=$PLATFORM..."
cd frontend
docker build --platform="$PLATFORM" \
  -f Dockerfile \
  -t mtdr-front:latest \
  .
cd ..

echo "✅ All builds completed successfully with platform $PLATFORM."