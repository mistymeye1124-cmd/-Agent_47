#!/bin/bash
# ==========================================================
# Agent 47 Platform - Master VPS Deployment Script
# Supports: Ubuntu 20.04 / 22.04 / 24.04 & Debian 11 / 12
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
echo "--> [1/6] Updating system packages..."
apt-get update -y > /dev/null 2>&1

# 3. Check & Stop conflicting services (like Apache)
echo "--> [2/6] Checking port 80 conflicts..."
if systemctl is-active --quiet apache2 2>/dev/null; then
    echo "    Stopping conflicting Apache2 service..."
    systemctl stop apache2
    systemctl disable apache2 > /dev/null 2>&1
fi

# 4. Install Nginx and Certbot
echo "--> [3/6] Installing Nginx, Certbot & Unzip..."
apt-get install -y nginx certbot python3-certbot-nginx unzip curl > /dev/null 2>&1

# 5. Setup Web Root
WEB_ROOT="/var/www/agent47"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "--> [4/6] Deploying web files to $WEB_ROOT..."
mkdir -p "$WEB_ROOT"

if [ -f "$CURRENT_DIR/agent47_deploy.zip" ] && [ "$CURRENT_DIR" != "$WEB_ROOT" ]; then
    unzip -o "$CURRENT_DIR/agent47_deploy.zip" -d "$WEB_ROOT" > /dev/null
elif [ "$CURRENT_DIR" != "$WEB_ROOT" ]; then
    cp -r "$CURRENT_DIR"/* "$WEB_ROOT/"
fi

# Set proper permissions
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"

# 6. Configure Nginx
echo "--> [5/6] Generating high-performance Nginx configuration..."
NGINX_CONF="/etc/nginx/sites-available/agent47"

# Detect Server IP
SERVER_IP=$(curl -s -4 https://ifconfig.me || curl -s -4 https://api.ipify.org || echo "YOUR_VPS_IP")

cat > "$NGINX_CONF" << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/agent47;
    index index.html;

    # High performance Gzip compression
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

    # Client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Stealth Admin studio routing
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

# Enable Site & Disable default
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/agent47
rm -f /etc/nginx/sites-enabled/default

# Test & Restart Nginx
nginx -t > /dev/null 2>&1
systemctl restart nginx
systemctl enable nginx > /dev/null 2>&1

# Configure UFW Firewall if active
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "active"; then
    echo "--> [6/6] Opening HTTP (80) & HTTPS (443) firewall ports..."
    ufw allow 'Nginx Full' > /dev/null 2>&1 || (ufw allow 80 > /dev/null 2>&1 && ufw allow 443 > /dev/null 2>&1)
    ufw allow 22 > /dev/null 2>&1
fi

echo ""
echo "=========================================================="
echo "    🎉 DEPLOYMENT SUCCESSFUL! YOUR SITE IS LIVE! 🚀"
echo "=========================================================="
echo ""
echo "  🌐 Live Website:      http://$SERVER_IP"
echo "  🔐 Admin Studio:     http://$SERVER_IP/admin.html"
echo "  🔑 Default PIN:       1234"
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
