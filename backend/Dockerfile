# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy backend package.json
COPY package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source code
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

# Copy backend package.json
COPY package*.json ./

# Install production dependencies + tsx for seed script
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm install --no-save tsx

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

# Start: apply migrations, seed, then run the server with dumb-init
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/seed.ts && dumb-init node dist/index.js"]

