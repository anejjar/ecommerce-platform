# Namecheap Deployment - Quick Start Checklist

This is a condensed version of the full deployment guide. For detailed instructions, see [NAMECHEAP_DEPLOYMENT_GUIDE.md](./NAMECHEAP_DEPLOYMENT_GUIDE.md).

## Pre-Deployment Checklist

- [ ] Namecheap hosting account with cPanel access
- [ ] Node.js support enabled (check cPanel for "Setup Node.js App")
- [ ] MySQL database access
- [ ] SSH or FTP credentials
- [ ] Cloudinary account (free tier: [cloudinary.com](https://cloudinary.com))

---

## Quick Deployment Steps

### 1. Database Setup (5 minutes)

**In cPanel → MySQL Databases:**

```
1. Create Database: ecommerce_db
2. Create User: ecommerce_user (generate strong password)
3. Add user to database with ALL PRIVILEGES
4. Note: yourusername_ecommerce_db, yourusername_ecommerce_user
```

### 2. Upload Files (10-15 minutes)

> [!IMPORTANT]
> **If you already have a website in `public_html`**, choose one of these options:
> - **Option 1**: Deploy to subdirectory (e.g., `yourdomain.com/shop`)
> - **Option 2**: Deploy to subdomain (e.g., `shop.yourdomain.com`)

**Option A - Subdirectory (e.g., yourdomain.com/shop):**

Via SSH:
```bash
ssh yourusername@yourdomain.com
cd ~/public_html
mkdir shop
cd shop
git clone <YOUR_REPO_URL> .
```

Via File Manager:
```
1. Navigate to public_html
2. Create new folder: "shop" (or your preferred name)
3. Upload and extract files inside this folder
```

**Option B - Subdomain (e.g., shop.yourdomain.com):**

First, create subdomain in cPanel:
```
1. cPanel → Domains → Subdomains
2. Subdomain: "shop"
3. Document Root: /home/yourusername/shop (or auto-generated)
4. Create
```

Then upload files:
```bash
# Via SSH
ssh yourusername@yourdomain.com
cd ~/shop  # Use the document root from subdomain creation
git clone <YOUR_REPO_URL> .
```

**Option C - Main Domain (Replace existing site):**
```bash
# Only if you want to replace your current website!
ssh yourusername@yourdomain.com
cd ~/public_html
git clone <YOUR_REPO_URL> .
```

### 3. Setup Node.js App (5 minutes)

**In cPanel → Setup Node.js App:**

**For Subdirectory (yourdomain.com/shop):**
```
Node.js version: 18.x or higher
Application mode: Production
Application root: public_html/shop
Application URL: yourdomain.com/shop
Application startup file: server.js
```

**For Subdomain (shop.yourdomain.com):**
```
Node.js version: 18.x or higher
Application mode: Production
Application root: shop (or your subdomain document root)
Application URL: shop.yourdomain.com
Application startup file: server.js
```

**For Main Domain (yourdomain.com):**
```
Node.js version: 18.x or higher
Application mode: Production
Application root: public_html
Application URL: yourdomain.com
Application startup file: server.js
```

**Save the virtual environment command shown!**
Example: `source /home/yourusername/nodevenv/public_html/shop/18/bin/activate && cd /home/yourusername/public_html/shop`

### 4. Create server.js

**In File Manager, create `server.js` in root:**

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
```

### 5. Configure .env (10 minutes)

**Create `.env` file in your application root:**

```env
DATABASE_URL="mysql://yourusername_ecommerce_user:YOUR_DB_PASSWORD@localhost:3306/yourusername_ecommerce_db"

NEXTAUTH_SECRET="GENERATE_32_CHAR_SECRET_HERE"
# For subdirectory: https://yourdomain.com/shop
# For subdomain: https://shop.yourdomain.com
# For main domain: https://yourdomain.com
NEXTAUTH_URL="https://yourdomain.com"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

SMTP_HOST="mail.yourdomain.com"
SMTP_PORT=465
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your_email_password"
SMTP_FROM="noreply@yourdomain.com"

NODE_ENV="production"
PORT=3000
```

**Important:** Update `NEXTAUTH_URL` based on your deployment:
- Subdirectory: `https://yourdomain.com/shop`
- Subdomain: `https://shop.yourdomain.com`
- Main domain: `https://yourdomain.com`

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or use: [generate-secret.now.sh/32](https://generate-secret.now.sh/32)

### 6. Build Application (15-20 minutes)

**Via SSH:**

```bash
# Enter virtual environment
# For subdirectory:
source /home/yourusername/nodevenv/public_html/shop/18/bin/activate && cd /home/yourusername/public_html/shop

# For subdomain:
# source /home/yourusername/nodevenv/shop/18/bin/activate && cd /home/yourusername/shop

# For main domain:
# source /home/yourusername/nodevenv/public_html/18/bin/activate && cd /home/yourusername/public_html

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed with test data
npm run seed:test

# Build
npm run build
```

### 7. Configure .htaccess

> [!IMPORTANT]
> The `.htaccess` configuration differs based on your deployment type!

**For Subdirectory (yourdomain.com/shop):**

Create `.htaccess` **inside your shop folder** (`public_html/shop/.htaccess`):

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node.js
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteCond %{HTTP:Upgrade} !=websocket
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# WebSocket support
RewriteCond %{HTTP:Upgrade} =websocket
RewriteRule ^(.*)$ ws://localhost:3000/$1 [P,L]
```

**Also update main `.htaccess`** in `public_html/.htaccess` to route `/shop` requests:

```apache
# Add this BEFORE your existing rules
RewriteEngine On

# Route /shop to Node.js app
RewriteCond %{REQUEST_URI} ^/shop
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^shop/(.*)$ http://localhost:3000/$1 [P,L]

# Your existing website rules continue below...
```

**For Subdomain (shop.yourdomain.com) or Main Domain:**

Create/edit `.htaccess` in your application root:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node.js
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteCond %{HTTP:Upgrade} !=websocket
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# WebSocket support
RewriteCond %{HTTP:Upgrade} =websocket
RewriteRule ^(.*)$ ws://localhost:3000/$1 [P,L]
```

### 8. Start Application

**In cPanel → Setup Node.js App:**
- Click "Start" or "Restart"
- Verify status shows "Running"

### 9. Setup SSL

**In cPanel → SSL/TLS Status:**
- Enable AutoSSL or Install Let's Encrypt
- Select your domain
- Run/Install

### 10. Test Deployment

**Visit:** `https://yourdomain.com`

**Admin Login:** `https://yourdomain.com/admin`
- Email: `admin@example.com`
- Password: `password123`
- **⚠️ CHANGE THIS IMMEDIATELY!**

---

## Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Customer | alice@example.com | password123 |

---

## Common Issues & Quick Fixes

### App Won't Start
```bash
# Check logs in cPanel → Errors
# Verify .env file exists
# Check database connection
```

### Database Error
```bash
# Verify DATABASE_URL format:
# mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME
# Include cPanel username prefix!
```

### 500 Error
```bash
# Check .htaccess syntax
# Verify app is running in cPanel
# Check error logs
```

### Images Not Uploading
```bash
# Verify Cloudinary credentials
# Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set
# Test Cloudinary connection
```

---

## Updating Application

```bash
# SSH into server
source /home/yourusername/nodevenv/public_html/18/bin/activate && cd /home/yourusername/public_html

# Update code
git pull

# Update dependencies
npm install

# Update database
npx prisma db push

# Rebuild
npm run build

# Restart in cPanel Node.js manager
```

---

## Important Security Steps

1. **Change admin password** immediately after first login
2. **Secure .env file** - never commit to Git
3. **Use strong database passwords**
4. **Enable SSL/HTTPS**
5. **Regular backups** - Database + Files
6. **Update dependencies** regularly: `npm update`

---

## Backup Your Data

**Database:**
- cPanel → phpMyAdmin → Export → Download

**Files:**
- cPanel → Backup → Home Directory

**Set up weekly automated backups!**

---

## Need Help?

- 📖 **Full Guide**: [NAMECHEAP_DEPLOYMENT_GUIDE.md](./NAMECHEAP_DEPLOYMENT_GUIDE.md)
- 🆘 **Namecheap Support**: [namecheap.com/support](https://www.namecheap.com/support/)
- 📧 **Email Issues**: Check SMTP settings in .env
- 🗄️ **Database Issues**: Verify credentials and prefix

---

## Estimated Time

- **Total Deployment Time**: 45-60 minutes
- **First-time setup**: May take longer
- **With experience**: 30-40 minutes

---

**Good luck with your deployment! 🚀**
