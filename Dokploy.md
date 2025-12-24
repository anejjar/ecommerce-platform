# Dokploy Complete Setup Guide
## E-Commerce Platform Deployment on Contabo VPS

**Target Server Specs:**
- 4 vCPU Cores
- 8 GB RAM
- 75 GB NVMe or 150 GB SSD
- 200 Mbit/s Port

**What you'll achieve:**
- ✅ Secure VPS with proper firewall
- ✅ Dokploy installed with HTTPS
- ✅ MySQL database with automatic backups
- ✅ E-commerce platform deployed with automatic migrations
- ✅ Database seeding (products, categories, admin user)
- ✅ Auto-deploy from GitHub
- ✅ Monitoring and maintenance setup

---

## 🎯 Quick Start for This E-Commerce Platform

This guide has been customized for deploying the **E-Commerce Platform** which requires:

### What's Different from Standard Next.js Deployment:

1. **Database Required**: MySQL database must be created BEFORE deploying the app
2. **Automated Migrations**: Prisma migrations run automatically on deployment
3. **Automated Seeding**: Essential data (admin user, categories, settings) seeded automatically
4. **Special Environment Variables**: Requires Cloudinary, NextAuth, and database credentials
5. **Custom Dockerfile**: Uses multi-stage build with Prisma support

### If you're brand new to Dokploy:
- **Complete Phases 1-4** to set up your VPS and Dokploy
- **Start at Phase 5** for deploying this specific e-commerce platform

### If you already have Dokploy running:
- **Skip to Phase 5** (Deploy E-Commerce Platform)
- Make sure you have a domain with SSL configured

---

# Phase 1: VPS Initial Setup

## Step 1.1: First SSH Connection

### Why This Exists
When Contabo provisions your VPS, they send you root credentials. Your first job is to connect and verify the server is accessible. SSH (Secure Shell) is the encrypted protocol for remote server management.

### Exact Steps

```bash
# From your local terminal (Windows: use PowerShell or WSL)
ssh root@YOUR_SERVER_IP
```

Replace `YOUR_SERVER_IP` with the IP address from your Contabo email.

**First-time connection prompt:**
```
The authenticity of host 'xxx.xxx.xxx.xxx' can't be established.
ED25519 key fingerprint is SHA256:xxxxx
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
Type `yes` and press Enter.

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong IP address | Connection timed out | Double-check Contabo email |
| Firewall blocking | Connection refused | Check your local network/VPN |
| Wrong password | Permission denied | Reset password in Contabo panel |
| SSH not installed locally | Command not found | Install OpenSSH client |

### How to Debug

```bash
# Test if server is reachable
ping YOUR_SERVER_IP

# Verbose SSH for detailed errors
ssh -vvv root@YOUR_SERVER_IP

# Check if port 22 is open
nc -zv YOUR_SERVER_IP 22
```

### What to Do If It Fails
1. **Contabo Panel**: Use the VNC console in Contabo dashboard (emergency access)
2. **Reinstall OS**: Contabo allows OS reinstall from their panel
3. **Support Ticket**: Contact Contabo if IP seems blocked

---

## Step 1.2: System Update

### Why This Exists
Fresh VPS installations often have outdated packages with security vulnerabilities. Updating ensures you have the latest security patches and bug fixes.

### Exact Steps

```bash
# Update package lists
apt update

# Upgrade all packages
apt upgrade -y

# Remove unused packages
apt autoremove -y

# Reboot if kernel was updated
reboot
```

Wait 30 seconds, then reconnect via SSH.

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Not rebooting after kernel update | Old kernel running | Run `reboot` |
| Running out of space during update | No space left on device | Clean up with `apt clean` first |
| Interrupted update | Broken packages | Run `dpkg --configure -a` |

### How to Debug

```bash
# Check for broken packages
dpkg --audit

# Fix broken dependencies
apt --fix-broken install

# Check disk space
df -h
```

### What to Do If It Fails

```bash
# Reset package state
dpkg --configure -a
apt update --fix-missing
apt upgrade -y
```

---

## Step 1.3: Create Non-Root User

### Why This Exists
Running everything as root is dangerous. One mistake can destroy your server. A sudo user can do admin tasks but requires explicit permission, preventing accidental damage.

### Exact Steps

```bash
# Create new user (replace 'deployer' with your preferred username)
adduser deployer

# Add to sudo group
usermod -aG sudo deployer

# Verify sudo works
su - deployer
sudo whoami  # Should output: root
exit  # Back to root
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Weak password | Brute-force vulnerable | Use strong password (12+ chars) |
| Forgetting to add to sudo | "user is not in sudoers" | Run `usermod -aG sudo username` as root |
| Typo in username | Can't login | Create new user, delete wrong one |

### How to Debug

```bash
# Check user exists
id deployer

# Check sudo group membership
groups deployer

# Check sudoers file
cat /etc/group | grep sudo
```

### What to Do If It Fails

```bash
# Delete user and start over
userdel -r wrongusername

# If locked out of sudo, use root to fix
su -
usermod -aG sudo deployer
```

---

## Step 1.4: Configure SSH Security

### Why This Exists
Default SSH allows root login and password authentication, which are major attack vectors. SSH keys are cryptographically secure and can't be brute-forced. Disabling root login forces attackers to guess both username AND key.

### Exact Steps

**On your LOCAL machine:**

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter for default location (~/.ssh/id_ed25519)
# Set a passphrase (recommended) or press Enter for none

# Copy your public key to the server
ssh-copy-id deployer@YOUR_SERVER_IP
```

**On the SERVER (as root):**

```bash
# Backup original config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH config
nano /etc/ssh/sshd_config
```

Find and modify these lines:

```
# Change these settings:
Port 2222                    # Custom port (optional but recommended)
PermitRootLogin no           # Disable root SSH
PasswordAuthentication no    # Disable password login
PubkeyAuthentication yes     # Enable key authentication
```

Save with `Ctrl+O`, `Enter`, `Ctrl+X`.

```bash
# Test config before restarting
sshd -t

# Restart SSH
systemctl restart sshd
```

**CRITICAL: Open new terminal and test BEFORE closing current session:**

```bash
ssh -p 2222 deployer@YOUR_SERVER_IP
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Closing session before testing | Locked out | Use Contabo VNC console |
| Wrong key permissions | Key rejected | `chmod 600 ~/.ssh/id_ed25519` |
| Firewall blocking new port | Connection refused | Allow port in UFW first |
| Typo in config | SSH won't start | Fix with VNC console |

### How to Debug

```bash
# Check SSH service status
systemctl status sshd

# View SSH logs
journalctl -u sshd -f

# Test config syntax
sshd -t
```

### What to Do If It Fails

**If locked out, use Contabo VNC console:**
```bash
# Login via VNC as root
# Restore backup config
cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
systemctl restart sshd
```

### Alternative: Keep Password Auth Temporarily

