#!/usr/bin/env bash

set -e

APP_DIR="$HOME/zadanie_9"

cd "$APP_DIR"

echo "Logging in to GHCR..."
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

echo "Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

echo "Starting containers..."
docker compose -f docker-compose.prod.yml up -d

echo "Cleaning old Docker images..."
docker image prune -f

echo "Deployment finished."
docker ps