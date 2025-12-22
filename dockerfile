# ============================================
# Multi-stage build for Next.js with Prisma
# ============================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema
COPY prisma ./prisma/

# Install dependencies with retry logic for network issues
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5 && \
    npm ci --prefer-offline --no-audit

# ============================================
# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy all source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Set NODE_ENV to production for optimized build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# ============================================
# Stage 3: Runner (Production)
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder (includes minimal node_modules and generated Prisma client)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy messages for i18n
COPY --chown=nextjs:nodejs messages ./messages

# Copy Prisma schema (needed for runtime migrations like 'prisma migrate deploy')
COPY --chown=nextjs:nodejs prisma ./prisma/

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use standalone server.js instead of npm start (faster startup)
CMD ["node", "server.js"]