```bash
# Less secure but safer for beginners:
PasswordAuthentication yes
PermitRootLogin no
# Disable password auth later after confirming key auth works
```

---

## Step 1.5: Configure Firewall (UFW)

### Why This Exists
UFW (Uncomplicated Firewall) blocks all incoming traffic except what you explicitly allow. Without it, any service you accidentally expose is vulnerable. It's your first line of defense against attacks.

### Exact Steps

```bash
# Install UFW (usually pre-installed)
apt install ufw -y

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (use your custom port if changed)
ufw allow 2222/tcp comment 'SSH'

# Allow Dokploy ports
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 3000/tcp comment 'Dokploy Panel'

# Enable firewall
ufw enable
```

Type `y` when prompted.

```bash
# Verify rules
ufw status verbose
```

Expected output:
```
Status: active

To                         Action      From
--                         ------      ----
2222/tcp (SSH)             ALLOW IN    Anywhere
80/tcp (HTTP)              ALLOW IN    Anywhere
443/tcp (HTTPS)            ALLOW IN    Anywhere
3000/tcp (Dokploy Panel)   ALLOW IN    Anywhere
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Not allowing SSH first | Locked out | Use VNC to disable UFW |
| Using wrong port number | SSH blocked | Allow correct port via VNC |
| Forgetting to enable UFW | No protection | Run `ufw enable` |
| Denying outgoing traffic | Updates fail | `ufw default allow outgoing` |

### How to Debug

```bash
# Check UFW status
ufw status numbered

# Check system logs for blocked connections
journalctl | grep UFW

# Test port connectivity (from another machine)
nc -zv YOUR_SERVER_IP 80
```

### What to Do If It Fails

**If locked out:**
```bash
# From Contabo VNC console
ufw disable
ufw allow 22/tcp  # or your SSH port
ufw enable
```

### Alternative: iptables (Advanced)

```bash
# Direct iptables rules (if UFW doesn't work)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
iptables -A INPUT -j DROP

# Save rules
apt install iptables-persistent -y
netfilter-persistent save
```

---

## Step 1.6: Set Timezone and Hostname

### Why This Exists
Correct timezone ensures logs have accurate timestamps for debugging. A meaningful hostname helps identify the server in logs and prompts.

### Exact Steps

```bash
# List available timezones
timedatectl list-timezones | grep Africa

# Set timezone (example: Africa/Casablanca for Morocco)
timedatectl set-timezone Africa/Casablanca

# Verify
date

# Set hostname
hostnamectl set-hostname dokploy-server

# Update hosts file
nano /etc/hosts
```

Add line:
```
127.0.1.1 dokploy-server
```

```bash
# Apply hostname (requires logout/login)
exec bash
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong timezone format | Invalid timezone | Use exact name from `list-timezones` |
| Missing hosts entry | Hostname warnings | Add `127.0.1.1 hostname` to `/etc/hosts` |

### How to Debug

```bash
# Check current settings
timedatectl
hostnamectl
```

---

## Step 1.7: Install Fail2Ban

### Why This Exists
Fail2Ban monitors log files and automatically bans IPs that show malicious behavior (like repeated failed login attempts). It's your automated security guard.

### Exact Steps

```bash
# Install
apt install fail2ban -y

# Create local config
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit config
nano /etc/fail2ban/jail.local
```

Find `[sshd]` section and ensure:

```ini
[sshd]
enabled = true
port = 2222          # Your SSH port
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600       # 1 hour ban
findtime = 600       # 10 minute window
```

```bash
# Start and enable
systemctl enable fail2ban
systemctl start fail2ban

# Check status
fail2ban-client status sshd
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong port in jail.local | SSH attacks not blocked | Match your SSH port |
| Editing jail.conf directly | Changes lost on update | Edit jail.local instead |

### How to Debug

```bash
# View banned IPs
fail2ban-client status sshd

# Unban an IP
fail2ban-client set sshd unbanip YOUR_IP

# Check logs
tail -f /var/log/fail2ban.log
```

---

# Phase 2: Docker & Dokploy Installation

## Step 2.1: Install Docker

### Why This Exists
Dokploy uses Docker to containerize applications. Docker provides isolation, reproducibility, and easy deployment. While Dokploy's installer can install Docker, doing it manually gives you more control and understanding.

### Exact Steps

```bash
# Remove old Docker versions
apt remove docker docker-engine docker.io containerd runc 2>/dev/null

# Install prerequisites
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Add your user to docker group (optional, for non-root docker access)
usermod -aG docker deployer
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Old Docker from apt | Outdated version | Use official Docker repo |
| Not adding user to docker group | Permission denied | `usermod -aG docker username` |
| Missing dependencies | GPG errors | Install ca-certificates and curl |

### How to Debug

```bash
# Check Docker service
systemctl status docker

# Test Docker
docker run hello-world

# Check logs
journalctl -u docker -f
```

### What to Do If It Fails

```bash
# Complete reinstall
apt purge docker-ce docker-ce-cli containerd.io -y
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
# Then follow install steps again
```

### Alternative: Snap Install

```bash
# Simpler but less control
snap install docker
```

---

## Step 2.2: Initialize Docker Swarm

### Why This Exists
Dokploy uses Docker Swarm for orchestration. Swarm mode enables services, secrets, and rolling updates. Even for a single server, Swarm provides better service management than standalone Docker.

### Exact Steps

```bash
# Initialize Swarm with your server's public IP
docker swarm init --advertise-addr YOUR_SERVER_IP

# Verify
docker info | grep Swarm
```

Expected output: `Swarm: active`

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong advertise address | Network errors | Use public IP from Contabo |
| Multiple IPs on server | Must specify address error | Add `--advertise-addr` flag |
| Swarm already initialized | Error message | Run `docker swarm leave --force` first |

### How to Debug

```bash
# Check swarm status
docker node ls

# View swarm info
docker info | grep -A 20 Swarm
```

### What to Do If It Fails

```bash
# Leave swarm and reinitialize
docker swarm leave --force
docker swarm init --advertise-addr YOUR_SERVER_IP
```

---

## Step 2.3: Install Dokploy

### Why This Exists
Dokploy is your PaaS (Platform as a Service) layer. It provides a web UI to deploy applications, manage databases, handle SSL certificates, and configure domains—all without writing deployment scripts.

### Exact Steps

```bash
# Run as root
curl -sSL https://dokploy.com/install.sh | sh
```

Installation takes 2-5 minutes. Watch for errors.

**Expected output:**
```
Dokploy is now running!
Access the panel at: http://YOUR_SERVER_IP:3000
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Port 3000 in use | Installation fails | Stop conflicting service |
| Port 80/443 in use | Traefik won't start | `apt remove nginx apache2` |
| Low memory during install | OOM killer | Add swap space |
| Docker not running | Cannot connect to Docker | `systemctl start docker` |

### How to Debug

```bash
# Check Dokploy containers
docker ps | grep dokploy

# Check Dokploy logs
docker logs dokploy

