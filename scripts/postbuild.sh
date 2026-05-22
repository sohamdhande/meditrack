#!/bin/bash
set -e

# This script runs AFTER npm install and npm run build
# and has full access to environment variables

echo "🗄️  Syncing Prisma schema with database..."
npx prisma db push --skip-generate --accept-data-loss

echo "✅ Database schema synced!"
