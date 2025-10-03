# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd frontend && npm ci

# Copy frontend source code
COPY frontend/ ./frontend/

# Build the application
RUN cd frontend && npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/frontend/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start Vite preview server
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
