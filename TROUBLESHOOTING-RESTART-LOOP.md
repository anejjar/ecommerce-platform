# Docker Container Restart Loop - Troubleshooting Guide

## 🔴 Problem: Container Creates and Exits Every Second

If you see containers being created and exited continuously (every 1-2 seconds), the container is crashing immediately on startup and Docker is restarting it.

---

## 🔍 Step 1: Check Container Logs

**SSH into your server:**
```bash
ssh -p 2222 deployer@YOUR_SERVER_IP
```

**View logs of the crashed containers:**
```bash
# Get the most recent container (even if exited)
docker ps -a --filter name=ecommerce-app | head -5

# View logs of the last exited container
docker logs $(docker ps -aq --filter name=ecommerce-app | head -1)
```

---

## 🐛 Common Causes & Solutions

### 1. Missing DATABASE_URL

**Symptom in logs:**
```
❌ DATABASE_URL is not set!
```

**Solution:**
1. Go to Dokploy: Application → Environment
2. Add:
```bash
DATABASE_URL=mysql://ecommerce_user:YOUR_PASSWORD@ecommerce-db:3306/ecommerce
```
3. Click Save
4. **Redeploy** (important!)

---

### 2. Database Not Running or Unreachable

**Symptom in logs:**
```
⏳ Waiting for database... (1/30)
⏳ Waiting for database... (2/30)
...
⚠️ Database not responding, continuing anyway...
🔄 Running database migrations...
Error: Can't reach database server at `ecommerce-db:3306`
```

**Check if database is running:**
```bash
docker ps | grep ecommerce-db
```

**If database is not running:**
```bash
# Check database logs
docker logs $(docker ps -aq --filter name=ecommerce-db | head -1)

# Restart database
docker restart ecommerce-db

# Or in Dokploy: Database service → Restart
```

**If database has wrong name:**
- Verify your DATABASE_URL uses the correct container name
- Default is `ecommerce-db` (must match database service name in Dokploy)

---

### 3. Migration Fails

**Symptom in logs:**
```
🔄 Running database migrations...
Error: P3009: migrate found failed migration
❌ Migrations failed!
```

**Solution:**

**Option A: Reset and retry migrations**
```bash
# Stop the app temporarily to prevent restart loop
docker stop ecommerce-app

# Get database container ID
docker ps | grep ecommerce-db

# Connect to database
docker exec -it ecommerce-db mysql -u root -p ecommerce

# In MySQL prompt, drop and recreate database
DROP DATABASE ecommerce;
CREATE DATABASE ecommerce;
EXIT;

# Restart app (migrations will run again)
docker start ecommerce-app
```

**Option B: Skip migrations temporarily**
```bash
# In Dokploy: Application → Environment → Add:
SKIP_MIGRATIONS=true

# Redeploy
# Then fix migrations manually and remove SKIP_MIGRATIONS
```

---

### 4. Missing server.js (Standalone Build Issue)

**Symptom in logs:**
```
❌ ERROR: server.js not found!
📁 Files in current directory:
total 8
drwxr-xr-x  ...
```

**Cause:** The standalone build didn't create server.js

**Solution:**

1. **Verify next.config.ts has standalone output:**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',  // ← This must be present
  // ...
};
```

2. **Test build locally:**
```bash
npm run build

# Check if standalone was created
ls -la .next/standalone/

# You should see server.js
```

3. **If server.js is missing locally:**
   - Check for build errors
   - Verify Next.js version is compatible (16.0.3+)
   - Try: `rm -rf .next && npm run build`

4. **Rebuild in Dokploy:**
   - Application → Advanced → Clean Build Cache
   - Redeploy

---

### 5. Missing Node Modules or Dependencies

**Symptom in logs:**
```
Error: Cannot find module 'xyz'
```

**Solution:**

Check Dockerfile is copying node_modules:
```dockerfile
# Should be in Dockerfile line ~75
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
```

If missing, rebuild with:
```bash
# In Dokploy
Application → Advanced → Clean Build Cache → Rebuild
```

---

### 6. Permission Issues

**Symptom in logs:**
```
Error: EACCES: permission denied
```

**Check entrypoint script permissions:**
```bash
# On server
docker run --rm ecommerce-app:latest ls -la /app/docker-entrypoint.sh

