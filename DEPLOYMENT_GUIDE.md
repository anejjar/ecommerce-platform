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

    # Email (SMTP Settings)
    SMTP_HOST="smtp.example.com"
    SMTP_PORT=587
    SMTP_USER="your_email@example.com"
    SMTP_PASSWORD="your_email_password"
    SMTP_FROM="noreply@yourdomain.com"
    ```
    *Press `Ctrl+X`, then `Y`, then `Enter` to save and exit.*

---

## Step 5: Build and Initialize

1.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

2.  **Push Database Schema**:
    ```bash
    npx prisma db push
    ```

3.  **Seed the Database** (Optional, for initial data):
    ```bash
    npm run seed
    ```

4.  **Build the Application**:
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

## Maintenance

*   **To update the app**:
    ```bash
    cd /var/www/ecommerce-platform
    git pull
    npm install
    npx prisma db push
    npm run build
    pm2 restart ecommerce-platform
    ```
