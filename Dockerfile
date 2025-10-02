# ============================================
# Stage 1: Builder
# ============================================
# Use Node.js 20 on Alpine Linux (lightweight)
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first (Docker layer caching optimization)
# If package.json doesn't change, Docker reuses this layer
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma Client (creates type-safe database client)
RUN npx prisma generate

# Build TypeScript to JavaScript (outputs to dist/)
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

# Install dumb-init (handles signals properly in containers)
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies + tsx for seed script
RUN npm ci --only=production && npm install tsx

# Copy Prisma schema (needed for migrations at runtime)
COPY prisma ./prisma

# Copy source files (needed for seed script)
COPY src ./src

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy Prisma client generated in builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose the port your app runs on
EXPOSE 3000

# Use dumb-init to run Node.js (better signal handling)
# Start the application
CMD ["dumb-init", "node", "dist/index.js"]

