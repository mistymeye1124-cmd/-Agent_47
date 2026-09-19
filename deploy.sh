#!/bin/bash
# ==========================================================
# Agent 47 Platform - Auto VPS Deployment Script
# Supports: Ubuntu 20.04 / 22.04 / 24.04 & Debian 11 / 12
# ==========================================================

set -e

echo "=== [Agent 47 Deployment Initiated] ==="

# 1. Update system packages
echo "--> Updating system packages..."
sudo apt-get update -y

# 2. Install Nginx and Certbot (for free SSL)
echo "--> Installing Nginx & Certbot..."
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 3. Create Web Directory
WEB_ROOT="/var/www/agent47"
echo "--> Setting up web root at $WEB_ROOT..."
sudo mkdir -p $WEB_ROOT

# 4. Copy website files
sudo cp -r ./* $WEB_ROOT/
sudo chown -R www-data:www-data $WEB_ROOT
sudo chmod -R 755 $WEB_ROOT

# 5. Configure Nginx
NGINX_CONF="/etc/nginx/sites-available/agent47"
echo "--> Writing Nginx configuration to $NGINX_CONF..."

sudo tee $NGINX_CONF > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/agent47;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        try_files /admin.html =404;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    error_page 404 /index.html;
}
EOF

# 6. Enable site and restart Nginx
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "=== [Deployment Complete!] ==="
echo "Access your site at: http://YOUR_VPS_IP"
echo "To set up SSL and Domain, run: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
