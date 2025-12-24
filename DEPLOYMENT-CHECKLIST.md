# E-Commerce Platform - Deployment Checklist

Use this checklist to ensure smooth deployment on Dokploy.

---

## ☑️ Pre-Deployment

### Accounts & Credentials

- [ ] **Dokploy** installed and accessible at `https://dokploy.yourdomain.com`
- [ ] **GitHub** repository ready and accessible
- [ ] **Cloudinary account** created (https://cloudinary.com)
  - [ ] Cloud Name copied
  - [ ] API Key copied
  - [ ] API Secret copied
- [ ] **Domain name** pointing to your server IP
- [ ] **SSL certificate** working on Dokploy panel

### Generate Secrets

- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Save all credentials in secure password manager

---

## ☑️ Step 1: Create MySQL Database

**Dokploy Dashboard** → Create Project

- [ ] Click "Create Project"
- [ ] Project Name: `ecommerce-platform`
- [ ] Click "Create"

**Add Database Service**

- [ ] Click project → "Add Service" → "Database"
- [ ] Select "MySQL"
- [ ] Name: `ecommerce-db`
- [ ] Database Name: `ecommerce`
- [ ] Username: `ecommerce_user`
- [ ] User Password: Click generate icon → **SAVE THIS PASSWORD**
- [ ] Root Password: Click generate icon → **SAVE THIS PASSWORD**
- [ ] Click "Create"
- [ ] Wait 30-60 seconds for container to start
- [ ] Verify running: Green status indicator

**Note Connection String:**
```
mysql://ecommerce_user:YOUR_PASSWORD@ecommerce-db:3306/ecommerce
```
- [ ] Connection string saved ✓

---

## ☑️ Step 2: Create Application Service

**Add Application Service**

- [ ] In project → "Add Service" → "Application"
- [ ] Name: `ecommerce-app`
- [ ] Click "Create"

---

## ☑️ Step 3: Configure Repository

**General Tab**

- [ ] Provider: Select "GitHub"
- [ ] Repository: Select your repo from dropdown
- [ ] Branch: `main` (or your default branch)
- [ ] Build Path: `/`
- [ ] Click "Save"

---

## ☑️ Step 4: Configure Build Settings

**General Tab → Build Type Section**

- [ ] Build Type: Select "Dockerfile" (NOT Nixpacks!)
- [ ] Dockerfile Path: `Dockerfile` (leave default)
- [ ] Click "Save"

---

## ☑️ Step 5: Configure Environment Variables

**Environment Tab**

Copy and paste, replacing values:

```bash
# Database
DATABASE_URL=mysql://ecommerce_user:YOUR_PASSWORD@ecommerce-db:3306/ecommerce

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App Config
NEXT_PUBLIC_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Your Store Name
```

**Verify all values:**

- [ ] DATABASE_URL: Uses `ecommerce-db` hostname ✓
- [ ] DATABASE_URL: Includes correct password ✓
- [ ] NEXTAUTH_URL: Uses `https://` ✓
- [ ] NEXTAUTH_URL: Matches your domain exactly ✓
- [ ] NEXTAUTH_SECRET: 32+ characters ✓
- [ ] Cloudinary Cloud Name: Correct ✓
- [ ] Cloudinary API Key: Correct ✓
- [ ] Cloudinary API Secret: Correct ✓
- [ ] NEXT_PUBLIC_URL: Matches NEXTAUTH_URL ✓

- [ ] Click "Save"

---

## ☑️ Step 6: Deploy Application

**Deployments Tab**

- [ ] Click "Deploy" button
- [ ] Wait for build to start

**Monitor Build Progress (5-8 minutes):**

- [ ] Phase 1: Cloning repository ✓
- [ ] Phase 2: Building Docker image (3-5 min) ✓
- [ ] Phase 3: Starting container ✓
- [ ] Phase 4: Waiting for database ✓
- [ ] Phase 5: Running migrations ✓
- [ ] Phase 6: Seeding database ✓
- [ ] Phase 7: Application ready ✓

**Verify Deployment:**

- [ ] Status shows "Running" (green)
- [ ] Build logs show "🎉 Initialization complete!"
- [ ] Build logs show "✓ Ready on http://0.0.0.0:3000"
- [ ] No error messages in logs

---

## ☑️ Step 7: Add Domain

**Domains Tab**

- [ ] Click "Add Domain"
- [ ] Host: `yourdomain.com` (or subdomain)
- [ ] Path: `/`
- [ ] Port: `3000`
- [ ] HTTPS: ✓ Enabled
- [ ] Certificate: "Let's Encrypt"
- [ ] Click "Create"
- [ ] Wait 1-2 minutes for SSL certificate

**Verify Domain:**

- [ ] Visit `https://yourdomain.com`
- [ ] Page loads successfully ✓
- [ ] SSL certificate valid (padlock icon) ✓
- [ ] No certificate warnings ✓

---

## ☑️ Step 8: Enable Auto-Deploy

**General Tab**

- [ ] Find "Auto Deploy" section
- [ ] Toggle: Enabled
- [ ] Trigger: "Push"
- [ ] Click "Save"

**Test Auto-Deploy:**

- [ ] Make small change locally
- [ ] Commit and push to GitHub
- [ ] Watch deployment start automatically in Dokploy
- [ ] Verify deployment completes successfully

---

## ☑️ Step 9: Configure Backups

**Database Service → Backups Tab**

- [ ] Configure destination (S3 recommended, or Local)
- [ ] Schedule: Daily
- [ ] Time: 03:00
- [ ] Retention: 7 days (or more)
- [ ] Click "Enable Backup"
- [ ] Click "Backup Now" to test
- [ ] Verify backup appears in list

---

## ☑️ Step 10: Access Admin Panel

**Find Admin Credentials:**

- [ ] Check `prisma/seed-essentials.ts` in your repository
- [ ] Note admin email and password

**Login:**

- [ ] Visit `https://yourdomain.com/admin`
- [ ] Enter admin credentials
- [ ] Login successful ✓

**CRITICAL SECURITY:**

- [ ] Go to Profile Settings
- [ ] Change admin password immediately
- [ ] Use strong password (16+ characters)
- [ ] Save new password in password manager
- [ ] Logout and login with new password to verify

---

## ☑️ Post-Deployment Configuration

### Store Settings

- [ ] Admin Panel → Settings
- [ ] Configure store name
- [ ] Add store description
- [ ] Set contact email
- [ ] Set phone number
- [ ] Configure address
- [ ] Set currency
- [ ] Set timezone
- [ ] Set default language
- [ ] Save settings

### Optional: Email Configuration

If you want order notification emails:

- [ ] Get SMTP credentials (Gmail, SendGrid, etc.)
- [ ] Application → Environment → Add email variables
- [ ] Redeploy application
- [ ] Test email by placing test order

### Optional: Payment Gateway

If you want to accept payments:

- [ ] Create Stripe account (or other gateway)
- [ ] Get API keys
- [ ] Application → Environment → Add Stripe variables
- [ ] Redeploy application
- [ ] Configure webhook: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Test payment flow

---

## ☑️ Monitoring & Maintenance

### Daily

- [ ] Check application is running: `docker ps`
- [ ] Review error logs if needed

### Weekly

- [ ] Check disk space: `df -h`
- [ ] Check memory usage: `free -h`
- [ ] Review backup logs

### Monthly

- [ ] Update Dokploy: `curl -sSL https://dokploy.com/install.sh | sh`
- [ ] Test database restore from backup
- [ ] Review and rotate old backups
- [ ] Update server packages: `apt update && apt upgrade`

---

## 🎉 Deployment Complete!

Your e-commerce platform is now live at:

- **Storefront:** https://yourdomain.com
- **Admin Panel:** https://yourdomain.com/admin
- **Dokploy Panel:** https://dokploy.yourdomain.com

---

## 📝 Next Steps

### Essential

1. **Add Products**
   - Login to admin panel
   - Navigate to Products
   - Create your product catalog

2. **Configure Categories**
   - Set up product categories
   - Organize products

3. **Set Payment Methods**
   - Configure payment gateway
   - Test checkout flow

4. **Configure Shipping**
   - Set up shipping zones
   - Configure shipping rates

### Recommended

5. **Create Pages**
   - About Us
   - Contact
   - Terms & Conditions
   - Privacy Policy
   - Shipping Policy
   - Return Policy

6. **Set Up Analytics**
   - Google Analytics
   - Facebook Pixel
   - Other tracking tools

7. **Marketing**
   - SEO optimization
   - Social media integration
   - Email marketing setup

---

## 🆘 Troubleshooting

If anything goes wrong, see:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Quick troubleshooting guide
- **[Dokploy.md](./Dokploy.md)** - Complete deployment documentation

**Common Issues:**

- Container crashes → Check DATABASE_URL and logs
- Can't login → Verify seeding completed
- Images won't upload → Check Cloudinary credentials
- Domain not working → Check DNS and SSL certificate

---

**Checklist Version:** 1.0
**Last Updated:** December 2024
