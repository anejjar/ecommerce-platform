# Deployment Guide for Dedicated Server (Ubuntu)

This guide provides step-by-step instructions for deploying the E-commerce Platform to a dedicated server running Ubuntu (20.04 or 22.04 LTS). It is designed for non-developers.

## Prerequisites

Before you begin, ensure you have:
1.  **A Dedicated Server or VPS** running Ubuntu 20.04 or 22.04.
2.  **Root access** or a user with `sudo` privileges.
3.  **A Domain Name** pointed to your server's IP address (A Record).

---

## Step 1: Server Preparation

First, we need to update the server and install necessary software.

1.  **Connect to your server** via SSH:
    ```bash
    ssh username@your_server_ip
    ```

2.  **Update system packages**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

3.  **Install Node.js (Version 20.x)**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    ```
    *Verify installation:* `node -v` (Should show v20.x.x)

4.  **Install Nginx (Web Server)**:
    ```bash
    sudo apt install -y nginx
    ```

5.  **Install MySQL Server**:
    ```bash
    sudo apt install -y mysql-server
    ```

6.  **Secure MySQL Installation**:
    ```bash
    sudo mysql_secure_installation
    ```
    *   Press `Y` to enable VALIDATE PASSWORD PLUGIN (optional, but recommended).
    *   Select password strength.
    *   Remove anonymous users? `Y`
    *   Disallow root login remotely? `Y`
    *   Remove test database? `Y`
    *   Reload privilege tables now? `Y`

---

## Step 2: Database Setup

Create a database and a user for the application.

1.  **Log in to MySQL**:
    ```bash
    sudo mysql -u root -p
    ```

2.  **Run the following SQL commands** (Replace `your_password` with a strong password):
    ```sql
    CREATE DATABASE ecommerce_db;
    CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_strong_password';
    GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```

---

## Step 3: Application Setup

1.  **Install Git**:
    ```bash
    sudo apt install -y git
    ```

2.  **Clone the Repository** (Navigate to the web directory first):
    ```bash
    cd /var/www
    sudo git clone <YOUR_GITHUB_REPO_URL> ecommerce-platform
    ```
    *(Replace `<YOUR_GITHUB_REPO_URL>` with your actual repository URL)*

3.  **Fix Permissions**:
    ```bash
    sudo chown -R $USER:$USER /var/www/ecommerce-platform
    cd /var/www/ecommerce-platform
    ```

4.  **Install Dependencies**:
    ```bash
    npm install
    ```

---

## Step 4: Configuration

1.  **Create the Environment File**:
    ```bash
    cp .env.example .env
    nano .env
    ```

2.  **Edit the `.env` file** with your settings. It should look something like this:

    ```env
    # Database
    DATABASE_URL="mysql://ecommerce_user:your_strong_password@localhost:3306/ecommerce_db"

    # Authentication (Generate a secret with: openssl rand -base64 32)
    NEXTAUTH_SECRET="your_generated_secret_here"
    NEXTAUTH_URL="https://yourdomain.com"

    # Cloudinary (For Image Uploads)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"

    # Email (Stalwart Self-Hosted SMTP Settings)
    EMAIL_HOST="localhost"
    EMAIL_PORT=587
    EMAIL_SECURE="false"
    EMAIL_USER="your_stalwart_username"
    EMAIL_PASSWORD="your_stalwart_password"
    EMAIL_FROM="noreply@yourdomain.com"
    ```
    *Press `Ctrl+X`, then `Y`, then `Enter` to save and exit.*

    **Note:** See the Stalwart Email Setup section below for detailed instructions on configuring Stalwart.

---

## Step 4.5: Stalwart Self-Hosted Email Setup

Stalwart is a modern, open-source email server that provides full control over your email infrastructure. It's built in Rust for security and performance.

### 1. Install Stalwart

1.  **Download and Install Stalwart:**
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://get.stalw.art/install.sh -o install.sh
    sudo sh install.sh
    ```
    By default, Stalwart installs to `/opt/stalwart`. To specify a different directory:
    ```bash
    sudo sh install.sh /path/to/install
    ```

2.  **Alternative: Install via Docker** (if you prefer containerized setup):
    ```bash
    docker pull stalwartlabs/stalwart:latest
    mkdir /var/lib/stalwart
    docker run -d -ti -p 25:25 -p 587:587 -p 465:465 \
               -p 143:143 -p 993:993 \
               -v /var/lib/stalwart:/opt/stalwart \
               --name stalwart stalwartlabs/stalwart:latest
    ```

### 2. Configure Stalwart

1.  **Navigate to Stalwart Configuration Directory:**
    ```bash
    cd /opt/stalwart
    ```

2.  **Create or Edit Configuration File:**
    ```bash
    sudo nano config.toml
    ```

