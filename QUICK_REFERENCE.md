# MediTrack Quick Reference Card

## 🎯 The Problem (Explained Simply)

| What Happened | Root Cause | Impact |
|---------------|-----------|--------|
| HTTP 500 on `/api/records/REC-10041` | SQLite database file lost on each deploy | No persistent data |
| Prisma client errors | Client code not generated before build | Runtime failures |
| Auth sessions broken | NextAuth not configured for production domains | Can't login in production |
| Data randomly disappeared | Seeding deletes all data on every deploy | Unpredictable state |

---

## ✅ The Solution (What Changed)

### 1. Database: SQLite → PostgreSQL
```diff
- provider = "sqlite"
- url      = "file:./db.sqlite"  # Lost on every deploy!
+ provider = "postgresql"
+ url      = env("DATABASE_URL")  # Persistent!
```

### 2. Build Script: Explicit Migrations
```diff
- "build": "next build"
+ "build": "prisma generate && prisma db push --skip-generate && next build"
```

### 3. Auth Configuration: Production-Ready
```diff
export const { handlers, auth } = NextAuth({
+  basePath: '/api/auth',
+  trustHost: true,  // Vercel needs this!
   // ... rest of config
});
```

### 4. Seeding: Safe for Multiple Runs
```diff
async function main() {
+  const existingUsers = await prisma.user.count();
+  if (existingUsers > 0) {
+    console.log('✅ Already seeded, skipping...');
+    return;
+  }
   // ... seed logic
}
```

---

## 🚀 Deployment (Copy-Paste)

### Create GitHub Repo
```bash
git remote add origin https://github.com/YOUR-USERNAME/meditrack.git
git branch -M main
git push -u origin main
```

### Create Neon Database
```bash
# Visit: https://console.neon.tech
# 1. Create project
# 2. Copy connection string
# Save it for next step
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel \
  --env DATABASE_URL="postgresql://..." \
  --env AUTH_SECRET="$(openssl rand -base64 32)" \
  --env NEXTAUTH_URL="https://your-app.vercel.app"
```

### Test It Works
```bash
curl https://your-app.vercel.app/api/records/REC-10041
# Response: {"error":"Unauthorized"}  ✅ WORKS!
```

---

## 🔑 Key Files Modified

| File | What Changed | Why |
|------|--------------|-----|
| `prisma/schema.prisma` | SQLite → PostgreSQL | Persistent storage |
| `package.json` | Build includes migrations | Automatic schema sync |
| `auth.ts` | Added `trustHost` | Production domains work |
| `.env.example` | PostgreSQL credentials | Clear setup docs |
| `vercel.json` | NEW: Build configuration | Vercel knows what to do |

---

## 🧪 What Was Preserved

These vulnerabilities **intentionally remain** for VibeAudit:
- ✅ No ownership checks on patient records
- ✅ Any authenticated user can access any record
- ✅ Full sensitive data exposed in API
- ✅ No rate limiting

**This is the whole point of the demo!**

---

## 📊 Before vs After

### Before Deployment
```
Request → Netlify → SQLite file (ephemeral) → File doesn't exist → 500 Error
```

### After Deployment
```
Request → Vercel → Prisma → Neon PostgreSQL (persistent) → Returns JSON ✅
```

---

## 🎓 Demo Credentials

```
Victim:
  Email: james@meditrack.app
  Password: patient123

Attacker:
  Email: attacker@meditrack.app  
  Password: attacker123

Record: REC-10041 (James Okafor's full medical history)
```

---

## 📍 Troubleshooting

| Error | Solution |
|-------|----------|
| `HTTP 500` | Check Vercel logs, verify DATABASE_URL |
| `ECONNREFUSED` | DATABASE_URL incorrect or missing |
| `{"error":"Unauthorized"}` | This is CORRECT - need session |
| Build fails | Check that all 3 env vars set in Vercel |
| Seeding fails | Run `npm run db:seed` manually |

---

## 📚 Documentation Files

- **DEPLOYMENT.md** - Full step-by-step guide
- **FIX_SUMMARY.md** - Technical details of what was broken
- **VERIFICATION.md** - Complete checklist
- **README.md** - Original project docs

---

## ⏱️ Time to Deploy

1. **Push to GitHub**: 2 min
2. **Set up Neon**: 5 min
3. **Deploy to Vercel**: 5 min
4. **Verify**: 2 min

**Total: ~15 minutes**

---

## ✨ Success Criteria

After deployment:
- ✅ App loads at your Vercel URL
- ✅ Login works with demo credentials
- ✅ `/api/records/REC-10041` returns patient data
- ✅ VibeAudit can scan the vulnerability
- ✅ Zero HTTP 500 errors

---

**Status: Ready to deploy! 🚀**