# Check all services
docker service ls
```

### What to Do If It Fails

```bash
# Remove and reinstall
docker service rm $(docker service ls -q) 2>/dev/null
docker rm -f $(docker ps -aq) 2>/dev/null
curl -sSL https://dokploy.com/install.sh | sh
```

### Alternative: Manual Installation

```bash
# If the script fails, use Docker directly
docker network create --driver overlay dokploy-network

docker run -d \
  --name dokploy \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v dokploy-data:/app/data \
  dokploy/dokploy:latest
```

---

## Step 2.4: Access Dokploy Panel

### Why This Exists
The web panel is your control center. First access creates the admin account that controls everything—deployments, domains, databases, and server settings.

### Exact Steps

1. Open browser: `http://YOUR_SERVER_IP:3000`
2. Create admin account:
   - Email: your-email@example.com
   - Password: Strong password (save it!)
3. Click "Create Account"

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Firewall blocking 3000 | Connection refused | `ufw allow 3000/tcp` |
| Using HTTPS | Connection failed | Use HTTP initially |
| Weak admin password | Security risk | Use 16+ character password |
| Forgetting credentials | Locked out | Reset via CLI (see below) |

### How to Debug

```bash
# Check if Dokploy is listening
ss -tlnp | grep 3000

# Check Dokploy container
docker logs dokploy 2>&1 | tail -50
```

### What to Do If It Fails

```bash
# Reset admin password
docker exec -it dokploy npx prisma db push --force-reset
# Then create new account at http://YOUR_SERVER_IP:3000
```

---

# Phase 3: Domain & SSL Setup

## Step 3.1: Point Domain to Server

### Why This Exists
Your domain needs to point to your server's IP for SSL certificates to work. Let's Encrypt validates domain ownership by connecting to your server—if DNS isn't set up, validation fails.

### Exact Steps

**In your domain registrar (e.g., Cloudflare, Namecheap, GoDaddy):**

1. Go to DNS settings
2. Add A record:
   - Name: `@` (or your subdomain like `deploy`)
   - Type: `A`
   - Value: `YOUR_SERVER_IP`
   - TTL: 300 (5 minutes)

3. Add A record for Dokploy panel:
   - Name: `dokploy`
   - Type: `A`
   - Value: `YOUR_SERVER_IP`
   - TTL: 300

**If using Cloudflare:**
- Set Proxy status to "DNS only" (grey cloud) initially
- Switch to "Proxied" (orange cloud) after SSL is working

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| DNS not propagated | SSL validation fails | Wait 5-30 minutes |
| Wrong IP address | Connection refused | Verify IP in Contabo panel |
| Cloudflare proxy on | SSL conflicts | Disable proxy initially |
| AAAA record without IPv6 | Random connection failures | Remove AAAA or configure IPv6 |

### How to Debug

```bash
# Check DNS propagation
dig yourdomain.com +short
dig dokploy.yourdomain.com +short

# Alternative check
nslookup yourdomain.com 8.8.8.8

# Check from server itself
curl -I http://yourdomain.com
```

### What to Do If It Fails

1. Wait longer (DNS can take up to 48 hours, usually 5-30 minutes)
2. Try different DNS (Cloudflare: 1.1.1.1, Google: 8.8.8.8)
3. Clear DNS cache locally: `ipconfig /flushdns` (Windows) or `sudo systemd-resolve --flush-caches` (Linux)

---

## Step 3.2: Configure Dokploy Domain with SSL

### Why This Exists
Running Dokploy on IP:port is insecure (no encryption) and unprofessional. Adding a domain with SSL encrypts all traffic and enables features like webhooks that require HTTPS.

### Exact Steps

1. **In Dokploy Panel** → Settings (gear icon in sidebar)
2. **Server Domain section:**
   - Domain: `dokploy.yourdomain.com`
   - Certificate Provider: `Let's Encrypt`
   - Email: `your-email@example.com` (for certificate notifications)
3. Click **Save**
4. Wait 1-2 minutes for certificate generation

5. **Verify**: Open `https://dokploy.yourdomain.com`
   - Should show Dokploy login with valid SSL (padlock icon)

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| DNS not pointing to server | Certificate fails | Verify with `dig domain` |
| Port 80 blocked | ACME challenge fails | `ufw allow 80/tcp` |
| Cloudflare proxy enabled | SSL conflicts | Disable proxy (grey cloud) |
| Wrong email format | Validation error | Use valid email |

### How to Debug

```bash
# Check Traefik logs (handles SSL)
docker logs $(docker ps -q -f name=dokploy-traefik) 2>&1 | tail -100

# Check certificate status
docker exec $(docker ps -q -f name=dokploy-traefik) cat /letsencrypt/acme.json | jq '.letsencrypt.Certificates'

# Test SSL manually
openssl s_client -connect dokploy.yourdomain.com:443 -servername dokploy.yourdomain.com
```

### What to Do If It Fails

1. **Remove and re-add domain** in Dokploy settings
2. **Check Traefik container:**
```bash
docker service logs dokploy-traefik
```
3. **Restart Traefik:**
```bash
docker service update --force dokploy-traefik
```

### Alternative: Cloudflare SSL (Full Strict)

If Let's Encrypt keeps failing:

1. **Cloudflare Dashboard** → SSL/TLS → Origin Server
2. Create Origin Certificate (15 years)
3. Copy certificate and key
4. **Dokploy** → Certificates → Add Certificate
5. Paste certificate data
6. Set domain to use this certificate

---

## Step 3.3: Disable IP:Port Access

### Why This Exists
Once HTTPS works, the HTTP port 3000 is a security risk. Anyone can access your panel without encryption, potentially intercepting credentials.

### Exact Steps

**Only after confirming https://dokploy.yourdomain.com works!**

```bash
# Remove public port 3000
docker service update --publish-rm "published=3000,target=3000,mode=host" dokploy
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Running before SSL works | Locked out | Re-add port (see below) |
| Typo in command | Port still open | Re-run correct command |

### How to Debug

```bash
# Check if port is still exposed
ss -tlnp | grep 3000
docker service inspect dokploy --format '{{json .Endpoint.Ports}}'
```

### What to Do If It Fails

**If locked out (HTTPS not working):**
```bash
# Re-enable port 3000
docker service update --publish-add "published=3000,target=3000,mode=host" dokploy
```

---

# Phase 4: GitHub Integration

## Step 4.1: Create GitHub OAuth App

### Why This Exists
GitHub integration allows Dokploy to access your repositories and set up automatic deployments. OAuth is more secure than personal access tokens because it has limited scope and can be revoked.

### Exact Steps

1. **GitHub** → Settings → Developer Settings → OAuth Apps → New OAuth App

2. Fill in:
   - Application name: `Dokploy`
   - Homepage URL: `https://dokploy.yourdomain.com`
   - Authorization callback URL: `https://dokploy.yourdomain.com/api/auth/callback/github`

3. Click **Register application**

