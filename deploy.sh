#!/bin/bash
# ==========================================================
# Agent 47 Platform - Master VPS Deployment Script
# Supports: Ubuntu 20.04 / 22.04 / 24.04 & Debian 11 / 12
# Installs: Nginx, Python 3, SQLite Backend & Systemd Service
# ==========================================================

set -e

echo ""
echo "=========================================================="
echo "    🚀 AGENT 47 PLATFORM - VPS AUTOMATED DEPLOYMENT"
echo "=========================================================="
echo ""

# 1. Check Root Privileges
if [ "$EUID" -ne 0 ]; then
  echo "⚠️ Please run as root or with sudo:"
  echo "   sudo bash deploy.sh"
  exit 1
fi

# 2. Update System Packages
echo "--> [1/7] Updating system packages..."
apt-get update -y > /dev/null 2>&1

# 3. Check & Stop conflicting services (like Apache)
echo "--> [2/7] Checking port 80 conflicts..."
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo "    Stopping conflicting Apache2 service..."
    systemctl stop apache2
    systemctl disable apache2 > /dev/null 2>&1
fi

# 4. Install Nginx, Python3, and Tools
echo "--> [3/7] Installing Nginx, Python3, Certbot & Unzip..."
apt-get install -y nginx certbot python3-certbot-nginx python3 python3-pip python3-venv unzip curl sqlite3 > /dev/null 2>&1

# 5. Setup Web Root
WEB_ROOT="/var/www/agent47"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "--> [4/7] Deploying web files to $WEB_ROOT..."
mkdir -p "$WEB_ROOT"

if [ -f "$CURRENT_DIR/agent47_deploy.zip" ] && [ "$CURRENT_DIR" != "$WEB_ROOT" ]; then
    unzip -o "$CURRENT_DIR/agent47_deploy.zip" -d "$WEB_ROOT" > /dev/null
elif [ "$CURRENT_DIR" != "$WEB_ROOT" ]; then
    cp -r "$CURRENT_DIR"/* "$WEB_ROOT/"
fi

# 6. Setup Python SQLite Backend Service
echo "--> [5/7] Setting up Python SQLite API Backend..."
cd "$WEB_ROOT"
python3 -m venv venv
venv/bin/pip install --upgrade pip > /dev/null 2>&1
venv/bin/pip install -r requirements.txt > /dev/null 2>&1

mkdir -p "$WEB_ROOT/database"
mkdir -p "$WEB_ROOT/database/backups"

# Create Systemd Service for Agent 47 SQLite API
cat > /etc/systemd/system/agent47.service << EOF
[Unit]
Description=Agent 47 SQLite API Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$WEB_ROOT
ExecStart=$WEB_ROOT/venv/bin/python $WEB_ROOT/server.py
Restart=always
RestartSec=3
Environment=PORT=8000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable agent47.service > /dev/null 2>&1
systemctl restart agent47.service

# Set proper permissions
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"
chmod -R 775 "$WEB_ROOT/database"

# 7. Configure Nginx Reverse Proxy
echo "--> [6/7] Configuring high-performance Nginx Reverse Proxy..."
NGINX_CONF="/etc/nginx/sites-available/agent47"
SERVER_IP=$(curl -s -4 https://ifconfig.me || curl -s -4 https://api.ipify.org || echo "YOUR_VPS_IP")

cat > "$NGINX_CONF" << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/agent47;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # REST API Reverse Proxy to Python SQLite Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main Portfolio & Admin Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        try_files /admin.html =404;
    }

    # Static asset caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    error_page 404 /index.html;
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/agent47
rm -f /etc/nginx/sites-enabled/default

nginx -t > /dev/null 2>&1
systemctl restart nginx
systemctl enable nginx > /dev/null 2>&1

# Firewall config
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "active"; then
    echo "--> [7/7] Opening HTTP (80) & HTTPS (443) firewall ports..."
    ufw allow 'Nginx Full' > /dev/null 2>&1 || (ufw allow 80 > /dev/null 2>&1 && ufw allow 443 > /dev/null 2>&1)
    ufw allow 22 > /dev/null 2>&1
fi

echo ""
echo "=========================================================="
echo "    🎉 DEPLOYMENT SUCCESSFUL! YOUR SITE & DB ARE LIVE! 🚀"
echo "=========================================================="
echo ""
echo "  🌐 Live Website:      http://$SERVER_IP"
echo "  🔐 Admin Studio:     http://$SERVER_IP/admin.html"
echo "  ⚡ SQLite API:        http://$SERVER_IP/api/health"
echo "  🔑 Default PIN:       1234"
echo "  💾 Database File:     /var/www/agent47/database/agent47.db"
echo ""
echo "----------------------------------------------------------"
echo "  📌 TO CONNECT YOUR CUSTOM DOMAIN WITH FREE SSL (HTTPS):"
echo "----------------------------------------------------------"
echo "  1. Point your domain DNS (A Record '@' & 'www') to: $SERVER_IP"
echo "  2. Run this command on your VPS:"
echo "     sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "=========================================================="
echo ""
