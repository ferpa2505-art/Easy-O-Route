#!/usr/bin/env bash
# Starts the Easy-O-Route panel (http://localhost:8090) without installing the CLI.
# The OmniRoute token is read with hidden input and kept only in the environment of this
# process: nothing is written to a file.
#
# Usage:  ./start.sh
#         PORT=8091 OMNIROUTE_URL=http://localhost:20128 ./start.sh
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found. Install it from https://nodejs.org and run this script again." >&2
  exit 1
fi

export PORT="${PORT:-8090}"
export OMNIROUTE_URL="${OMNIROUTE_URL:-http://localhost:20128}"

if [ -z "${OMNIROUTE_TOKEN:-}" ] && [ -t 0 ]; then
  read -r -s -p "OmniRoute token (oma_live_...) - press Enter to skip: " OMNIROUTE_TOKEN
  echo
  if [ -n "$OMNIROUTE_TOKEN" ]; then
    export OMNIROUTE_TOKEN
  else
    echo "No token: paste it in the panel (Connect OmniRoute) if OmniRoute asks for one."
    unset OMNIROUTE_TOKEN
  fi
fi

exec node server.js
