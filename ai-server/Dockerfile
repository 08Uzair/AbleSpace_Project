# AbleSpace AI bridge (Express + Groq + MCP)
#
# NOTE: the bridge spawns the MCP server as a stdio child process
# (MCP_SERVER_PATH=../mcp-server/index.js), so this image BUNDLES the
# mcp-server source at /mcp-server, exactly mirroring the local layout.
#
# BUILD CONTEXT MUST BE THE REPO ROOT (see infra/deploy.sh):
#   docker build -f ai-server/Dockerfile .

FROM node:22-alpine AS ai-deps
WORKDIR /app
COPY ai-server/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

FROM node:22-alpine AS mcp-deps
WORKDIR /mcp-server
COPY mcp-server/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=ai-deps /app/node_modules ./node_modules
COPY ai-server/package.json ./
COPY ai-server/index.js ./
COPY --from=mcp-deps /mcp-server/node_modules /mcp-server/node_modules
COPY mcp-server/package.json /mcp-server/package.json
COPY mcp-server/index.js /mcp-server/index.js
EXPOSE 5001
CMD ["node", "index.js"]