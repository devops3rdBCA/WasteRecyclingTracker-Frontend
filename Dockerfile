FROM node:18-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /build/dist ./dist

# Add debugging output so you see exactly what's happening
RUN cat /etc/group; cat /etc/passwd

# 1. Only create group if it doesn't exist
RUN addgroup -g 1000 appuser 2>/dev/null || true

# 2. Only create user if it doesn't exist
RUN adduser -D -u 1000 -G appuser appuser 2>/dev/null || true

# 3. Show what users/groups exist now
RUN cat /etc/group; cat /etc/passwd

# 4. Make sure /app exists and set correct owner
RUN mkdir -p /app
RUN ls -ld /app
RUN chown -R appuser:appuser /app