# Should show: -rwxr-xr-x (executable)
```

**If not executable, check Dockerfile:**
```dockerfile
# Should be around line 81-82
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh && chown nextjs:nodejs docker-entrypoint.sh
```

---

### 7. Environment Variable Issues

**Missing NEXTAUTH_SECRET:**
```
Error: Please provide NEXTAUTH_SECRET
```

**Solution:**
```bash
# Generate secret
openssl rand -base64 32

# Add to Dokploy: Application → Environment
NEXTAUTH_SECRET=your_generated_secret_here

# Redeploy
```

**Missing Cloudinary credentials:**
```
Error: Cloudinary configuration missing
```

**Solution:**
```bash
# Add to Dokploy: Application → Environment
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redeploy
```

---

## 🛠️ Emergency Fixes

### Quick Stop Restart Loop

**Option 1: Disable auto-restart temporarily**
```bash
# SSH into server
docker update --restart=no ecommerce-app
```

**Option 2: Skip problematic steps**
```bash
# In Dokploy: Application → Environment → Add:
SKIP_MIGRATIONS=true
SKIP_SEEDING=true

# Redeploy
```

### Get Into Running Container (Before It Crashes)

```bash
# Override entrypoint to keep container running
docker run -it --rm \
  --entrypoint /bin/sh \
  --env-file .env \
  ecommerce-app:latest

# Now you can debug inside the container
ls -la
cat docker-entrypoint.sh
node server.js
```

---

## 📋 Full Diagnostic Checklist

Run these commands to gather full diagnostic info:

```bash
# 1. Check last 5 container attempts
docker ps -a --filter name=ecommerce-app --format "table {{.ID}}\t{{.Status}}\t{{.CreatedAt}}" | head -6

# 2. Get logs from most recent attempt
docker logs $(docker ps -aq --filter name=ecommerce-app | head -1) 2>&1

# 3. Check database is running
docker ps --filter name=ecommerce-db

# 4. Check database logs
docker logs $(docker ps -q --filter name=ecommerce-db) --tail=50

# 5. Check network connectivity
docker network ls | grep ecommerce

# 6. Test database connection from any container
docker run --rm --network=dokploy-network mysql:8 \
  mysql -h ecommerce-db -u ecommerce_user -p -e "SELECT 1"

# 7. Check environment variables are set
docker inspect $(docker ps -aq --filter name=ecommerce-app | head -1) | grep -A 20 Env
```

---

## 🔄 Clean Slate Approach

If nothing works, start fresh:

```bash
# 1. Stop and remove all containers
docker stop ecommerce-app ecommerce-db
docker rm ecommerce-app ecommerce-db

# 2. In Dokploy, delete both services

# 3. Recreate database first
# Project → Add Service → Database → MySQL
# Name: ecommerce-db
# Save credentials!

# 4. Recreate application
# Project → Add Service → Application
# Name: ecommerce-app

# 5. Add ALL environment variables
DATABASE_URL=mysql://...
NEXTAUTH_URL=https://...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# 6. Deploy
```

---

## 📞 Still Stuck?

**Collect this information:**

1. **Last 100 lines of container logs:**
```bash
docker logs $(docker ps -aq --filter name=ecommerce-app | head -1) --tail=100 > container-logs.txt
```

2. **Container inspection:**
```bash
docker inspect $(docker ps -aq --filter name=ecommerce-app | head -1) > container-inspect.json
```

3. **Database status:**
```bash
docker ps --filter name=ecommerce-db > db-status.txt
docker logs ecommerce-db --tail=50 >> db-status.txt
```

4. **Environment variables** (redact secrets):
```bash
docker inspect ecommerce-app | grep -A 30 Env > env-vars.txt
# Redact passwords before sharing!
```

Then share these files for debugging assistance.

---

## ✅ Prevention

**After fixing, prevent future issues:**

1. **Always check logs before deploying:**
```bash
# Test locally first
docker build -t test-build .
docker run --rm --env-file .env test-build
```

2. **Use SKIP flags during debugging:**
```bash
SKIP_MIGRATIONS=true  # Skip migrations
SKIP_SEEDING=true     # Skip seeding
```

3. **Enable detailed logging:**
```bash
DEBUG=*  # Enable all debug logs
```

4. **Set up monitoring:**
   - Dokploy → Application → Monitoring
   - Enable restart alerts

---

**Document Version:** 1.0
**Last Updated:** December 2024
