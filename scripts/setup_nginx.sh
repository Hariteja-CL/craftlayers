#!/bin/bash

# ==============================================================================
# CraftLayers Backend SSL Setup Script (Ubuntu/Debian)
# Use: sudo bash setup_nginx.sh [DOMAIN_NAME]
# Default Domain: api.craftlayers.com
# ==============================================================================

# 1. Configuration
DOMAIN=${1:-"api.craftlayers.com"}
EMAIL="admin@$DOMAIN"
BACKEND_PORT=8000

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Initializing Nginx SSL Proxy Setup for $DOMAIN...${NC}"

# Check for root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Please run as root (sudo bash setup_nginx.sh)${NC}"
   exit 1
fi

# 2. Update System & Install Dependencies
echo -e "${GREEN}📦 Updating packages and installing Nginx + Certbot...${NC}"
apt update && apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx

# 3. Create Nginx Configuration
echo -e "${GREEN}📝 Creating Nginx site configuration...${NC}"
cat > /etc/nginx/sites-available/craftlayers-api <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # CORS Headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-api-key' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-api-key';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
EOF

# 4. Enable Configuration
echo -e "${GREEN}🔗 Enabling site configuration...${NC}"
ln -sf /etc/nginx/sites-available/craftlayers-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. Verify Nginx Syntax
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
else
    echo -e "${RED}❌ Nginx config syntax error. Please check manually.${NC}"
    exit 1
fi

# 6. Request SSL Certificate
echo -e "${GREEN}🔐 Requesting SSL certificate from Let's Encrypt...${NC}"
# Note: This requires the machine to be reachable at $DOMAIN over the public internet.
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

# 7. Final Verification
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully configured SSL for https://$DOMAIN${NC}"
    echo -e "${GREEN}⚡ Backend on port $BACKEND_PORT is now proxied securely.${NC}"
else
    echo -e "${RED}❌ Certbot failed. Ensure your domain A-record points to this IP and port 80 is open.${NC}"
fi
