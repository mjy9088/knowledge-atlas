#!/usr/bin/env sh
set -eu

exec sudo --user dim-agent --set-home \
  sh -lc '
    cd /workspace
    corepack pnpm install --frozen-lockfile
    export PORT=4173
    exec corepack pnpm dev
  '
