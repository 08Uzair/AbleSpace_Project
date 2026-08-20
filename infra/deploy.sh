#!/usr/bin/env bash
#
# =============================================================================
#  AbleSpace deploy.sh
#  Builds every service Dockerfile, runs the containers on a shared Docker
#  network, and prints the URLs.
#
#  Usage:
#    ./deploy.sh            # build images + run all containers
#    ./deploy.sh build      # build images only
#    ./deploy.sh down       # stop & remove containers + network
#    ./deploy.sh logs <c>   # follow logs of a container
#
#  Secrets (MONGODB_URI, GROQ_API_KEY, ...) are read from infra/.env
#  (copy infra/.env.example -> infra/.env). Every value can also be
#  overridden by an environment variable of the same name.
#
#  Containers are joined to the "ablespace-net" Docker network, so they can
#  reach each other by service name:
#    client -> server:5000 / ai:5001   (via http://server:5000, http://ai:5001)
#    ai     -> mcp (stdio child) + server API
#    mcp    -> server API
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

NETWORK="ablespace-net"

# ---------------------------------------------------------------------------
# Load infra/.env if present (secrets + overrides)
# ---------------------------------------------------------------------------
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.env"
  set +a
fi

# Host ports
SERVER_PORT="${SERVER_PORT:-5000}"
AI_PORT="${AI_PORT:-5001}"
CLIENT_PORT="${CLIENT_PORT:-3000}"

# URLs baked into the browser bundle (must be reachable FROM THE BROWSER)
CLIENT_API_URL="${CLIENT_API_URL:-http://localhost:$SERVER_PORT}"
CLIENT_AI_URL="${CLIENT_AI_URL:-http://localhost:$AI_PORT}"

# URLs used INSIDE the Docker network
API_INTERNAL="http://server:$SERVER_PORT"
CLIENT_ORIGIN="${CLIENT_ORIGIN:-http://localhost:$CLIENT_PORT}"
GROQ_MODEL="${GROQ_MODEL:-openai/gpt-oss-20b}"
MCP_SERVER_PATH="${MCP_SERVER_PATH:-../mcp-server/index.js}"

CONTAINERS=(ablespace-client ablespace-ai ablespace-mcp ablespace-server)

log() { printf "\033[1;34m==> %s\033[0m\n" "$*"; }
err() { printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2; }

require_env() {
  if [ -z "${!1:-}" ]; then
    err "$1 is not set. Put it in $SCRIPT_DIR/.env (copy .env.example)."
    exit 1
  fi
}

network() {
  if ! docker network inspect "$NETWORK" >/dev/null 2>&1; then
    log "Creating Docker network: $NETWORK"
    docker network create "$NETWORK"
  fi
}

build_all() {
  log "Building [server] image"
  docker build -t ablespace-server \
    -f "$ROOT_DIR/server/Dockerfile" "$ROOT_DIR/server"

  log "Building [mcp-server] image"
  docker build -t ablespace-mcp \
    -f "$ROOT_DIR/mcp-server/Dockerfile" "$ROOT_DIR/mcp-server"

  log "Building [ai-server] image (build context = repo root, bundles mcp-server)"
  docker build -t ablespace-ai \
    -f "$ROOT_DIR/ai-server/Dockerfile" "$ROOT_DIR"

  log "Building [client] image"
  docker build -t ablespace-client \
    --build-arg NEXT_PUBLIC_API_URL="$CLIENT_API_URL" \
    --build-arg NEXT_PUBLIC_AI_URL="$CLIENT_AI_URL" \
    -f "$ROOT_DIR/client/Dockerfile" "$ROOT_DIR/client"

  log "All images built."
}

wait_http() {
  local url="$1" container="$2" i
  log "Waiting for $container to become healthy ($url)..."
  for i in $(seq 1 60); do
    if curl -sf "$url" >/dev/null 2>&1; then
      log "$container is up."
      return 0
    fi
    sleep 2
  done
  err "$container not reachable after 120s — check: docker logs $container"
  return 1
}

run_all() {
  require_env MONGODB_URI
  require_env GROQ_API_KEY
  network

  # ------------------------------- server --------------------------------
  log "Starting [server] container"
  docker rm -f ablespace-server >/dev/null 2>&1 || true
  docker run -d --name ablespace-server \
    --network "$NETWORK" --network-alias server \
    -p "$SERVER_PORT:5000" \
    -e PORT=5000 \
    -e MONGODB_URI="$MONGODB_URI" \
    -e CLIENT_ORIGIN="$CLIENT_ORIGIN" \
    ablespace-server

  # ------------------------------- mcp -----------------------------------
  log "Starting [mcp-server] container (standalone; ai-server spawns its own copy)"
  docker rm -f ablespace-mcp >/dev/null 2>&1 || true
  docker run -d --name ablespace-mcp \
    --network "$NETWORK" --network-alias mcp \
    -e API_BASE_URL="$API_INTERNAL" \
    ablespace-mcp

  # --------------------------------- ai ----------------------------------
  log "Starting [ai-server] container"
  docker rm -f ablespace-ai >/dev/null 2>&1 || true
  docker run -d --name ablespace-ai \
    --network "$NETWORK" --network-alias ai \
    -p "$AI_PORT:5001" \
    -e PORT=5001 \
    -e GROQ_API_KEY="$GROQ_API_KEY" \
    -e GROQ_MODEL="$GROQ_MODEL" \
    -e API_BASE_URL="$API_INTERNAL" \
    -e MCP_SERVER_PATH="$MCP_SERVER_PATH" \
    -e CLIENT_ORIGIN="$CLIENT_ORIGIN" \
    ablespace-ai

  # ------------------------------- client --------------------------------
  log "Starting [client] container"
  docker rm -f ablespace-client >/dev/null 2>&1 || true
  docker run -d --name ablespace-client \
    --network "$NETWORK" --network-alias client \
    -p "$CLIENT_PORT:3000" \
    ablespace-client

  # ------------------------------ health ---------------------------------
  wait_http "http://localhost:$SERVER_PORT/api/health" "ablespace-server" || true
  wait_http "http://localhost:$AI_PORT/api/health" "ablespace-ai" || true

  log "Done. Everything is connected on the '$NETWORK' Docker network."
  printf "\n  Client:  http://localhost:%s\n" "$CLIENT_PORT"
  printf "  Server:  http://localhost:%s/api/health\n" "$SERVER_PORT"
  printf "  AI:      http://localhost:%s/api/health\n" "$AI_PORT"
  printf "\n  Stop everything with: ./deploy.sh down\n\n"
}

down() {
  log "Removing containers..."
  for c in "${CONTAINERS[@]}"; do
    docker rm -f "$c" >/dev/null 2>&1 || true
  done
  docker network rm "$NETWORK" >/dev/null 2>&1 || true
  log "All AbleSpace containers and the '$NETWORK' network were removed."
}

case "${1:-run}" in
  run)
    build_all
    run_all
    ;;
  build)
    build_all
    ;;
  down)
    down
    ;;
  logs)
    [ $# -ge 2 ] || { err "Usage: $0 logs <container>"; exit 1; }
    docker logs -f "$2"
    ;;
  *)
    err "Unknown command: ${1:-}"
    echo "Usage: $0 [run|build|down|logs <container>]"
    exit 1
    ;;
esac