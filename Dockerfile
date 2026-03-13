# Multi-stage build for Nova Mail
FROM node:20-alpine AS builder

# Frontend build stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install nginx
RUN apk add --no-cache nginx

# Copy frontend build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy backend
WORKDIR /app
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Configure nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 443

# Start both nginx and backend
CMD ["sh", "-c", "nginx && cd /app/backend && node server.js"]
