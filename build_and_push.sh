#!/bin/bash
# build_and_push.sh

# Set environment variables
export REGION=mx-queretaro-1
export REGISTRY=${REGION}.ocir.io
export NAMESPACE=ax83el69bkfn
export TG_REPO=mtdr-ocir-telegram
export WEB_REPO=mtdr-ocir-web
export TAG=latest

# Create a combined Dockerfile for both services
cat > Dockerfile.combined << 'EOF'
# Build stage
FROM maven:3.8.3-openjdk-17 AS builder

# Set build context to /build
WORKDIR /build

# Copy the entire project structure
COPY pom.xml ./
COPY lib ./lib
COPY telegram ./telegram
COPY web ./web

# Build the entire project
RUN mvn clean package -DskipTests

# Telegram image
FROM openjdk:17-slim AS telegram

# Install Oracle client libraries
RUN apt-get update \
    && apt-get install -y libaio1 \
    && rm -rf /var/lib/apt/lists/*

# Prepare application directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /build/telegram/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Launch the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Web image
FROM openjdk:17-slim AS web

# Install Oracle client libraries
RUN apt-get update \
    && apt-get install -y libaio1 \
    && rm -rf /var/lib/apt/lists/*

# Prepare application directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /build/web/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Launch the application
ENTRYPOINT ["java", "-jar", "app.jar"]
EOF

# Build both images from the combined Dockerfile
echo "Building Telegram image..."
docker build --target telegram -f Dockerfile.combined -t ${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG} .

echo "Building Web image..."
docker build --target web -f Dockerfile.combined -t ${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG} .

# Push images to OCIR
echo "Pushing Telegram image to OCIR..."
docker push ${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG}

echo "Pushing Web image to OCIR..."
docker push ${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG}

echo "Build and push completed successfully!"