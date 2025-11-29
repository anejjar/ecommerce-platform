# Deploying to Subdirectory or Subdomain

If you already have a website in `public_html`, this guide shows you how to deploy your e-commerce platform **without affecting your existing site**.

## Two Options

### Option 1: Subdirectory (yourdomain.com/shop)
- Keeps your main website intact
- E-commerce accessible at `yourdomain.com/shop`
- Easier setup, shares same domain SSL

### Option 2: Subdomain (shop.yourdomain.com)
- Completely separate from main site
- E-commerce accessible at `shop.yourdomain.com`
- Requires separate SSL certificate (usually automatic)

---

## Option 1: Subdirectory Deployment

### Step 1: Create Subdirectory

**Via SSH:**
```bash
ssh yourusername@yourdomain.com
cd ~/public_html
mkdir shop
cd shop
git clone <YOUR_REPO_URL> .
```

**Via File Manager:**
1. cPanel → File Manager
2. Navigate to `public_html`
3. Click "New Folder" → Name it "shop"
4. Upload and extract your files inside the `shop` folder

### Step 2: Configure Node.js App

In cPanel → Setup Node.js App:

```
Node.js version: 18.x or higher
Application mode: Production
Application root: public_html/shop
Application URL: yourdomain.com/shop
Application startup file: server.js
```

### Step 3: Configure Environment Variables

Create `.env` in `public_html/shop/.env`:

```env
DATABASE_URL="mysql://yourusername_ecommerce_user:PASSWORD@localhost:3306/yourusername_ecommerce_db"

NEXTAUTH_SECRET="your_32_char_secret"
NEXTAUTH_URL="https://yourdomain.com/shop"  # ← Note the /shop

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

**Important:** `NEXTAUTH_URL` must include `/shop`!

### Step 4: Build Application

```bash
# Enter virtual environment (command from cPanel)
source /home/yourusername/nodevenv/public_html/shop/18/bin/activate && cd /home/yourusername/public_html/shop

# Install and build
npm install
npx prisma generate
npx prisma db push
npm run seed:test
npm run build
```

### Step 5: Configure .htaccess

**Create `public_html/shop/.htaccess`:**

```apache
RewriteEngine On

# Force HTTPS
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

**Update main `public_html/.htaccess`** (add BEFORE your existing rules):

```apache
RewriteEngine On

# Route /shop requests to Node.js app
RewriteCond %{REQUEST_URI} ^/shop
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^shop/(.*)$ http://localhost:3000/$1 [P,L]

# Your existing website rules continue below...
```

### Step 6: Start Application

In cPanel → Setup Node.js App → Click "Start"

### Step 7: Test

Visit: `https://yourdomain.com/shop`
Admin: `https://yourdomain.com/shop/admin`

---

## Option 2: Subdomain Deployment

### Step 1: Create Subdomain

In cPanel → Domains → Subdomains:

```
Subdomain: shop
Document Root: /home/yourusername/shop (or auto-generated)
```

Click "Create"

### Step 2: Upload Files

**Via SSH:**
```bash
ssh yourusername@yourdomain.com
cd ~/shop  # Use the document root from subdomain creation
git clone <YOUR_REPO_URL> .
```

**Via File Manager:**
1. Navigate to the subdomain document root (e.g., `~/shop`)
2. Upload and extract your files

### Step 3: Configure Node.js App

In cPanel → Setup Node.js App:

```
Node.js version: 18.x or higher
Application mode: Production
Application root: shop (or your subdomain document root)
Application URL: shop.yourdomain.com
Application startup file: server.js
```

### Step 4: Configure Environment Variables

Create `.env` in your subdomain root:

```env
DATABASE_URL="mysql://yourusername_ecommerce_user:PASSWORD@localhost:3306/yourusername_ecommerce_db"

NEXTAUTH_SECRET="your_32_char_secret"
NEXTAUTH_URL="https://shop.yourdomain.com"  # ← Subdomain URL

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

### Step 5: Build Application

```bash
# Enter virtual environment (command from cPanel)
source /home/yourusername/nodevenv/shop/18/bin/activate && cd /home/yourusername/shop

# Install and build
npm install
npx prisma generate
npx prisma db push
npm run seed:test
npm run build
```

### Step 6: Configure .htaccess

Create `.htaccess` in your subdomain root:

```apache
RewriteEngine On

# Force HTTPS
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

### Step 7: Setup SSL

In cPanel → SSL/TLS Status:
- Select `shop.yourdomain.com`
- Run AutoSSL or Install Let's Encrypt

### Step 8: Start Application

In cPanel → Setup Node.js App → Click "Start"

### Step 9: Test

Visit: `https://shop.yourdomain.com`
Admin: `https://shop.yourdomain.com/admin`

---

## Important Notes

### Port Configuration

Each Node.js app needs a unique port. If you have multiple Node.js apps:

1. Use different ports in each `.env`:
   - Main site: `PORT=3000`
   - Shop: `PORT=3001`

2. Update `.htaccess` proxy rules to match the port

### Database

You can use the **same database** for multiple apps, or create separate databases for each.

### Virtual Environment Commands

cPanel generates unique commands for each app. Always use the correct one:

**Subdirectory:**
```bash
source /home/yourusername/nodevenv/public_html/shop/18/bin/activate && cd /home/yourusername/public_html/shop
```

**Subdomain:**
```bash
source /home/yourusername/nodevenv/shop/18/bin/activate && cd /home/yourusername/shop
```

---

## Troubleshooting

### "Cannot find module 'next'"

You're not in the virtual environment. Run the activate command from cPanel.

### 404 Not Found (Subdirectory)

Check that:
1. Main `.htaccess` routes `/shop` requests correctly
2. `NEXTAUTH_URL` includes `/shop`
3. Application is running in cPanel

### SSL Certificate Issues (Subdomain)

Run AutoSSL for the subdomain specifically in cPanel → SSL/TLS Status

### Application Won't Start

Check:
1. Correct application root in cPanel Node.js setup
2. `server.js` exists in the root
3. Dependencies installed (`npm install` completed)
4. Error logs in cPanel

---

## Quick Reference

| Deployment Type | URL | Application Root | NEXTAUTH_URL |
|----------------|-----|------------------|--------------|
| Subdirectory | yourdomain.com/shop | public_html/shop | https://yourdomain.com/shop |
| Subdomain | shop.yourdomain.com | shop | https://shop.yourdomain.com |
| Main Domain | yourdomain.com | public_html | https://yourdomain.com |

---

For complete deployment instructions, see:
- [NAMECHEAP_DEPLOYMENT_GUIDE.md](./NAMECHEAP_DEPLOYMENT_GUIDE.md) - Full guide
- [NAMECHEAP_QUICK_START.md](./NAMECHEAP_QUICK_START.md) - Quick reference
