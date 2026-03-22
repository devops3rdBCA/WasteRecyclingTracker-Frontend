# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runtime/Serve stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Create non-root user and group (ignore errors if they exist)
RUN addgroup -g 1000 appuser 2>/dev/null || true
RUN adduser -D -u 1000 -G appuser appuser 2>/dev/null || true

# === BEGIN DIAGNOSTIC SECTION ===

# Show current groups and users
RUN echo "=== /etc/group ===" && cat /etc/group
RUN echo "=== /etc/passwd ===" && cat /etc/passwd

# Ensure /app exists and show its details
RUN mkdir -p /app
RUN echo "=== /app directory details ===" && ls -ld /app

# Diagnostics and robust user/group creation before chown
RUN cat /etc/group && cat /etc/passwd
RUN addgroup -g 1000 appuser 2>/dev/null || true
RUN adduser -D -u 1000 -G appuser appuser 2>/dev/null || true
RUN mkdir -p /app
RUN ls -ld /app
RUN cat /etc/group && cat /etc/passwd
RUN chown -R appuser:appuser /app

# Copy built files from builder stage
COPY --from=builder /build/dist ./dist

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000
ENV NODE_ENV=production
CMD ["serve", "-s", "dist", "-l", "3000"]