4. Copy **Client ID**

5. Click **Generate a new client secret** → Copy secret

6. **Dokploy** → Settings → Git Providers → GitHub → Add GitHub

7. Paste Client ID and Secret → Save

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong callback URL | OAuth error | Must match exactly |
| HTTP instead of HTTPS | Callback fails | Use https:// |
| Trailing slash mismatch | Auth fails | Remove/add trailing slash consistently |

### How to Debug

1. Check callback URL matches exactly
2. Verify GitHub app is active (not suspended)
3. Check Dokploy logs for OAuth errors

### Alternative: Git URL (No GitHub Integration)

```bash
# Use direct Git URL instead
# In Dokploy, select "Git" provider and enter:
https://github.com/username/repo.git
```

---

## Step 4.2: Install GitHub App (for Auto-Deploy)

### Why This Exists
The GitHub App enables webhooks for automatic deployment when you push code. It's more powerful than OAuth alone—it can access private repos and receive push events.

### Exact Steps

1. **Dokploy** → Settings → Git Providers → GitHub

2. Click **Install GitHub App**

3. GitHub opens → Select account/organization

4. Choose repositories:
   - All repositories, OR
   - Only select repositories (more secure)

5. Click **Install**

6. Verify: In Dokploy, your repos should now appear in dropdown when creating applications

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Installing on wrong account | Repos not visible | Reinstall on correct account |
| Not selecting repos | Empty dropdown | Add repos in GitHub app settings |
| Organization restrictions | Installation blocked | Org admin must approve |

### How to Debug

1. **GitHub** → Settings → Applications → Installed Apps
2. Check "Dokploy" is listed
3. Click Configure → Verify repository access

---

# Phase 5: Deploy E-Commerce Platform

## Pre-Deployment Checklist

Before deploying, make sure you have:

### ✅ Prerequisites Completed
- [ ] VPS setup with Dokploy installed (Phase 1-2)
- [ ] Domain pointing to your server (Phase 3)
- [ ] SSL certificate configured for Dokploy panel (Phase 3)
- [ ] GitHub integration enabled (Phase 4)

### ✅ Required Accounts & Credentials
- [ ] **Cloudinary Account** (for image uploads)
  - Cloud Name
  - API Key
  - API Secret
  - Sign up: https://cloudinary.com (free tier available)

- [ ] **Generated Secrets**
  - NEXTAUTH_SECRET (32+ characters random string)
  - Database passwords (auto-generated in Dokploy)

### ✅ Optional (Can Configure Later)
- [ ] Email SMTP credentials (Gmail, SendGrid, etc.)
- [ ] Stripe account for payments
- [ ] AWS S3 for database backups

### 📋 Deployment Order

**IMPORTANT:** Follow this exact order:

1. **Step 5.1**: Verify repository is ready
2. **Step 5.2**: Create MySQL database FIRST
3. **Step 5.3**: Create application service
4. **Step 5.4**: Link GitHub repository
5. **Step 5.5**: Configure environment variables
6. **Step 5.6**: Set build type to Dockerfile
7. **Step 5.7**: Deploy! (migrations and seeding happen automatically)
8. **Step 5.8**: Add domain with SSL
9. **Step 5.9**: Enable auto-deploy

**Estimated time:** 20-30 minutes (first deployment takes 5-8 minutes)

---

## Step 5.1: Prepare Your Repository

### Why This Exists
This e-commerce platform requires database setup, migrations, and seeding. The project is already configured with a Dockerfile and automated setup scripts, so deployment is streamlined.

### Exact Steps

**Verify your project has these files (already included):**

1. **`Dockerfile`** - Multi-stage build with Prisma support ✅
2. **`docker-entrypoint.sh`** - Automatic migrations and seeding ✅
3. **`.dockerignore`** - Optimized build performance ✅
4. **`next.config.js`** - Standalone output enabled ✅

**All files are ready! Just commit any local changes:**

```bash
# Check status
git status

# If you have uncommitted changes, commit them
git add .
git commit -m "Ready for Dokploy deployment"
git push origin main
```

### What Happens on Deploy
The Docker entrypoint script automatically:
1. ✅ Waits for database connection
2. ✅ Runs Prisma migrations (`prisma migrate deploy`)
3. ✅ Seeds essential data (categories, settings, etc.)
4. ✅ Optionally seeds production data
5. ✅ Starts the Next.js application

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Missing DATABASE_URL | Container crashes | Set environment variable in Dokploy |
| Uncommitted changes | Old code deployed | Commit and push all changes |
| Wrong database provider | Migration fails | Use MySQL database in Dokploy |

---

## Step 5.2: Create MySQL Database First

### Why This Exists
The e-commerce platform requires a MySQL database. We create it BEFORE the application so the DATABASE_URL is ready during first deployment.

### Exact Steps

1. **Dokploy Dashboard** → Click **+ Create Project**
2. Enter name: `ecommerce-platform`
3. Click **Create**

4. Click your project → **+ Create Service** → **Database**

5. Select **MySQL**

6. Configure:
   - **Name**: `ecommerce-db`
   - **Database Name**: `ecommerce`
   - **Root Password**: Click generate icon (save this password!)
   - **Username**: `ecommerce_user`
   - **User Password**: Click generate icon (save this password!)

7. Click **Create**

8. Wait 30-60 seconds for database to start

9. **Copy the connection string:**
   - Click on `ecommerce-db` service
   - Note the internal hostname: `ecommerce-db`
   - Your DATABASE_URL will be:
   ```
   mysql://ecommerce_user:YOUR_PASSWORD@ecommerce-db:3306/ecommerce
   ```

**IMPORTANT:** Save this connection string! You'll need it in Step 5.4.

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Creating app before database | First deploy fails | Always create database first |
| Using localhost | Connection refused | Use container name `ecommerce-db` |
| Weak passwords | Security risk | Use generated passwords |
| Wrong database type | Prisma errors | Must use MySQL (not PostgreSQL) |

### How to Verify Database is Running

```bash
# SSH into your server
ssh -p 2222 deployer@YOUR_SERVER_IP

# Check database container
docker ps | grep ecommerce-db

# Should show a running MySQL container
```

---

## Step 5.3: Create Application Service

### Why This Exists
Now that the database exists, we can create the application service that will connect to it.

### Exact Steps

1. In `ecommerce-platform` project → **+ Create Service**
2. Select **Application**
3. Enter name: `ecommerce-app`
4. Click **Create**

---

## Step 5.4: Configure Repository

### Why This Exists
Link your GitHub repository so Dokploy knows what code to deploy.

### Exact Steps

1. **Application** (`ecommerce-app`) → **General** tab

2. **Provider**: Select `Github`

3. **Repository**: Select `ecommerce-platform` from dropdown

4. **Branch**: `main`

5. **Build Path**: `/` (project is at repo root)

6. Click **Save**

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Repo not appearing | GitHub App not installed | Complete Phase 4 first |
| Wrong branch | Old code deployed | Verify branch name |

