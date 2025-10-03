# ============================================
# Railway Deployment Dockerfile
# ============================================
# This Dockerfile is specifically for Railway deployment
# It builds only the backend API service

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy backend package.json
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci

# Copy backend source code
COPY backend/ ./backend/

# Generate Prisma Client (creates type-safe database client)
RUN cd backend && npx prisma generate

# Build TypeScript to JavaScript (outputs to dist/)
RUN cd backend && npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

# Install dumb-init (handles signals properly in containers)
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy backend package.json
COPY backend/package*.json ./backend/

# Install production dependencies + tsx for seed script
RUN cd backend && npm ci --only=production && npm install tsx

# Copy Prisma schema (needed for migrations at runtime)
COPY backend/prisma ./backend/prisma

# Copy source files (needed for seed script)
COPY backend/src ./backend/src

# Copy built application from builder stage
COPY --from=builder /app/backend/dist ./backend/dist

# Copy Prisma client generated in builder stage
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=builder /app/backend/node_modules/@prisma ./backend/node_modules/@prisma

# Expose the port your app runs on
EXPOSE 3000

# Railway will set the PORT environment variable
# Use dumb-init to run Node.js (better signal handling)
CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && npx tsx src/seed.ts && dumb-init node dist/index.js"]
