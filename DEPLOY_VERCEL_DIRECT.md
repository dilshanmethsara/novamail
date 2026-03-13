# Direct Vercel Deployment Guide

## Method 1: Vercel Web Interface (Easiest)

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Choose **"Upload"** instead of Git
4. **Drag and drop** your entire `nova-mail-main` folder

### Step 2: Configure Project
```
Project Name: nova-mail
Framework: Vite (auto-detected)
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

### Step 3: Add Environment Variables
```
VITE_API_BASE_URL=https://nova-mail-backend.up.railway.app
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Get your URL: `https://nova-mail-xxx.vercel.app`

---

## Method 2: Vercel CLI (No Git)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy from Local
```bash
# Navigate to your project folder
cd /path/to/nova-mail-main

# Deploy directly
vercel --prod --no-git
```

### Step 3: Configure During Deployment
When prompted:
```
? Set up and deploy "~/nova-mail-main"? [Y/n] Y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] N
? What's your project's name? nova-mail
? In which directory is your code located? ./
? Want to override the settings? [y/N] Y
```

---

## Method 3: Zip File Upload

### Step 1: Create Zip
```bash
# Navigate to project root
cd /path/to/nova-mail-main

# Create zip (exclude node_modules)
zip -r nova-mail.zip . -x "node_modules/*" ".git/*" "backend/*"
```

### Step 2: Upload to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Choose **"Upload ZIP"**
4. Select `nova-mail.zip`
5. Configure and deploy

---

## Environment Variables (Required)

Add these in Vercel dashboard:
```
VITE_API_BASE_URL=https://nova-mail-backend.up.railway.app
```

## After Deployment

Your app will be available at:
- **Frontend**: `https://nova-mail-xxx.vercel.app`
- **API**: `https://nova-mail-xxx.vercel.app/api`
- **Admin**: `https://nova-mail-xxx.vercel.app/admin`

---

## Benefits of Direct Upload

✅ No Git required
✅ Immediate deployment
✅ Works with any folder
✅ Perfect for testing
✅ Can update anytime