---

## Step 5.5: Configure Environment Variables (Critical!)

### Why This Exists
The application needs these variables to connect to the database, handle authentication, send emails, and manage file uploads.

### Exact Steps

1. **Application** → **Environment** tab

2. **Copy and paste these variables, replacing values with your actual credentials:**

```bash
# ===================================
# REQUIRED - Application won't start without these
# ===================================

# Database (use the connection string from Step 5.2)
DATABASE_URL=mysql://ecommerce_user:YOUR_DB_PASSWORD@ecommerce-db:3306/ecommerce

# NextAuth (for user authentication)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=GENERATE_RANDOM_32_CHAR_STRING_HERE

# ===================================
# REQUIRED - File Uploads (Cloudinary)
# ===================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ===================================
# OPTIONAL - Can add later
# ===================================

# Email (for order notifications - can skip initially)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourstore.com

# Payment Gateway (Stripe - can skip initially)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Your Store Name

# Optional: Control seeding behavior
# SEED_PRODUCTION_DATA=true  # Uncomment to seed sample products
# SKIP_MIGRATIONS=false      # Set true to skip migrations (not recommended)
# SKIP_SEEDING=false         # Set true to skip seeding (not recommended)
```

3. **Generate NEXTAUTH_SECRET:**
```bash
# On your local machine, run:
openssl rand -base64 32

# Copy the output and paste as NEXTAUTH_SECRET value
```

4. **Setup Cloudinary (Free tier available):**
   - Go to https://cloudinary.com and create free account
   - Dashboard shows: Cloud Name, API Key, API Secret
   - Copy these values to environment variables

5. Click **Save**

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Missing DATABASE_URL | Container crashes on startup | Add database connection string |
| Wrong database hostname | "Can't connect to MySQL server" | Use `ecommerce-db` not `localhost` |
| Missing NEXTAUTH_SECRET | Auth errors | Generate with `openssl rand -base64 32` |
| Weak NEXTAUTH_SECRET | Security vulnerability | Must be 32+ characters |
| NEXTAUTH_URL wrong | Login redirects fail | Must match your domain with https:// |
| Missing Cloudinary vars | Image upload fails | Create Cloudinary account |
| Quotes around values | Parsing errors | Don't wrap values in quotes |

---

## Step 5.6: Configure Build Settings

### Why This Exists
This project includes a custom Dockerfile optimized for Prisma and database migrations. We must use it instead of Nixpacks.

### Exact Steps

1. **Application** → **General** tab → Build Type section

2. **Build Type**: Select `Dockerfile`

3. **Dockerfile Path**: Leave as `Dockerfile` (already exists in repo)

4. Click **Save**

**The Dockerfile automatically:**
- ✅ Installs dependencies
- ✅ Generates Prisma client
- ✅ Builds Next.js in production mode
- ✅ Includes entrypoint script for migrations
- ✅ Sets up proper permissions

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Using Nixpacks | Migrations don't run | Must use Dockerfile build type |
| Custom dockerfile path | Build fails | Use default `Dockerfile` |

---

## Step 5.7: Deploy Application

### Why This Exists
This is where everything comes together. Dokploy will build your app, run migrations, seed the database, and start the server.

### Exact Steps

1. **Application** (`ecommerce-app`) → **Deployments** tab
2. Click **Deploy**
3. Watch the build logs in real-time (will take 3-7 minutes first time)

**Build stages you'll see:**

**Phase 1: Building (3-5 minutes)**
```
→ Cloning repository from GitHub
→ Building Docker image...
  ├─ Stage 1: Installing dependencies
  ├─ Stage 2: Generating Prisma client
  ├─ Stage 3: Building Next.js app
  └─ Stage 4: Creating production image
→ Build complete!
```

**Phase 2: Starting Container (30-60 seconds)**
```
→ Starting container...
→ Running entrypoint script...
```

**Phase 3: Database Setup (1-2 minutes) - AUTOMATIC!**
```
🚀 Starting application initialization...
⏳ Waiting for database to be ready...
✅ Database is ready!
🔄 Running database migrations...
✅ Migrations completed successfully
🌱 Seeding essential data...
✅ Essential data seeded successfully
🎉 Initialization complete! Starting application...
```

**Phase 4: Application Running**
```
✓ Ready on http://0.0.0.0:3000
```

4. **Wait for "Deployment successful"** - Total time: ~5-8 minutes

### What Gets Seeded Automatically

The essential seed script creates:
- ✅ Default admin user (check seed file for credentials)
- ✅ Basic categories and product templates
- ✅ System settings and configurations
- ✅ Payment and shipping methods
- ✅ Default roles and permissions

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| DATABASE_URL not set | Container crashes immediately | Add to environment variables |
| Wrong database hostname | "Can't connect to MySQL server" | Use `ecommerce-db` not `localhost` |
| Database not running | Migration fails | Verify database container is running |
| Out of memory | "Killed" in logs | Add swap space (see troubleshooting) |
| Prisma migration fails | "Migration failed" | Check database is MySQL, not PostgreSQL |

### How to Debug

```bash
# SSH into server
ssh -p 2222 deployer@YOUR_SERVER_IP

# View application logs (watch migrations and seeding)
docker logs -f $(docker ps -q -f name=ecommerce-app)

# Check if database is accessible from app container
docker exec -it $(docker ps -q -f name=ecommerce-app) sh
nc -zv ecommerce-db 3306

# View database logs
docker logs $(docker ps -q -f name=ecommerce-db)

# Check running containers
docker ps
```

### What to Do If It Fails

**Build fails:**
1. Check build logs for specific error
2. Try building locally first: `docker build -t test .`
3. Verify Dockerfile is present in repo

**Migration fails:**
```bash
# Check Prisma schema syntax
npx prisma validate

# Verify DATABASE_URL format
# Must be: mysql://user:pass@host:3306/dbname
```

**Container crashes after "Starting application":**
```bash
# View full container logs
docker logs $(docker ps -aq -f name=ecommerce-app) | tail -100

# Common issues:
# - Missing NEXTAUTH_SECRET
# - Wrong DATABASE_URL format
# - Missing Cloudinary credentials
```

**Seed script fails (non-critical):**
- App will still start, but may have missing data
- Check logs for "Seeding essentials failed"
- Can manually run: `docker exec -it <container> npx tsx prisma/seed-essentials.ts`

---

## Step 5.8: Add Domain to Application

### Why This Exists
Without a domain, your app is only accessible via internal Docker networking. Adding a domain configures Traefik (the reverse proxy) to route external traffic to your container.

### Exact Steps

1. **Application** → **Domains** tab

2. Click **Add Domain**

3. Fill in:
   - **Host**: `app.yourdomain.com`
   - **Path**: `/`
   - **Port**: `3000` (Next.js default)
   - **HTTPS**: ✓ Enable
   - **Certificate**: `Let's Encrypt`

4. Click **Create**

