
# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:24-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies with network retry configuration
RUN npm ci \
    --fetch-retries=5 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 \
    --fetch-timeout=300000


# ==========================================
# Stage 2: Build
# ==========================================
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# Public environment variables
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost/api
ARG NEXT_PUBLIC_API_TIMEOUT=30000

ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ARG NEXT_PUBLIC_SITE_URL

# Make variables available during Next.js build
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_API_TIMEOUT=${NEXT_PUBLIC_API_TIMEOUT}

ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Copy installed dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY . .

# Ensure public directory exists
RUN mkdir -p public

# Build Next.js application
RUN npm run build


# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run as non-root user
USER nextjs

EXPOSE 3000

# Start Next.js production server
CMD ["node", "server.js"]
