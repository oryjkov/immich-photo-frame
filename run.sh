#!/bin/bash
(set -a ; source .env && envsubst '$API_KEY' < nginx/nginx.conf)  > run/nginx.conf && podman run  --network host  -v $(pwd)/dist:/data/frame -v $(pwd)/run/nginx.conf:/etc/nginx/nginx.conf:ro docker.io/nginx
