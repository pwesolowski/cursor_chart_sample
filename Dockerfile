# Multi-stage build for optimized production image

# Stage 1: Build the application
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Process Excel data if it exists (run prebuild script)
# This converts data/sagKlasseReport.xlsx to public/klasseData.json
RUN if [ -f data/sagKlasseReport.xlsx ]; then \
      echo "Processing Excel data..."; \
      node scripts/processKlasseData.js; \
    else \
      echo "Warning: data/sagKlasseReport.xlsx not found. Skipping data processing."; \
    fi

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