3.  **Add Basic SMTP Configuration:**
    ```toml
    [server.listener."smtp"]
    bind = ["0.0.0.0:25"]
    protocol = "smtp"

    [server.listener."submission"]
    bind = ["0.0.0.0:587"]
    protocol = "smtp"
    tls = "starttls"

    [server.listener."submissions"]
    bind = ["0.0.0.0:465"]
    protocol = "smtp"
    tls.implicit = true

    [storage]
    data = "rocksdb"
    fts = "rocksdb"
    blob = "rocksdb"
    lookup = "rocksdb"
    directory = "internal"

    [store."rocksdb"]
    type = "rocksdb"
    path = "/opt/stalwart/data"
    compression = "lz4"

    [directory."internal"]
    type = "internal"
    store = "rocksdb"

    [authentication.fallback-admin]
    user = "admin"
    secret = "change_this_to_a_secure_password"

    [session.sasl]
    mechanisms = ["plain", "login"]
    ```

4.  **Save and Exit:** Press `Ctrl+X`, then `Y`, then `Enter`

5.  **Start Stalwart Service:**
    ```bash
    sudo systemctl enable stalwart
    sudo systemctl start stalwart
    ```

6.  **Check Status:**
    ```bash
    sudo systemctl status stalwart
    ```

### 3. Create Email Account

1.  **Access Stalwart Management Interface:**
    - Stalwart typically provides a web interface at `http://localhost:8080` (if configured)
    - Or use the command-line tools to create accounts

2.  **Create a User Account for SMTP:**
    You'll need to create an email account that your application will use to send emails. This can be done through:
    - The Stalwart web interface (if available)
    - Direct database/configuration manipulation
    - Or by adding it to your configuration file

3.  **Recommended:** Create a dedicated account like `noreply@yourdomain.com` for sending transactional emails

### 4. Configure DNS Records

For proper email delivery, you need to configure DNS records for your domain:

1.  **SPF Record (TXT):**
    ```
    v=spf1 mx ip4:YOUR_SERVER_IP ~all
    ```
    Replace `YOUR_SERVER_IP` with your server's IP address.

2.  **DKIM Record:**
    - Stalwart will generate DKIM keys during setup
    - Add the DKIM public key as a TXT record in your DNS
    - Format: `default._domainkey.yourdomain.com`

3.  **DMARC Record (TXT):**
    ```
    v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
    ```

4.  **MX Record (if receiving emails):**
    ```
    yourdomain.com.  MX  10  mail.yourdomain.com.
    ```

5.  **A Record for Mail Server:**
    ```
    mail.yourdomain.com.  A  YOUR_SERVER_IP
    ```

**Important:** DNS changes can take up to 48 hours to propagate.

### 5. Update Your .env File

Update your `.env` file with Stalwart SMTP credentials:

```env
EMAIL_HOST="localhost"
EMAIL_PORT=587
EMAIL_SECURE="false"
EMAIL_USER="noreply@yourdomain.com"
EMAIL_PASSWORD="your_stalwart_account_password"
EMAIL_FROM="noreply@yourdomain.com"
```

**Important Notes:**
- If Stalwart is on the same server, use `localhost` or `127.0.0.1`
- If Stalwart is on a different server, use the server's IP or hostname
- Replace `yourdomain.com` with your actual domain
- The `EMAIL_USER` should be a valid account created in Stalwart
- Port `587` uses STARTTLS, port `465` uses implicit TLS (set `EMAIL_SECURE="true"`)

### 6. Test Email Sending

1.  **Test SMTP Connection:**
    ```bash
    telnet localhost 587
    ```
    Or use a tool like `swaks`:
    ```bash
    sudo apt install swaks
    swaks --to your-email@example.com --from noreply@yourdomain.com --server localhost:587 --auth-user noreply@yourdomain.com --auth-password your_password
    ```

2.  **Test from Your Application:**
    - Place a test order in your store
    - Check if order confirmation email is received
    - Check Stalwart logs: `sudo journalctl -u stalwart -f`

### 7. Security Recommendations

1.  **Firewall Configuration:**
    ```bash
    sudo ufw allow 25/tcp   # SMTP
    sudo ufw allow 587/tcp  # SMTP Submission
    sudo ufw allow 465/tcp  # SMTP over SSL
    sudo ufw allow 143/tcp  # IMAP (if needed)
    sudo ufw allow 993/tcp  # IMAP over SSL (if needed)
    ```

2.  **Disable Unused Services:** Edit `config.toml` to disable any services you don't need

3.  **Change Default Admin Password:** Update the `secret` in the `[authentication.fallback-admin]` section

4.  **Enable Rate Limiting:** Configure rate limits in Stalwart to prevent abuse

