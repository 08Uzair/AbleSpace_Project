# AbleSpace MCP server (stdio transport)
# Runs standalone for testing; the ai-server image bundles its own copy.

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY index.js ./
CMD ["node", "index.js"]