#!/bin/sh
set -e

echo "🚀 Starting application initialization..."

# Function to wait for database
wait_for_db() {
  echo "⏳ Waiting for database to be ready..."

  # Extract host and port from DATABASE_URL
  # Format: postgresql://user:pass@host:port/db
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

  if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
    echo "⚠️  Could not parse DATABASE_URL, skipping database check"
    return 0
  fi

  # Wait for database (max 30 seconds)
  for i in $(seq 1 30); do
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
      echo "✅ Database is ready!"
      return 0
    fi
    echo "⏳ Waiting for database... ($i/30)"
    sleep 1
  done

  echo "⚠️  Database not responding, continuing anyway..."
}

# Run database migrations
run_migrations() {
  echo "🔄 Running database migrations..."

  if npx prisma migrate deploy; then
    echo "✅ Migrations completed successfully"
  else
    echo "❌ Migrations failed!"
    exit 1
  fi
}

# Seed essential data
seed_essentials() {
  echo "🌱 Seeding essential data..."

  # Check if essentials are already seeded (optional check)
  # You can add a custom check here if needed

  if npx tsx prisma/seed-essentials.ts; then
    echo "✅ Essential data seeded successfully"
  else
    echo "⚠️  Seeding essentials failed, continuing..."
  fi
}

# Seed production data (optional)
seed_production() {
  if [ "$SEED_PRODUCTION_DATA" = "true" ]; then
    echo "🌱 Seeding production data..."

    if npx tsx prisma/seed-production.ts; then
      echo "✅ Production data seeded successfully"
    else
      echo "⚠️  Seeding production data failed, continuing..."
    fi
  fi
}

# Main initialization sequence
main() {
  # Check if DATABASE_URL is set
  if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set!"
    exit 1
  fi

  # Wait for database (if nc is available)
  if command -v nc >/dev/null 2>&1; then
    wait_for_db
  else
    echo "⚠️  nc (netcat) not available, skipping database wait"
  fi

  # Run migrations only if SKIP_MIGRATIONS is not set
  if [ "$SKIP_MIGRATIONS" != "true" ]; then
    run_migrations
  else
    echo "⏭️  Skipping migrations (SKIP_MIGRATIONS=true)"
  fi

  # Seed data only if SKIP_SEEDING is not set
  if [ "$SKIP_SEEDING" != "true" ]; then
    seed_essentials
    seed_production
  else
    echo "⏭️  Skipping seeding (SKIP_SEEDING=true)"
  fi

  echo "🎉 Initialization complete! Starting application..."
  echo ""
}

# Run initialization
main

# Start the Next.js server
exec node server.js
