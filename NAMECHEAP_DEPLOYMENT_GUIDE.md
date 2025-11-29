# Namecheap Deployment Guide

This guide provides step-by-step instructions for deploying the E-commerce Platform to Namecheap shared hosting with cPanel. This guide is designed for non-developers.

> [!IMPORTANT]
> **Before You Begin**: This Next.js application requires Node.js support. Ensure your Namecheap hosting plan supports Node.js applications. Most shared hosting plans have limitations - you may need a VPS or dedicated server plan for full functionality.

---

## Prerequisites

Before you begin, ensure you have:

1. **Namecheap Hosting Account** with cPanel access
2. **Node.js Support** enabled on your hosting plan (check with Namecheap support)
3. **MySQL Database** access (included with most hosting plans)
4. **Domain Name** (can be your Namecheap domain)
5. **FTP/SFTP Credentials** or SSH access (if available)
6. **Cloudinary Account** (free tier available) for image uploads

---

## Step 1: Check Hosting Compatibility

1. **Log in to cPanel** (usually at `yourdomain.com/cpanel`)

2. **Check Node.js Support**:
   - Look for "Setup Node.js App" or "Node.js Selector" in cPanel
   - If not available, contact Namecheap support to enable it or upgrade your plan

3. **Verify Requirements**:
   - Node.js version 18.x or higher
   - MySQL 5.7+ or 8.0+
   - At least 1GB RAM (recommended)
   - SSH access (highly recommended)

> [!WARNING]
> If your hosting plan doesn't support Node.js applications, you'll need to upgrade to a VPS or dedicated server plan. Shared hosting with only PHP support won't work for this Next.js application.

---

## Step 2: Database Setup

1. **Log in to cPanel**

2. **Create MySQL Database**:
   - Navigate to **"MySQL Databases"**
   - Under **"Create New Database"**, enter: `ecommerce_db`
   - Click **"Create Database"**

3. **Create Database User**:
   - Scroll to **"MySQL Users"** section
   - Under **"Add New User"**:
     - Username: `ecommerce_user`
     - Password: Generate a strong password (click "Password Generator")
     - Save this password securely!
   - Click **"Create User"**

4. **Add User to Database**:
   - Scroll to **"Add User To Database"**
   - Select user: `ecommerce_user`
   - Select database: `ecommerce_db`
   - Click **"Add"**
   - On the next page, check **"ALL PRIVILEGES"**
   - Click **"Make Changes"**

5. **Note Your Database Details**:
   ```
   Database Name: yourusername_ecommerce_db
   Database User: yourusername_ecommerce_user
   Database Password: [your generated password]
   Database Host: localhost (or as shown in cPanel)
   ```
   *(Note: cPanel usually prefixes database names with your username)*

---

## Step 3: Prepare Your Application Files

### Option A: Using SSH (Recommended)

If you have SSH access:

1. **Connect via SSH**:
   ```bash
   ssh yourusername@yourdomain.com
   ```

2. **Navigate to your web directory**:
   ```bash
   cd ~/public_html
   # Or for subdomain/subdirectory:
   # cd ~/public_html/shop
   ```

3. **Clone your repository** (if using Git):
   ```bash
   git clone <YOUR_GITHUB_REPO_URL> .
   ```
   
   Or **upload your files** using the method below.

### Option B: Using File Manager or FTP

1. **Prepare files locally**:
   - Zip your entire project folder (excluding `node_modules` and `.next`)
   - Upload via cPanel File Manager or FTP client (FileZilla)

2. **Upload to cPanel**:
   - Log in to cPanel
   - Open **"File Manager"**
   - Navigate to `public_html` (or your desired directory)
   - Click **"Upload"** and select your zip file
   - After upload, right-click the zip file and select **"Extract"**

---

## Step 4: Configure Node.js Application

1. **In cPanel, navigate to "Setup Node.js App"**

