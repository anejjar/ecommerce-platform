# Docker Deployment Guide

This document explains how to deploy the e-commerce platform using Docker with automatic database migrations and seeding.

## 🚀 Quick Start

### Basic Deployment

```bash
docker build -t ecommerce-platform .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  ecommerce-platform
```

### Using Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/ecommerce
      NEXTAUTH_SECRET: your-secret-here
      NEXTAUTH_URL: http://localhost:3000
      # Optional: Seed production data
      SEED_PRODUCTION_DATA: "true"
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ecommerce
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | NextAuth.js secret for encryption | `your-random-secret-here` |
| `NEXTAUTH_URL` | Public URL of your application | `https://yourdomain.com` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SKIP_MIGRATIONS` | `false` | Set to `true` to skip database migrations on startup |
| `SKIP_SEEDING` | `false` | Set to `true` to skip data seeding on startup |
| `SEED_PRODUCTION_DATA` | `false` | Set to `true` to seed production sample data |
| `NODE_ENV` | `production` | Node environment (automatically set) |
| `PORT` | `3000` | Port the application listens on |

## 📋 Startup Sequence

When the container starts, it automatically:

1. **Database Health Check** - Waits for database to be ready (max 30 seconds)
2. **Run Migrations** - Executes `prisma migrate deploy` to apply database schema changes
3. **Seed Essential Data** - Runs `prisma/seed-essentials.ts` to populate required data
4. **Seed Production Data** - (Optional) Runs `prisma/seed-production.ts` if `SEED_PRODUCTION_DATA=true`
5. **Start Application** - Launches the Next.js server

### Startup Logs

You'll see logs like this:

```
🚀 Starting application initialization...
⏳ Waiting for database to be ready...
✅ Database is ready!
🔄 Running database migrations...
✅ Migrations completed successfully
🌱 Seeding essential data...
✅ Essential data seeded successfully
🎉 Initialization complete! Starting application...
```

## 🎛️ Advanced Usage

### Skip Migrations (Use Existing Database)

If your database is already migrated:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname" \
  -e SKIP_MIGRATIONS="true" \
  ecommerce-platform
```

### Skip Seeding (Database Already Seeded)

If your database already has data:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname" \
  -e SKIP_SEEDING="true" \
  ecommerce-platform
```

### Enable Production Sample Data

To seed sample products, categories, and demo content:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname" \
  -e SEED_PRODUCTION_DATA="true" \
  ecommerce-platform
```

### Development Mode (All Data)

For local development with full sample data:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce" \
  -e SEED_PRODUCTION_DATA="true" \
  -e NEXTAUTH_SECRET="dev-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  ecommerce-platform
```

## 🏗️ Coolify Deployment

### Environment Variables in Coolify

1. Go to your application in Coolify
2. Navigate to "Environment Variables"
3. Add the following variables:

```env
DATABASE_URL=postgresql://user:password@your-db-host:5432/dbname
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
SEED_PRODUCTION_DATA=false
```

### First Deployment

For the first deployment, you may want to seed production data:

```env
SEED_PRODUCTION_DATA=true
```

After the first successful deployment, you can set it back to `false` to avoid re-seeding on every restart.

### Separate Migration Job (Advanced)

If you prefer to run migrations as a separate job:

1. Create a one-time job in Coolify:
   ```bash
   npx prisma migrate deploy && npx tsx prisma/seed-essentials.ts
   ```

2. Set `SKIP_MIGRATIONS=true` and `SKIP_SEEDING=true` in your main app

## 🔍 Troubleshooting

### Migration Fails

**Error:** `Migrations failed!`

**Solutions:**
- Check DATABASE_URL is correct
- Verify database is accessible from container
- Check database user has proper permissions
- Review migration files in `prisma/migrations/`

### Seeding Fails

**Error:** `Seeding essentials failed, continuing...`

**Solutions:**
- Check if data already exists (seeding is idempotent but may fail on duplicates)
- Review seed script: `prisma/seed-essentials.ts`
- Check database logs for constraint violations
- Set `SKIP_SEEDING=true` if database is already seeded

### Database Connection Timeout

**Error:** `Database not responding, continuing anyway...`

**Solutions:**
- Increase database startup time (add `depends_on` in docker-compose)
- Check network connectivity between containers
- Verify DATABASE_URL hostname is correct
- Use Docker network aliases for inter-container communication

### Prisma Version Mismatch

**Error:** `Prisma schema loaded from prisma/schema.prisma`

**Solutions:**
- The Dockerfile now uses Prisma from package.json (6.19.0)
- Prisma client is generated during build, not runtime
- No manual generation needed in runner stage

## 📦 Build Optimizations

The Dockerfile includes several optimizations:

- ✅ **Standalone Output** - Minimal production bundle (~400MB vs ~1.5GB)
- ✅ **Multi-stage Build** - Separates dependencies, build, and runtime
- ✅ **Network Retry Logic** - Handles transient npm registry failures
- ✅ **No Turbopack** - Uses stable Webpack for production builds
- ✅ **Dynamic Rendering** - Reduces static generation from 250+ pages to ~0
- ✅ **Build Time** - Reduced from 15-20min to 3-5min

## 📚 Related Scripts

Available npm scripts for manual operations:

```bash
# Migrations
npm run db:push          # Push schema changes (dev)
npm run db:deploy        # Deploy migrations + seed (prod)
npm run db:reset         # Reset database (dev only)

# Seeding
npm run db:seed:essentials   # Seed essential data
npm run db:seed:production   # Seed production sample data
npm run db:seed:features     # Seed feature flags
npm run db:seed:loyalty      # Seed loyalty program data
```

## 🔐 Security Notes

- Never commit `.env` files with real credentials
- Use strong `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- Rotate secrets regularly
- Use database users with minimal required permissions
- Enable SSL for database connections in production

## 📈 Monitoring

The entrypoint script provides detailed logs for:
- Database connectivity
- Migration status
- Seeding progress
- Application startup

All logs are prefixed with emoji indicators:
- 🚀 Startup
- ⏳ Waiting
- ✅ Success
- ❌ Error
- ⚠️ Warning
- 🔄 Processing
- 🌱 Seeding
- 🎉 Complete