5. Wait 1-2 minutes for SSL certificate

6. Visit `https://app.yourdomain.com`

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| DNS not configured | Certificate fails | Add A record pointing to server |
| Wrong port | 502 Bad Gateway | Next.js uses 3000 by default |
| App listening on 127.0.0.1 | Can't connect | App must listen on 0.0.0.0 |
| Certificate generation fails | HTTP works, HTTPS doesn't | Check port 80 is open |

### How to Debug

```bash
# Check Traefik routing
docker exec $(docker ps -q -f name=dokploy-traefik) traefik version

# View Traefik logs
docker logs $(docker ps -q -f name=dokploy-traefik) 2>&1 | grep "app.yourdomain.com"

# Test SSL certificate
curl -vI https://app.yourdomain.com 2>&1 | grep -i "ssl\|certificate"
```

### Alternative: Free traefik.me Domain

If you don't have a domain yet:

1. **Domains** → Click **Generate Domain**
2. Get URL like: `abc123.traefik.me`
3. Note: HTTP only (no HTTPS)

---

## Step 5.9: Enable Auto-Deploy

### Why This Exists
Auto-deploy triggers a new deployment whenever you push to the configured branch. No manual clicking—push code and it's live in minutes. Essential for CI/CD workflow.

### Exact Steps

1. **Application** → **General** tab

2. Find **Auto Deploy** section

3. Toggle **Enabled**

4. Select trigger:
   - **Push**: Deploy on every push (recommended)
   - **Tag**: Deploy only when tags are pushed

5. Click **Save**

6. **Test**: Make a small change locally, commit, and push:
```bash
# Make a change
echo "// test" >> src/app/page.tsx
git add . && git commit -m "Test auto-deploy"
git push origin main
```

7. Watch Dokploy—deployment should start automatically!

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| GitHub webhook not configured | No auto-deploy | Check GitHub App installation |
| Wrong branch | Pushes ignored | Verify branch in settings |
| Webhook delivery fails | Auto-deploy sporadic | Check GitHub webhook history |

### How to Debug

**GitHub** → Your repo → Settings → Webhooks
- Check "Recent Deliveries"
- Look for failures (red X)
- View payload and response

---

# Phase 6: E-Commerce Platform Management

## Step 6.1: Access Admin Panel

### Why This Exists
After deployment, you need to access the admin panel to manage your store, add products, and configure settings.

### Exact Steps

1. **Visit your store**: `https://yourdomain.com`

2. **Find default admin credentials** in seed script:
   ```bash
   # On your local machine (in project directory)
   cat prisma/seed-essentials.ts | grep -A 5 "admin"

   # Or view directly in GitHub
   ```

3. **Login to admin panel**: `https://yourdomain.com/admin`

4. **IMPORTANT: Change admin password immediately:**
   - Go to Admin → Profile Settings
   - Update password to something secure
   - Save changes

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Can't find admin credentials | Login fails | Check seed-essentials.ts file |
| Domain not working | Connection refused | Complete Phase 5 Step 5.8 first |
| Using HTTP instead of HTTPS | Security warnings | Use https:// in URL |

---

## Step 6.2: Configure Store Settings

### Why This Exists
Your store needs basic configuration before accepting real orders.

### Exact Steps

1. **Admin Panel** → **Settings**

2. **Store Information:**
   - Store Name
   - Store Description
   - Contact Email
   - Phone Number
   - Address

3. **Currency & Regional:**
   - Default Currency
   - Timezone
   - Language

4. **Email Templates:** (if EMAIL_* vars configured)
   - Order Confirmation Template
   - Shipping Notification Template
   - Welcome Email Template

5. Click **Save Settings**

---

## Step 6.3: Database Backup Configuration

### Why This Exists
Database backups protect against data loss. Your e-commerce data is critical.

### Exact Steps

**In Dokploy:**

1. Click on `ecommerce-db` (MySQL database service)

2. **Backups** tab

3. **Configure destination:**
   - **Local**: Stored on server (quick but risky)
   - **S3**: Recommended for production
     - Create AWS S3 bucket
     - Add Access Key ID and Secret
     - Set bucket name and region

4. **Schedule:**
   - Frequency: `Daily`
   - Time: `03:00` (3 AM)
   - Retention: `7 days` (or more for production)

5. Click **Enable Backup**

6. **Test backup immediately:**
   - Click **Backup Now**
   - Wait for completion
   - Verify backup appears in list

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Only local backups | Lost with server failure | Use S3 or external storage |
| No backups at all | Data loss risk | Configure immediately |
| Never testing restore | Corrupt backups | Test restore monthly |

### How to Restore from Backup

```bash
# SSH into server
ssh -p 2222 deployer@YOUR_SERVER_IP

# List available backups
docker exec -it $(docker ps -q -f name=ecommerce-db) ls /backups

# Restore from backup (WARNING: This will replace current data!)
# 1. Stop application first
docker stop $(docker ps -q -f name=ecommerce-app)

# 2. Restore database
docker exec -i $(docker ps -q -f name=ecommerce-db) \
  mysql -u root -p ecommerce < /backups/backup-2024-01-01.sql

# 3. Restart application
docker start $(docker ps -q -f name=ecommerce-app)
```

---

## Step 6.4: Manual Database Management

### Why This Exists
Sometimes you need direct database access for debugging, data cleanup, or manual operations.

### Exact Steps

**Access MySQL directly:**

```bash
# SSH into server
ssh -p 2222 deployer@YOUR_SERVER_IP

# Connect to MySQL
docker exec -it $(docker ps -q -f name=ecommerce-db) \
  mysql -u ecommerce_user -p ecommerce

# Enter the database password when prompted
```

**Common commands:**

```sql
-- View all tables
SHOW TABLES;

-- Count products
SELECT COUNT(*) FROM Product;

-- View recent orders
SELECT * FROM `Order` ORDER BY createdAt DESC LIMIT 10;

-- Check admin users
SELECT id, email, role FROM User WHERE role = 'ADMIN';

-- Exit
EXIT;
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Using production for testing queries | Accidental data deletion | Always backup first |
| Running DELETE without WHERE | All data deleted | ALWAYS use WHERE clause |
| Not backing up before manual changes | Can't undo mistakes | Backup first! |

---

## Step 6.5: Re-seeding or Resetting Database

### Why This Exists
During development or after major changes, you may need to reset the database to a clean state.

### Exact Steps

**WARNING: This will DELETE ALL DATA!**

```bash
# SSH into server
ssh -p 2222 deployer@YOUR_SERVER_IP

# Get application container ID
docker ps -f name=ecommerce-app

# Option 1: Re-run migrations and seeds (keeps schema)
docker exec -it <container-id> npx prisma migrate deploy
docker exec -it <container-id> npx tsx prisma/seed-essentials.ts

# Option 2: Full reset (DANGER: drops all tables)
docker exec -it <container-id> npx prisma migrate reset --force
docker exec -it <container-id> npx tsx prisma/seed-essentials.ts