2. **Create New Application**:
   - **Node.js version**: Select 18.x or higher
   - **Application mode**: Production
   - **Application root**: `public_html` (or your app directory)
   - **Application URL**: Your domain (e.g., `yourdomain.com`)
   - **Application startup file**: `server.js` (we'll create this)
   - Click **"Create"**

3. **Note the command to enter virtual environment**:
   - cPanel will show a command like:
   ```bash
   source /home/yourusername/nodevenv/public_html/18/bin/activate && cd /home/yourusername/public_html
   ```
   - Save this command for later use

---

## Step 5: Create Server Startup File

Since Next.js uses `npm start` by default, we need a `server.js` file:

1. **In File Manager, create a new file** named `server.js` in your application root

2. **Add the following content**:

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

---

## Step 6: Configure Environment Variables

1. **Create `.env` file** in your application root (via File Manager or SSH)

2. **Add your configuration**:

```env
# Database Configuration
DATABASE_URL="mysql://yourusername_ecommerce_user:your_password@localhost:3306/yourusername_ecommerce_db"

# Authentication
# Generate secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your_generated_secret_here_use_at_least_32_characters"
NEXTAUTH_URL="https://yourdomain.com"

# Cloudinary (Sign up at cloudinary.com - free tier available)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email Configuration (Use your Namecheap email or external SMTP)
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT=465
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your_email_password"
SMTP_FROM="noreply@yourdomain.com"

# Application Settings
NODE_ENV="production"
PORT=3000
```

3. **Update the values**:
   - Replace database credentials with those from Step 2
   - Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal or use an online generator
   - Update domain name
   - Configure Cloudinary (sign up at [cloudinary.com](https://cloudinary.com))
   - Configure email settings

> [!TIP]
> For Cloudinary setup:
> 1. Sign up at cloudinary.com (free tier available)
> 2. Go to Dashboard
> 3. Copy Cloud Name, API Key, and API Secret
> 4. Paste into your `.env` file

---

## Step 7: Install Dependencies and Build

1. **Connect via SSH** (or use cPanel Terminal if available)

2. **Enter Node.js virtual environment**:
   ```bash
   source /home/yourusername/nodevenv/public_html/18/bin/activate && cd /home/yourusername/public_html
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   *(This may take 5-10 minutes)*

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Push database schema**:
   ```bash
   npx prisma db push
   ```
   *(Type 'yes' when prompted)*

6. **Seed the database** (optional but recommended):
   ```bash
   npm run seed:test
   ```
   
   This creates test accounts:
   - Admin: `admin@example.com` / `password123`
   - Customer: `alice@example.com` / `password123`

7. **Build the application**:
   ```bash
   npm run build
   ```
   *(This may take 5-15 minutes)*

---

## Step 8: Configure .htaccess (Reverse Proxy)

To route traffic from your domain to the Node.js app, create/edit `.htaccess`:

1. **In your `public_html` directory, create/edit `.htaccess`**

2. **Add the following**:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Proxy to Node.js application
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteCond %{HTTP:Upgrade} !=websocket
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# WebSocket support
RewriteCond %{HTTP:Upgrade} =websocket
RewriteRule ^(.*)$ ws://localhost:3000/$1 [P,L]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

> [!CAUTION]
> Some shared hosting plans may not support proxy rules in `.htaccess`. If you get a 500 error, contact Namecheap support or check your error logs.

---

## Step 9: Start the Application

1. **In cPanel, go to "Setup Node.js App"**

2. **Find your application** in the list

3. **Click "Start"** or restart the application

4. **Verify it's running**:
   - Status should show "Running"
   - Check the application URL

Alternatively, via SSH:

```bash
# Enter virtual environment
source /home/yourusername/nodevenv/public_html/18/bin/activate && cd /home/yourusername/public_html

# Start the application
npm start
```

> [!NOTE]
> The application should auto-restart on server reboot. If not, you may need to set up a cron job or use PM2 (if available).

---

## Step 10: SSL Certificate Setup

1. **In cPanel, navigate to "SSL/TLS Status"**

2. **Enable AutoSSL** (if available):
   - Most Namecheap plans include free AutoSSL
   - Select your domain
   - Click "Run AutoSSL"

3. **Or install Let's Encrypt** (if available in your plan):
   - Navigate to "SSL/TLS"
   - Click "Install Let's Encrypt SSL"
   - Select your domain
   - Click "Install"

4. **Force HTTPS** by updating `.htaccess`:

Add at the top of your `.htaccess` file:

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Step 11: Verify Deployment

1. **Visit your website**: `https://yourdomain.com`

2. **Test the storefront**:
   - Browse products
   - Add items to cart
   - Test checkout process

3. **Access admin panel**: `https://yourdomain.com/admin`
   - Login with: `admin@example.com` / `password123`
   - Change this password immediately!

4. **Check functionality**:
   - Create a test product
   - Upload an image (tests Cloudinary)
   - Create a test order
   - Send a test email

---

## Troubleshooting

### Application Won't Start

**Check error logs**:
- cPanel → "Errors" or "Error Log"
- Look for Node.js application errors

**Common issues**:
- ✅ Verify Node.js version is 18.x or higher
- ✅ Check `.env` file exists and has correct values
- ✅ Ensure database credentials are correct
- ✅ Verify `npm install` completed successfully

### Database Connection Errors

**Verify**:
- Database name includes your cPanel username prefix
- Database user has all privileges
- `DATABASE_URL` in `.env` is correct
- MySQL service is running

**Test connection**:
```bash
# In SSH
mysql -u yourusername_ecommerce_user -p yourusername_ecommerce_db
```

### 500 Internal Server Error

**Check**:
- `.htaccess` syntax is correct
- Proxy module is enabled (contact support if not)
- Application is running in cPanel Node.js manager
- Error logs for specific error messages

### Images Not Uploading

**Verify**:
- Cloudinary credentials are correct in `.env`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- API key and secret are valid
- Check browser console for errors

### Email Not Sending

**Check**:
- SMTP credentials are correct
- Email account exists in cPanel
- Port 465 (SSL) or 587 (TLS) is open
- Try using an external SMTP service (Gmail, SendGrid)

### Application Crashes or Stops

**Solutions**:
- Check memory usage (shared hosting has limits)
- Restart application in cPanel Node.js manager
- Check error logs for memory errors
- Consider upgrading to VPS if resource limits are hit
6. **Rebuild application**:
   ```bash
   npm run build
   ```

7. **Restart application**:
   - In cPanel Node.js manager, click "Restart"
   - Or via SSH: `npm start`

### Backup Your Data

**Database Backup**:
1. cPanel → "phpMyAdmin"
2. Select your database
3. Click "Export"
4. Choose "Quick" export method
5. Download the SQL file

**File Backup**:
1. cPanel → "Backup"
2. Download "Home Directory" backup
3. Or use FTP to download files

**Automated Backups**:
- Enable cPanel automatic backups if available
- Set up weekly database backups via cron job

### Monitor Application

**Check application status**:
- cPanel → "Setup Node.js App" → Check status
- Set up uptime monitoring (UptimeRobot, Pingdom)

**Monitor resources**:
- cPanel → "CPU and Concurrent Connection Usage"
- Watch for memory/CPU limits

---

## Performance Optimization

### Enable Caching

Add to `.htaccess`:

```apache
# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
</IfModule>
```

### Optimize Images

- Use Cloudinary's automatic optimization
- Enable WebP format in Cloudinary settings
- Set appropriate image quality (80-85%)

### Database Optimization

```bash
# Connect to database
mysql -u yourusername_ecommerce_user -p yourusername_ecommerce_db

# Optimize tables
OPTIMIZE TABLE Product, Category, Order, User;
```

---

## Security Best Practices

1. **Change Default Passwords**:
   - Change admin password immediately after first login
   - Use strong, unique passwords

2. **Secure Environment Variables**:
   - Never commit `.env` to Git
   - Keep `NEXTAUTH_SECRET` secure and complex

3. **Regular Updates**:
   - Keep Node.js dependencies updated: `npm update`
   - Monitor security advisories: `npm audit`

4. **Database Security**:
   - Use strong database passwords
   - Don't use root MySQL user
   - Limit database user privileges to only what's needed

5. **File Permissions**:
   ```bash
   # Set correct permissions
   chmod 644 .env
   chmod 755 public_html
   ```

6. **Enable Firewall** (if available):
   - cPanel → "IP Blocker"
   - Block suspicious IPs

---

## Scaling Considerations

### When to Upgrade

Consider upgrading from shared hosting to VPS/dedicated server if:

- ❌ Application frequently crashes or stops
- ❌ Page load times exceed 3-5 seconds
- ❌ You hit memory/CPU limits regularly
- ❌ You have more than 100 concurrent users
- ❌ Database queries are slow

### Recommended Upgrade Path

1. **Namecheap VPS** - More resources, full control
2. **Dedicated Server** - Maximum performance
3. **Cloud Platform** - Vercel, AWS, DigitalOcean for auto-scaling

---

## Additional Resources

- **Namecheap Support**: [https://www.namecheap.com/support/](https://www.namecheap.com/support/)
- **cPanel Documentation**: [https://docs.cpanel.net/](https://docs.cpanel.net/)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Documentation**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Cloudinary Documentation**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)

---

## Getting Help

If you encounter issues:

1. **Check error logs** in cPanel
2. **Review this guide** for common solutions
3. **Contact Namecheap support** for hosting-specific issues
4. **Check application logs**: `npm run logs` (if available)
5. **Open an issue** on the project's GitHub repository

---

## Summary Checklist

- [ ] Verified Node.js support on hosting plan
- [ ] Created MySQL database and user
- [ ] Uploaded application files
- [ ] Configured Node.js app in cPanel
- [ ] Created `server.js` file
- [ ] Configured `.env` file with all credentials
- [ ] Installed dependencies (`npm install`)
- [ ] Generated Prisma client
- [ ] Pushed database schema
- [ ] Seeded database with test data
- [ ] Built application (`npm run build`)
- [ ] Configured `.htaccess` for reverse proxy
- [ ] Started application in cPanel
- [ ] Installed SSL certificate
- [ ] Tested storefront and admin panel
- [ ] Changed default admin password
- [ ] Set up backups

---

**Congratulations!** 🎉 Your e-commerce platform should now be live on Namecheap hosting.

Remember to regularly backup your data and keep your application updated for security and performance.
