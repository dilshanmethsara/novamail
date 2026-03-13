#!/bin/bash
# Oracle Cloud Nova Mail Deployment Script

echo "🚀 Starting Oracle Cloud Deployment..."

# Step 1: Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Step 3: Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y

# Step 4: Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Step 5: Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# Step 6: Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /var/www/nova-mail
sudo chown ubuntu:ubuntu /var/www/nova-mail

# Step 7: Clone repository
echo "📥 Cloning Nova Mail repository..."
cd /var/www/nova-mail
git clone https://github.com/dilshanmethsara/novamail.git .

# Step 8: Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Step 9: Build frontend
echo "🔨 Building frontend..."
npm run build

# Step 10: Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/nova-mail << 'EOF'
server {
    listen 80;
    server_name _;

    # Frontend static files
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

# Step 11: Enable site
echo "🔧 Enabling Nginx site..."
sudo ln -s /etc/nginx/sites-available/nova-mail /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Step 12: Test Nginx
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Step 13: Setup PM2 ecosystem
echo "⚙️ Setting up PM2..."
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

# Step 14: Start backend with PM2
echo "🚀 Starting backend..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Step 15: Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# Step 16: Setup firewall
echo "🔒 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Nova Mail deployment complete!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me)"
echo "🔧 Backend API: http://$(curl -s ifconfig.me)/api"
echo "👑 Admin Dashboard: http://$(curl -s ifconfig.me)/admin"
echo ""
echo "🎉 Your Nova Mail is now live on Oracle Cloud!"
EOF
