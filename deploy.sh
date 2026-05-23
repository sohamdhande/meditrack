#!/bin/bash
set -e

echo "🚀 MediTrack Vercel Deployment - Automated Setup"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Generate AUTH_SECRET
AUTH_SECRET=$(openssl rand -base64 32)

echo "${BLUE}📌 Step 1: Verify GitHub Repository${NC}"
echo "Current git remote:"
git remote -v || echo "No remote configured yet"
echo ""

echo "${BLUE}📌 Step 2: Ensure all changes are committed${NC}"
git status --short
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "${BLUE}📌 Step 3: Configure Neon PostgreSQL${NC}"
echo "1. Visit: https://console.neon.tech"
echo "2. Create a new project"
echo "3. Copy the connection string (looks like: postgresql://...)"
echo ""
read -p "Enter your Neon DATABASE_URL: " DATABASE_URL

if [[ -z "$DATABASE_URL" ]]; then
    echo "${YELLOW}❌ DATABASE_URL cannot be empty${NC}"
    exit 1
fi

echo ""
echo "${BLUE}📌 Step 4: Deploy to Vercel${NC}"
echo "Starting Vercel deployment..."
echo ""

# Run Vercel deploy with environment variables
vercel \
  --env DATABASE_URL="$DATABASE_URL" \
  --env AUTH_SECRET="$AUTH_SECRET" \
  --env NEXTAUTH_URL

echo ""
echo "${GREEN}✅ Deployment initiated!${NC}"
echo ""
echo "Your environment variables:"
echo "  DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "  AUTH_SECRET: ${AUTH_SECRET:0:20}..."
echo ""
echo "${BLUE}📌 Step 5: Verify Deployment${NC}"
echo ""
echo "After deployment completes, test with:"
echo "  ${GREEN}curl https://YOUR-VERCEL-URL/api/records/REC-10041${NC}"
echo ""
echo "Expected response: 401 (Unauthorized) - this means the API works!"
echo ""
echo "${GREEN}✨ Deployment complete! ${NC}"
echo ""
echo "Demo credentials:"
echo "  Email: james@meditrack.app"
echo "  Password: patient123"
echo ""
