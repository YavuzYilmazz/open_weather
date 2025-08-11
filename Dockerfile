# Multi-stage build for TypeScript Node.js app

# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

## Install dependencies (with Prisma schema for client generation)
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --no-frozen-lockfile

## Copy application code and generate TypeScript build
COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only built files
# Copy built files, dependencies, and Prisma schema from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Set production environment
ENV NODE_ENV=production

# Expose port and start the application (run migrations before server)
EXPOSE 3000
 CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/server.js"]
