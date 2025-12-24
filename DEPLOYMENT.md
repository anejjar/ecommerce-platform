# E-Commerce Platform - Dokploy Deployment Guide

Quick reference for deploying this e-commerce platform on Dokploy.

## 🚀 Quick Deploy (Already Have Dokploy?)

If you already have Dokploy running, follow these steps:

### 1. Create MySQL Database

**Dokploy Dashboard** → Create Project → `ecommerce-platform` → Add Service → Database → MySQL

```
Name: ecommerce-db
Database: ecommerce
Username: ecommerce_user
Password: [auto-generate and save]
```

**Connection String:**
```
mysql://ecommerce_user:YOUR_PASSWORD@ecommerce-db:3306/ecommerce
```

---

### 2. Create Application

**Project** → Add Service → Application → `ecommerce-app`

**Repository:**
- Provider: GitHub
- Repository: Your repo
- Branch: main
- Build Path: /

**Build Type:** Dockerfile (NOT Nixpacks!)

---

### 3. Environment Variables

Copy and configure:

```bash
# ===== REQUIRED =====

# Database (from Step 1)
DATABASE_URL=mysql://ecommerce_user:YOUR_PASSWORD@ecommerce-db:3306/ecommerce

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=YOUR_32_CHAR_RANDOM_STRING

# Cloudinary (for image uploads - get free account at cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ===== OPTIONAL (can add later) =====

# Email (for order notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourstore.com

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Your Store Name

# Seeding Control
SEED_PRODUCTION_DATA=false
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 4. Deploy

**Application** → Deployments → **Deploy**

**Watch for these phases (5-8 minutes):**
1. ✅ Building Docker image (3-5 min)
2. ✅ Starting container (30 sec)
3. ✅ Running migrations automatically
4. ✅ Seeding database automatically
5. ✅ Application ready

---

### 5. Add Domain

**Application** → Domains → Add Domain

```
Host: yourdomain.com
Port: 3000
HTTPS: Enabled
Certificate: Let's Encrypt
```

---

### 6. Enable Auto-Deploy

**Application** → General → Auto Deploy → **Enable**

---

## 📋 What Gets Deployed

### Automatic Setup (via docker-entrypoint.sh)

When you deploy, the system automatically:

1. **Waits for database** to be ready
2. **Runs Prisma migrations** (`prisma migrate deploy`)
3. **Seeds essential data**:
   - Admin user (check `prisma/seed-essentials.ts` for credentials)
   - Product categories
   - System settings
   - Payment methods
   - Shipping options
4. **Starts Next.js** application

### What You Need to Do Manually

After first deployment:
- Access admin panel: `https://yourdomain.com/admin`
- Login with seeded admin credentials
- **Change admin password immediately**
- Configure store settings
- Add products
- Set up payment gateway (if using Stripe)

---

## 🔧 Troubleshooting

### Container Crashes on Startup

**Check logs:**
```bash
ssh deployer@YOUR_SERVER_IP
docker logs $(docker ps -aq -f name=ecommerce-app) | tail -100
```

**Common issues:**
- Missing DATABASE_URL → Add to environment variables
- Wrong database hostname → Use `ecommerce-db` not `localhost`
- Missing NEXTAUTH_SECRET → Generate and add
- Database not running → Check database container

---

### Migration Fails

```bash
# SSH into server
ssh deployer@YOUR_SERVER_IP

# Check migration status
docker exec $(docker ps -q -f name=ecommerce-app) npx prisma migrate status

# View Prisma errors
docker logs $(docker ps -q -f name=ecommerce-app) | grep -i prisma
```

**Common fixes:**
- Ensure DATABASE_URL uses MySQL (not PostgreSQL)
- Verify database is running: `docker ps | grep ecommerce-db`
- Check database connectivity: `docker exec ecommerce-app nc -zv ecommerce-db 3306`

---

### Seeding Fails

Non-critical - app will still run without seed data.

**Manually run seed:**
```bash
docker exec -it $(docker ps -q -f name=ecommerce-app) \
  npx tsx prisma/seed-essentials.ts
```