# Option 3: Seed production sample data
docker exec -it <container-id> npx tsx prisma/seed-production.ts
```

### Alternative: Redeploy with Environment Variable

1. **Application** → **Environment**
2. Add: `SEED_PRODUCTION_DATA=true`
3. Click **Save**
4. **Redeploy** application

**Note:** This only works on first deployment. To reseed existing database, use manual commands above.

---

# Phase 7: Monitoring & Maintenance

## Step 7.1: Set Up Monitoring

### Why This Exists
Without monitoring, you won't know when your server runs out of memory, disk space, or CPU—until your app crashes. Proactive monitoring prevents outages.

### Exact Steps

**In Dokploy:**

1. **Dashboard** shows basic metrics (CPU, RAM, Disk)
2. **Application** → **Monitoring** tab shows app-specific metrics

**For alerts, set up Dokploy notifications:**

1. **Settings** → **Notifications**
2. Add notification channel:
   - **Discord**: Paste webhook URL
   - **Slack**: Paste webhook URL
   - **Email**: Configure SMTP

3. Enable notifications for:
   - Deployment success/failure
   - High resource usage
   - SSL certificate expiration

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| No monitoring | Surprise outages | Set up at minimum disk alerts |
| Too many alerts | Alert fatigue | Tune thresholds appropriately |

---

## Step 7.2: Configure Backups

### Why This Exists
Databases can fail. Backups are your insurance policy. Without backups, a database corruption or accidental deletion means permanent data loss.

### Exact Steps

**For PostgreSQL:**

1. **Database service** → **Backups** tab

2. **Configure destination:**
   - Local (stored on server)
   - S3 (recommended for disaster recovery)

3. **Schedule:**
   - Frequency: Daily
   - Retention: 7 days

4. **Enable** backup schedule

5. **Test restore:**
   - Create manual backup
   - Create test database
   - Restore backup to test database
   - Verify data integrity

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| No backups | Data loss on failure | Configure immediately |
| Backups on same server | Lost with server | Use S3 or external storage |
| Never testing restores | Corrupt/incomplete backups | Test monthly |

---

## Step 7.3: Update Dokploy

### Why This Exists
Updates bring security patches, bug fixes, and new features. Running outdated software is a security risk.

### Exact Steps

```bash
# Check current version (in Dokploy Settings)
# Or via CLI:
docker inspect dokploy --format='{{.Config.Image}}'

# Update Dokploy
curl -sSL https://dokploy.com/install.sh | sh
```

**Recommended schedule:** Check monthly for updates

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Never updating | Security vulnerabilities | Schedule monthly updates |
| Updating without backup | Can't rollback | Backup database first |

### How to Debug

```bash
# Check Dokploy logs after update
docker logs dokploy | tail -100

# Rollback if needed
docker pull dokploy/dokploy:previous-version
```

---

## Step 7.4: Disk Cleanup

### Why This Exists
Docker images and build cache accumulate over time. A full disk causes deployments to fail and can crash your server.

### Exact Steps

```bash
# Check disk usage
df -h

# Clean Docker (removes unused images, containers, volumes)
docker system prune -a --volumes

# When prompted, type 'y' to confirm

# Check disk again
df -h
```

**Automate with cron:**

```bash
# Add to crontab
crontab -e

# Add line (runs weekly on Sunday at 3 AM):
0 3 * * 0 docker system prune -af --volumes >> /var/log/docker-cleanup.log 2>&1
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Running prune with volumes in production | Data loss! | Check what volumes exist first |
| Never cleaning | Disk full | Schedule regular cleanup |

### How to Debug

```bash
# See what's using space
docker system df

# List all images
docker images -a

# List volumes
docker volume ls
```

---

## Step 7.5: SSL Certificate Renewal

### Why This Exists
Let's Encrypt certificates expire after 90 days. Traefik handles automatic renewal, but you should verify it's working.

### Exact Steps

**Check certificate expiration:**

```bash
# From your local machine
echo | openssl s_client -servername app.yourdomain.com -connect app.yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Verify auto-renewal is working:**

1. Certificates should renew ~30 days before expiration
2. Check Traefik logs for renewal activity:
```bash
docker logs $(docker ps -q -f name=dokploy-traefik) 2>&1 | grep -i "certificate\|renew\|acme"
```

### Common Mistakes
| Mistake | Symptom | Fix |
|---------|---------|-----|
| Port 80 blocked | Renewal fails | Keep port 80 open for ACME |
| DNS changed | Renewal fails | Verify A record still points to server |

### What to Do If It Fails

```bash
# Force certificate regeneration
# In Dokploy: Remove domain, re-add it

# Or restart Traefik
docker service update --force dokploy-traefik
```

---

## Step 7.6: Server Resource Monitoring Commands

### Quick Reference

```bash
# CPU and Memory
htop
# or
top

# Disk space
df -h

# Disk I/O
iostat -x 1

# Memory details
free -h

# Docker resource usage
docker stats

# All Docker disk usage
docker system df

# Check running containers
docker ps

# Check container logs
docker logs <container_name> --tail 100

# Check system logs
journalctl -f

# Network connections
ss -tlnp

# Check open files (useful for debugging)
lsof | head -100
```

---

# Quick Reference Card

## Essential Commands

| Task | Command |
|------|---------|
| SSH to server | `ssh -p 2222 deployer@IP` |
| Check Dokploy status | `docker ps \| grep dokploy` |
| View Dokploy logs | `docker logs dokploy` |
| View app logs | `docker logs <container>` |
| Check disk space | `df -h` |
| Check memory | `free -h` |
| Docker cleanup | `docker system prune -a` |
| Restart Traefik | `docker service update --force dokploy-traefik` |
| Update Dokploy | `curl -sSL https://dokploy.com/install.sh \| sh` |
| Firewall status | `ufw status` |
| Check SSL cert | `echo \| openssl s_client -connect domain:443 2>/dev/null \| openssl x509 -noout -dates` |

## Dokploy URLs

| Service | URL |
|---------|-----|
| Admin Panel | `https://dokploy.yourdomain.com` |
| Your App | `https://app.yourdomain.com` |

## Important Files

| File | Purpose |
|------|---------|
| `/etc/ssh/sshd_config` | SSH configuration |
| `/etc/ufw/` | Firewall rules |
| `/var/log/auth.log` | SSH login attempts |
| `/var/log/fail2ban.log` | Fail2ban activity |

## Emergency Recovery

**Locked out of SSH:**
1. Use Contabo VNC console
2. Login as root
3. Fix SSH config or UFW rules

**Locked out of Dokploy:**
```bash
docker service update --publish-add "published=3000,target=3000,mode=host" dokploy
```

**Full Dokploy reset:**
```bash
docker service rm $(docker service ls -q)
curl -sSL https://dokploy.com/install.sh | sh
```

---

# Troubleshooting Common Issues

## Build Fails

**Symptom:** Deployment fails during build phase

