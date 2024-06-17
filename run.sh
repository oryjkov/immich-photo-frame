#!/bin/bash
# Runs an nginx reverse proxy to serve the local changes with an
# instance of immich at `immich.local` - see nginx/nginx-dev.conf
podman run  --network host \
  -v $(pwd)/dist:/data/photo-frame \
  -v $(pwd)/nginx/nginx-dev.conf:/etc/nginx/nginx.conf:ro \
  docker.io/nginx
