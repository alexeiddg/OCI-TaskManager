#!/usr/bin/env bash
cd "$(dirname "$0")"
# Run prettier on all files in the current folder
npx prettier . --write