**Solutions:**
1. Check build logs for specific error
2. Try building locally first: `npm run build`
3. Verify all dependencies in package.json
4. Check Node version compatibility
5. Rebuild without cache (Application → Advanced)

## 502 Bad Gateway

**Symptom:** Domain shows 502 error

**Solutions:**
1. Check app is running: `docker ps`
2. Verify port in domain settings matches app port
3. Ensure app listens on `0.0.0.0`, not `127.0.0.1`
4. Check app logs for startup errors
5. Wait for health check to pass

## SSL Certificate Fails

**Symptom:** Can't get HTTPS working

**Solutions:**
1. Verify DNS points to server: `dig domain.com`
2. Ensure port 80 is open (ACME challenge)
3. Wait for DNS propagation (up to 48 hours)
4. Disable Cloudflare proxy temporarily
5. Check Traefik logs for ACME errors

## Out of Memory

**Symptom:** Builds killed, server unresponsive

**Solutions:**
1. Add swap space:
```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```
2. Reduce concurrent builds
3. Upgrade VPS (more RAM)

## Database Connection Refused

**Symptom:** App can't connect to database

**Solutions:**
1. Use container name, not localhost
2. Verify both services in same Docker network
3. Check database is running
4. Verify credentials are correct

---

# E-Commerce Platform Specific Troubleshooting

## Prisma Migration Errors

**Symptom:** "P3009: migrate found failed migration" or similar Prisma errors

**Solutions:**
```bash
# SSH into server
ssh -p 2222 deployer@YOUR_SERVER_IP

# Reset failed migrations
docker exec -it $(docker ps -q -f name=ecommerce-app) sh

# Inside container:
npx prisma migrate resolve --applied <migration-name>
# Or reset all (WARNING: deletes data)
npx prisma migrate reset --force
```

---

## Seeding Fails but App Runs

**Symptom:** Logs show "⚠️ Seeding essentials failed" but app starts

**Solutions:**
1. Non-critical - app can run without seed data
2. Manually run seed:
```bash
docker exec -it $(docker ps -q -f name=ecommerce-app) \
  npx tsx prisma/seed-essentials.ts
```
3. Check for duplicate data (seeding idempotency)

---

## Admin Login Not Working

**Symptom:** Can't login with default admin credentials

**Solutions:**
1. Verify seeding completed:
```bash
docker logs $(docker ps -q -f name=ecommerce-app) | grep "Seeding"
```

2. Check if admin user exists:
```bash
# Connect to database
docker exec -it $(docker ps -q -f name=ecommerce-db) \
  mysql -u ecommerce_user -p ecommerce

# Check users
SELECT email, role FROM User WHERE role = 'ADMIN';
```

3. Create admin manually:
```bash
docker exec -it $(docker ps -q -f name=ecommerce-app) sh
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
prisma.user.create({
  data: {
    email: 'admin@example.com',
    password: await bcrypt.hash('Admin123!', 10),
    role: 'ADMIN',
    name: 'Admin User'
  }
}).then(() => process.exit(0));
"
```

---

## Cloudinary Upload Fails

**Symptom:** Product images fail to upload

**Solutions:**
1. Verify environment variables are set:
```bash
docker exec $(docker ps -q -f name=ecommerce-app) printenv | grep CLOUDINARY
```

2. Check Cloudinary credentials are correct
3. Verify Cloudinary account is active (not suspended)
4. Test API key in Cloudinary dashboard

---

## NextAuth Errors / Login Redirects

**Symptom:** "Invalid callback URL" or redirect loops

**Solutions:**
1. Verify NEXTAUTH_URL matches your domain exactly:
```bash
# Must be https://yourdomain.com (no trailing slash)
NEXTAUTH_URL=https://app.yourdomain.com
```

2. Verify NEXTAUTH_SECRET is set:
```bash
docker exec $(docker ps -q -f name=ecommerce-app) printenv | grep NEXTAUTH
```

3. Clear browser cookies for the domain

---

## Database Runs Out of Connections

**Symptom:** "Too many connections" error

**Solutions:**
1. Increase MySQL max_connections:
```bash
# In Dokploy: Database service → Advanced → Command
# Add: --max_connections=200
```

2. Check for connection leaks in application
3. Restart database:
```bash
docker restart $(docker ps -q -f name=ecommerce-db)
```

---

## Webhook/Payment Integration Fails

**Symptom:** Stripe webhooks not working

**Solutions:**
1. Verify webhook secret is correct
2. Check webhook URL is accessible (must be HTTPS)
3. Verify Stripe webhook is configured:
   - Stripe Dashboard → Webhooks
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

---

## Application Slow After Deployment

**Symptom:** Pages load slowly or timeout

**Solutions:**
1. Check server resources:
```bash
# SSH into server
htop  # Check CPU and RAM usage
docker stats  # Check container resources
```

2. Increase container memory in Dokploy:
   - Application → Advanced → Memory Limit: 1024MB or higher

3. Check for missing indexes in database:
```sql
-- Connect to database
SHOW PROCESSLIST;  -- Find slow queries
EXPLAIN SELECT ...;  -- Analyze query performance
```

4. Enable Next.js caching and optimize images

---

## Cannot Deploy After Code Changes

**Symptom:** Deployment fails with "image pull" errors

**Solutions:**
1. Clear Docker build cache in Dokploy:
   - Application → Advanced → Clean Build Cache
   - Rebuild

2. Verify GitHub webhook is working:
   - GitHub Repo → Settings → Webhooks
   - Check recent deliveries

3. Manual redeploy:
   - Application → Deployments → Deploy

---

## Environment Variables Not Applied

**Symptom:** Changes to env vars not reflected in app

**Solutions:**
1. After changing environment variables, you MUST redeploy:
   - Application → Environment → Save
   - Application → Deployments → Deploy

2. Verify vars in running container:
```bash
docker exec $(docker ps -q -f name=ecommerce-app) printenv
```

---

## Quick Diagnostic Commands

```bash
# Full health check
ssh -p 2222 deployer@YOUR_SERVER_IP

# 1. Check all containers running
docker ps

# 2. Check app logs (last 100 lines)
docker logs --tail=100 $(docker ps -q -f name=ecommerce-app)

# 3. Check database logs
docker logs --tail=100 $(docker ps -q -f name=ecommerce-db)

# 4. Check database connectivity from app
docker exec $(docker ps -q -f name=ecommerce-app) nc -zv ecommerce-db 3306

# 5. Verify migrations applied
docker exec $(docker ps -q -f name=ecommerce-app) npx prisma migrate status

# 6. Check disk space
df -h

# 7. Check memory
free -h

# 8. Restart app container (if needed)
docker restart $(docker ps -q -f name=ecommerce-app)
```

---

**Document Version:** 2.0 (E-Commerce Platform)
**Last Updated:** December 2024
**Target:** E-Commerce Platform on Dokploy
**Project:** https://github.com/yourusername/ecommerce-platform
