#!/bin/bash
set -e

# Set environment variables
export DOCKER_REGISTRY="mx-queretaro-1.ocir.io/ax83el69bkfn/oci-task-manager"
export NAMESPACE=mtdrworkshop

# Deploy Telegram Service
echo "Deploying Telegram Service..."
sed -e "s|%DOCKER_REGISTRY%|${DOCKER_REGISTRY}|g" telegram-deployment.yaml.template > telegram-deployment.yaml
kubectl apply -f telegram-deployment.yaml -n ${NAMESPACE}

# Deploy Web Service
# echo "Deploying Web Service..."
# sed -e "s|%DOCKER_REGISTRY%|${DOCKER_REGISTRY}|g" web-deployment.yaml.template > web-deployment.yaml
# kubectl apply -f web-deployment.yaml -n ${NAMESPACE}

# Deploy Frontend
# echo "Deploying Frontend..."
# sed -e "s|%DOCKER_REGISTRY%|${DOCKER_REGISTRY}|g" frontend-deployment.yaml.template > frontend-deployment.yaml
# kubectl apply -f frontend-deployment.yaml -n ${NAMESPACE}

echo "Deployment complete. Check your services with: kubectl get pods,svc -n ${NAMESPACE}"