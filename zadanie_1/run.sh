#!/bin/bash

IMAGE_NAME="bubblesort-pascal"
SCRIPT_DIR="$(dirname "$0")"

echo "Budowanie obrazu Docker..."
docker build -t $IMAGE_NAME "$SCRIPT_DIR"

echo "Uruchamianie programu..."
docker run --rm $IMAGE_NAME
