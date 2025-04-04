#!/bin/bash
set -e

export DOCKER_REGISTRY="mx-queretaro-1.ocir.io/ax83el69bkfn/oci-task-manager"

# Build Telegram Service
echo "Building Telegram Service..."
cd telegram
mvn clean package spring-boot:repackage
docker build -t ${DOCKER_REGISTRY}/telegram:0.0.1 .
docker push ${DOCKER_REGISTRY}/telegram:0.0.1
docker rmi ${DOCKER_REGISTRY}/telegram:0.0.1
cd ..

# Build Web Service
echo "Building Web Service..."
cd web
mvn clean package spring-boot:repackage
docker build -t ${DOCKER_REGISTRY}/web:0.0.1 .
docker push ${DOCKER_REGISTRY}/web:0.0.1
docker rmi ${DOCKER_REGISTRY}/web:0.0.1
cd ..

# Build Frontend (Next.js)
echo "Building Frontend..."
cd frontend
npm install
npm run build
docker build -t ${DOCKER_REGISTRY}/frontend:0.0.1 .
docker push ${DOCKER_REGISTRY}/frontend:0.0.1
docker rmi ${DOCKER_REGISTRY}/frontend:0.0.1
cd ..

echo "All services have been built and pushed successfully."