#!/bin/bash
# build_and_push.sh

# Set environment variables
export REGION=mx-queretaro-1
export REGISTRY=${REGION}.ocir.io
export NAMESPACE=ax83el69bkfn
export TG_REPO=mtdr-ocir-telegram
export WEB_REPO=mtdr-ocir-web
export TAG=latest


# Build both images from the combined Dockerfile
echo "Building Telegram image..."
docker build \
  --platform=linux/amd64 \
  -f telegram/Dockerfile \
  -t mx-queretaro-1.ocir.io/ax83el69bkfn/mtdr-ocir-telegram:latest \
  .

echo "Building Web image..."
docker build \
  --platform=linux/amd64 \
  -f web/Dockerfile \
  -t mx-queretaro-1.ocir.io/ax83el69bkfn/mtdr-ocir-web:latest \
  .

# Push images to OCIR
echo "Pushing Telegram image to OCIR..."
docker push ${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG}

echo "Pushing Web image to OCIR..."
docker push ${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG}

echo "Build and push completed successfully!"