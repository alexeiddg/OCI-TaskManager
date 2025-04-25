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
  -f telegram/Dockerfile \
  -t ${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG} \
  telegram/

echo "Building Web image..."
docker build \
  -f web/Dockerfile \
  -t ${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG} \
  web/

# Push images to OCIR
echo "Pushing Telegram image to OCIR..."
docker push ${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG}

echo "Pushing Web image to OCIR..."
docker push ${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG}

echo "Build and push completed successfully!"