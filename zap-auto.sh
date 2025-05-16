#!/bin/bash

# Exit on any error
set -e

# === CONFIG ===
TARGET_URL="http://host.docker.internal:3000"
RESULT_FILE="result.xml"
OUTPUT_DIR="zap-output"
IMAGE="ghcr.io/zaproxy/zaproxy:stable"

echo "Pulling the latest ZAP image..."
sudo docker pull $IMAGE

echo "Preparing output directory..."
mkdir -p $OUTPUT_DIR
cd $OUTPUT_DIR

echo "🐳 Running a test container to check network access..."
sudo docker run -it --rm $IMAGE curl -I $TARGET_URL

echo "🚀 Running ZAP scan on $TARGET_URL ..."
sudo docker run \
  --user $(id -u):$(id -g) \
  -v "$(pwd)":/zap/wrk/:rw \
  --rm -t $IMAGE \
  zap.sh -cmd \
    -quickurl $TARGET_URL \
    -quickout /zap/wrk/$RESULT_FILE \
    -config api.disablekey=true

if [[ -f "$RESULT_FILE" ]]; then
  echo "✅ Scan complete. Result saved to $OUTPUT_DIR/$RESULT_FILE"
else
  echo "❌ Scan did not generate a result file."
fi
