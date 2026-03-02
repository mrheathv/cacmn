#!/bin/bash
set -e

# Build with OpenNext for Cloudflare
npx opennextjs-cloudflare build

# _worker.js must be in pages_build_output_dir (.open-next/assets).
# The worker entry point also imports sibling modules, so they must be
# copied into the same directory for Cloudflare's esbuild bundling step.
cp .open-next/worker.js .open-next/assets/_worker.js

for dir in cloudflare middleware .build server-functions; do
  if [ -d ".open-next/$dir" ]; then
    cp -r ".open-next/$dir" ".open-next/assets/"
  fi
done