---

### Can't Login to Admin Panel

**Check if admin user exists:**
```bash
# Connect to database
docker exec -it $(docker ps -q -f name=ecommerce-db) \
  mysql -u ecommerce_user -p ecommerce

# Query users
SELECT email, role FROM User WHERE role = 'ADMIN';
EXIT;
```

**If no admin exists, create manually:**
```bash
docker exec -it $(docker ps -q -f name=ecommerce-app) \
  npx tsx prisma/seed-essentials.ts
```

---

### Environment Variables Not Applied

After changing environment variables, you **MUST redeploy**:

1. Application → Environment → Save
2. Application → Deployments → **Deploy**

---

## 🗄️ Database Management

### Backup Database

**In Dokploy:**

Database Service → Backups → Configure

- Frequency: Daily
- Retention: 7 days
- Destination: S3 (recommended) or Local

**Test backup immediately after setup!**

### Manual Database Access

```bash
# SSH into server
ssh deployer@YOUR_SERVER_IP

# Connect to MySQL
docker exec -it $(docker ps -q -f name=ecommerce-db) \
  mysql -u ecommerce_user -p ecommerce
```

### Common Queries

```sql
-- View all products
SELECT id, name, price FROM Product;

-- View recent orders
SELECT * FROM `Order` ORDER BY createdAt DESC LIMIT 10;

-- Check users
SELECT id, email, role FROM User;

-- Exit
EXIT;
```

---

## 📊 Monitoring

### Check Application Health

```bash
# SSH into server
ssh deployer@YOUR_SERVER_IP

# Check containers
docker ps

# View app logs (live)
docker logs -f $(docker ps -q -f name=ecommerce-app)

# Check resources
docker stats
```

### Server Resources

```bash
# Disk space
df -h

# Memory
free -h

# CPU and processes
htop
```

---

## 🔄 Updating Application

### Automatic Updates (Recommended)

Enable auto-deploy (Step 6 above), then just:

```bash
git push origin main
```

Dokploy automatically:
- Pulls latest code
- Rebuilds Docker image
- Runs migrations
- Redeploys application

### Manual Deployment

**Dokploy Dashboard** → Application → Deployments → **Deploy**

---

## ⚠️ Important Notes

### Database Must Be Created First

Always create the MySQL database **BEFORE** deploying the application. The app cannot start without a database connection.

### Use Dockerfile Build Type

This project requires **Dockerfile** build type (NOT Nixpacks). The Dockerfile includes:
- Prisma client generation
- Multi-stage build optimization
- Entrypoint script for migrations

### Migrations Run Automatically

Every deployment runs `prisma migrate deploy` automatically via `docker-entrypoint.sh`. No manual migration needed.

### Seeding is Idempotent

The seed scripts are designed to be run multiple times safely. They won't duplicate data.

### Environment Variables

Changes to environment variables require a **full redeploy** to take effect. Restarting the container is not enough.

---

## 📚 Full Documentation

For complete VPS setup, SSL configuration, and advanced topics, see:

**[Dokploy.md](./Dokploy.md)** - Complete deployment guide from zero

---

## 🆘 Need Help?

### Check Logs First

```bash
# Application logs
docker logs $(docker ps -q -f name=ecommerce-app) --tail=100

# Database logs
docker logs $(docker ps -q -f name=ecommerce-db) --tail=100
```

### Common Issues

1. **Container won't start**: Check DATABASE_URL and NEXTAUTH_SECRET
2. **Migration fails**: Verify database is MySQL and running
3. **Can't access domain**: Check DNS and SSL certificate
4. **Images won't upload**: Verify Cloudinary credentials

### Quick Diagnostic

```bash
# Full health check
docker ps                                          # All containers running?
docker logs ecommerce-app --tail=50               # Any errors?
docker exec ecommerce-app nc -zv ecommerce-db 3306 # Database accessible?
docker exec ecommerce-app npx prisma migrate status # Migrations applied?
```

---

**Version:** 1.0
**Last Updated:** December 2024
**Project:** E-Commerce Platform
