#!/bin/bash
set -e

echo "🔨 MediTrack Build Script"
echo "========================"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Apply migrations (if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
  echo "🗄️  Running database migrations..."
  npx prisma migrate deploy || npx prisma db push --skip-generate
else
  echo "⚠️  DATABASE_URL not set, skipping migrations"
fi

# Build Next.js
echo "🏗️  Building Next.js..."
npx next build

echo "✅ Build complete!"
