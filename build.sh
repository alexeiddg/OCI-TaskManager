#!/usr/bin/env bash
set -euo pipefail

OCIR_REGION="${OCIR_REGION:-iad}"                          # OCI region key (e.g. iad, phx, etc.)
NAMESPACE="${NAMESPACE:-my-namespace}"                     # Your tenancy namespace in OCIR
OCI_USER="${OCI_USER:-your-username}"                      # Your OCI username (no namespace)
AUTH_TOKEN="${AUTH_TOKEN:?You must set AUTH_TOKEN env var}" # Your OCI Auth Token
TAG="${TAG:-latest}"                                       # Image tag

WEB_REPO="${WEB_REPO:-spring-projects/web-app}"            # Repo name for web image
TG_REPO="${TG_REPO:-spring-projects/telegram-app}"         # Repo name for telegram image

REGISTRY="${OCIR_REGION}.ocir.io"

# ─────────── LOGIN ───────────
echo "🔐 Logging into ${REGISTRY}..."
echo "${AUTH_TOKEN}" | docker login "${REGISTRY}" -u "${NAMESPACE}/${OCI_USER}" --password-stdin

# ─────────── BUILD & PUSH: web ───────────
echo "📦 Building web image..."
docker build \
  -f web/Dockerfile \
  -t "${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG}" \
  web/

echo "🚀 Pushing web image..."
docker push "${REGISTRY}/${NAMESPACE}/${WEB_REPO}:${TAG}"

# ─────────── BUILD & PUSH: telegram ───────────
echo "📦 Building telegram image..."
docker build \
  -f telegram/Dockerfile \
  -t "${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG}" \
  telegram/

echo "🚀 Pushing telegram image..."
docker push "${REGISTRY}/${NAMESPACE}/${TG_REPO}:${TAG}"

echo "✅ All done!"