# MediTrack - Vulnerable Patient Records Application

> A deliberately vulnerable patient records application for cybersecurity education and VibeAudit scanning demonstrations.

## ⚠️ Security Notice

**MediTrack is intentionally vulnerable.** It is designed as a demonstration target for security scanning tools like VibeAudit. **DO NOT use this in production with real patient data.**

The application intentionally lacks:
- Proper access control on patient records
- CSRF protection
- Input validation
- SQL injection prevention (through design)
- Proper authorization checks

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- SQLite 3 (included with most systems)

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Create and seed local database
npx prisma db push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

**Victim Account:**
- Email: `james@meditrack.app`
- Password: `patient123`

**Attacker Account:**
- Email: `attacker@meditrack.app`
- Password: `attacker123`

## 📦 Deployment to Vercel

### Step 1: Set Up Neon PostgreSQL Database

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@ep-xxx/dbname?sslmode=require`)

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# When prompted, add environment variables:
DATABASE_URL="<your-neon-connection-string>"
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://your-vercel-app-url.vercel.app"
```

### Step 3: Verify Deployment

```bash
# Check that the API endpoint works
curl https://your-vercel-app-url.vercel.app/api/records/REC-10041

# You should get a 401 (Unauthorized) error
# This is expected - you need to authenticate first
```

### Step 4: Authenticate and Test

```bash
# Login to get session
curl -X POST https://your-vercel-app-url.vercel.app/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"james@meditrack.app","password":"patient123"}'

# Then access the patient record
# (Session cookie will be in the response)
curl https://your-vercel-app-url.vercel.app/api/records/REC-10041 \
  -H "Cookie: <your-session-cookie>"
```

### Environment Variables Required

| Variable | Example | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `postgresql://...` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` | Session signing key |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |

## 🔍 For VibeAudit Scanning

After deployment to Vercel:

1. **Get the deployed URL** from Vercel dashboard
2. **Configure VibeAudit** to scan: `https://your-app.vercel.app`
3. **VibeAudit will test the API endpoints** including:
   - `GET /api/records/[id]` - Patient record access (vulnerable)
   - `POST /api/auth/callback/credentials` - Authentication endpoint

### Demo Record Available

The following record is automatically seeded in production:

```json
{
  "id": "...",
  "recordId": "REC-10041",
  "fullName": "James Okafor",
  "dateOfBirth": "1988-03-14",
  "email": "j.okafor.personal@gmail.com",
  "phone": "+91-98201-44312",
  "diagnosis": "Generalized Anxiety Disorder (GAD)",
  "medications": "Sertraline 50mg — once daily, Clonazepam 0.5mg — as needed",
  "insurancePolicyNumber": "SHI-2024-887432",
  "notes": "Patient requested records not be shared with employer."
}
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Patient Records
- `GET /api/records/[id]` - Get specific patient record (requires session)
- `GET /api/dashboard` - Dashboard data (requires session)

### Vulnerable Endpoints
These endpoints are intentionally vulnerable to demonstrate security issues:
- `/api/records/[id]` - No ownership verification (any authenticated user can access any record)

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📚 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Neon) / SQLite (local)
- **ORM:** Prisma
- **Authentication:** Auth.js / NextAuth.js
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **Forms:** React Hook Form

## 🗄️ Database Schema

### Users Table
```sql
- id: String (Primary Key)
- email: String (Unique)
- password: String (bcrypt hashed)
- name: String
```

### PatientRecords Table
```sql
- id: String (Primary Key)
- recordId: String (Unique) - e.g., "REC-10041"
- recordUserId: String (Foreign Key to Users)
- fullName: String
- dateOfBirth: String
- email: String
- phone: String
- diagnosis: String
- medications: String
- insurancePolicyNumber: String
- notes: String
```

## 🚨 Known Vulnerabilities

These vulnerabilities are **intentional** and part of the educational demo:

1. **Broken Access Control** - Any authenticated user can access any patient record
2. **Weak Authentication** - Credentials are basic username/password
3. **No Rate Limiting** - No protection against brute force
4. **Information Disclosure** - API returns full sensitive data
5. **Missing Authorization** - No role-based access control

## 📝 License

Educational use only. Do not use with real patient data.

## 🤝 Contributing

This is a demonstration project. For security improvements in production systems, follow HIPAA, GDPR, and other compliance requirements.

---

**Deploy now:** `vercel`
