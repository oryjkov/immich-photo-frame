#!/bin/bash
podman run  --network host \
  -v $(pwd)/dist:/data/photo-frame \
  -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  docker.io/nginx
