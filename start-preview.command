#!/bin/zsh

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR" || exit 1

python3 -m http.server 8765 --bind 127.0.0.1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM

for attempt in {1..20}; do
  curl --silent --fail "http://localhost:8765/index.html" >/dev/null && break
  sleep 0.1
done

open "http://localhost:8765/index.html"
wait "$SERVER_PID"