For more detailed configuration options, visit: [https://stalw.art/docs/](https://stalw.art/docs/)

---

## Step 5: Build and Initialize

1.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

2.  **Apply Database Migrations** (This will create tables AND seed FeatureFlag data):
    ```bash
    npx prisma migrate deploy
    ```
    *This command applies all migrations, including the one that seeds premium features into the FeatureFlag table.*
    
    **Important:** Use `npx prisma migrate deploy` (not `db push`) in production because:
    - `migrate deploy` runs all migration SQL files, including the one that seeds FeatureFlag data
    - `db push` only applies schema changes and skips migration SQL files
    - Without running migrations, your FeatureFlag table will be empty

3.  **Seed Feature Flags** (If FeatureFlag table is empty, run this):
    ```bash
    npx tsx scripts/seed-all-features.ts
    ```
    *This ensures all premium features are populated in the database.*

4.  **Seed the Database** (Optional, for initial test data):
    ```bash
    npm run seed:test
    ```
    *This creates test users, products, and orders. Skip this if you want a clean production database.*

5.  **Build the Application**:
    ```bash
    npm run build
    ```

---

## Step 6: Process Management (PM2)

Use PM2 to keep your application running in the background.

1.  **Install PM2**:
    ```bash
    sudo npm install -g pm2
    ```

2.  **Start the Application**:
    ```bash
    pm2 start npm --name "ecommerce-platform" -- start
    ```

3.  **Save PM2 List** (So it restarts on reboot):
    ```bash
    pm2 save
    pm2 startup
    ```
    *(Run the command displayed by `pm2 startup` if prompted)*

---

## Step 7: Nginx Configuration

Configure Nginx to proxy requests to your Next.js app.

1.  **Create Nginx Config**:
    ```bash
    sudo nano /etc/nginx/sites-available/ecommerce
    ```

2.  **Paste the following configuration**:
    *(Replace `yourdomain.com` with your actual domain)*

    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable the Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default  # Remove default if not needed
    ```

4.  **Test and Reload Nginx**:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

---

## Step 8: SSL Setup (HTTPS)

Secure your site with a free Let's Encrypt SSL certificate.

1.  **Install Certbot**:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    ```

2.  **Obtain Certificate**:
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```
    *Follow the prompts. Select `2` to redirect HTTP to HTTPS if asked.*

---

## Troubleshooting

*   **App not starting?** Check logs: `pm2 logs ecommerce-platform`
*   **Database errors?** Ensure `DATABASE_URL` is correct in `.env`.
*   **502 Bad Gateway?** Check if the app is running (`pm2 status`) and port 3000 is active.
*   **Permission denied?** Ensure you are using `sudo` where necessary, but avoid running the app itself as root if possible (PM2 handles this).
*   **FeatureFlag table is empty?** Run `npx tsx scripts/seed-all-features.ts` to populate all premium features.
*   **Premium features not showing?** Ensure the FeatureFlag table has been seeded. Check with: `npx prisma studio` and look at the FeatureFlag table.

### Email Troubleshooting (Stalwart)

*   **Emails not sending?**
    - Verify Stalwart is running: `sudo systemctl status stalwart`
    - Check Stalwart logs: `sudo journalctl -u stalwart -n 50`
    - Verify SMTP port is accessible: `telnet localhost 587`
    - Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env` file
    - Verify the email account exists in Stalwart
    - Check firewall rules allow SMTP ports (25, 587, 465)

*   **"Authentication failed" error?**
    - Double-check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env` file
    - Verify the account exists in Stalwart's directory
    - Check Stalwart authentication configuration in `config.toml`
    - Ensure SASL mechanisms are enabled: `mechanisms = ["plain", "login"]`

*   **Connection refused or timeout?**
    - Verify Stalwart is listening on the correct port: `sudo netstat -tlnp | grep 587`
    - Check if Stalwart is bound to the correct interface (0.0.0.0 for all interfaces)
    - Ensure firewall allows connections on port 587
    - If using Docker, verify port mapping is correct

*   **Emails going to spam?**
    - Ensure SPF, DKIM, and DMARC DNS records are properly configured
    - Verify DNS records are propagated: `dig TXT yourdomain.com`
    - Check DKIM signing is enabled in Stalwart configuration
    - Warm up your domain by sending gradually increasing volumes
    - Monitor email delivery logs in Stalwart

*   **Stalwart service not starting?**
    - Check configuration syntax: `stalwart --check-config` (if available)
    - Review error logs: `sudo journalctl -u stalwart -n 100`
    - Verify file permissions on `/opt/stalwart` directory
    - Ensure required ports are not already in use by another service

*   **DNS-related issues?**
    - Use `dig` or `nslookup` to verify DNS records are propagated
    - Wait up to 48 hours for DNS propagation
    - Verify SPF record includes your server's IP address
    - Check DKIM public key is correctly added to DNS

## Maintenance

*   **To update the app**:
    ```bash
    cd /var/www/ecommerce-platform
    git pull
    npm install
    npx prisma generate
    npx prisma migrate deploy
    npm run build
    pm2 restart ecommerce-platform
    ```
    *Note: `npx prisma migrate deploy` applies all pending migrations, including any that seed new features. If you need to seed features manually, run `npx tsx scripts/seed-all-features.ts`.*
