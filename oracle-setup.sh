#!/bin/bash
# Oracle Cloud Nova Mail Setup Script

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Create app directory
sudo mkdir -p /var/www/nova-mail
sudo chown ubuntu:ubuntu /var/www/nova-mail

# Clone your repository
cd /var/www/nova-mail
git clone https://github.com/dilshanmethsara/novamail.git .

# Install dependencies
npm install
cd backend && npm install

# Build frontend
cd /var/www/nova-mail
npm run build

# Configure Nginx
sudo tee /etc/nginx/sites-available/nova-mail << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/nova-mail/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin routes
    location /admin {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/nova-mail /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx
sudo nginx -t

# Setup PM2 ecosystem
cd /var/www/nova-mail/backend
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'nova-mail-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MAILTM_API_BASE_URL: 'https://api.mail.tm',
      ADMIN_KEY: 'nova-mail-admin-2024'
    }
  }]
};
EOF

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Restart Nginx
sudo systemctl restart nginx

echo "🎉 Nova Mail setup complete!"
echo "📧 Frontend: http://your-oracle-ip"
echo "🔧 Backend API: http://your-oracle-ip/api"
echo "👑 Admin: http://your-oracle-ip/admin"
