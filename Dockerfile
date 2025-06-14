# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
# Dockerfile for PostgreSQL MCP Server

# Use Node.js LTS based on Alpine for minimal footprint
FROM node:lts-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json tsconfig.json ./
# Copy source code
COPY src ./src

# Install without running prepare scripts
RUN npm ci --ignore-scripts

# Build TypeScript
RUN npm run build

# Production image
FROM node:lts-alpine AS runner
WORKDIR /usr/src/app

# Copy built files and package.json if needed for production dependencies
COPY --from=builder /usr/src/app/build ./build
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts

# Expose no ports since MCP uses stdio
# Default command
ENTRYPOINT ["node", "build/index.js"]
