# Deployment Guide - Railway + Vercel

Complete step-by-step guide to deploy Let-Meet to production.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - Free tier: https://www.mongodb.com/cloud/atlas/register
3. **Railway Account** - Free tier: https://railway.app (for backend)
4. **Vercel Account** - Free tier: https://vercel.com (for frontend)
5. **Resend Account** - Free tier: https://resend.com (for email)

---

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (M0 Sandbox)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
4. Whitelist IP addresses:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For production: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Railway IP ranges for better security
5. Get connection string:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

**Save this connection string - you'll need it for Railway!**

---

## Step 2: Deploy Backend to Railway

### 2.1 Connect Repository

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will detect the project structure

### 2.2 Configure Backend Service

1. Railway should detect the `backend` folder automatically
2. If not, click "New Service" → "GitHub Repo" → Select your repo
3. In service settings, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2.3 Set Environment Variables

Go to your Railway service → "Variables" tab and add:

```env
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
EMAIL_VERIFICATION_SECRET=your_generated_secret_here
RESEND_API_KEY=your_resend_api_key_here
```

**Important:**
- Generate `EMAIL_VERIFICATION_SECRET`: Run `openssl rand -base64 32` in terminal
- For `ALLOWED_ORIGINS`: Use placeholder for now (e.g., `https://placeholder.vercel.app`)
- You'll update this after deploying frontend

### 2.4 Deploy

1. Railway will automatically deploy
2. Wait for deployment to complete
3. Go to "Settings" → "Generate Domain"
4. **Copy your Railway backend URL** (e.g., `https://your-backend.railway.app`)
5. Test the health endpoint: `https://your-backend.railway.app/health`

**Save this URL - you'll need it for Vercel!**

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will detect Next.js automatically

### 3.2 Configure Project

1. **Root Directory**: Set to `frontend`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 3.3 Set Environment Variables

Before deploying, add these environment variables in Vercel:

```env
# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-app.vercel.app

# Backend URL (from Railway)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth (GitHub)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**Important:**
- Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32`
- Use your Railway backend URL for `NEXT_PUBLIC_BACKEND_URL`
- For `NEXTAUTH_URL`: Use placeholder for now (e.g., `https://placeholder.vercel.app`)

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. **Copy your Vercel URL** (e.g., `https://your-app.vercel.app`)

---

## Step 4: Update Environment Variables

### 4.1 Update Railway (Backend)

1. Go back to Railway
2. Update `ALLOWED_ORIGINS` with your actual Vercel URL:
   ```env
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
   ```
3. Railway will automatically redeploy

### 4.2 Update Vercel (Frontend)

1. Go to Vercel project settings
2. Update `NEXTAUTH_URL` with your actual Vercel URL:
   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
3. Vercel will automatically redeploy

---

## Step 5: Configure OAuth Providers

### 5.1 Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client
3. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
4. Save changes

### 5.2 GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update "Authorization callback URL":
   - `https://your-app.vercel.app/api/auth/callback/github`
4. Save changes

---

## Step 6: Verify Deployment

### 6.1 Test Backend

1. Visit: `https://your-backend.railway.app/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

### 6.2 Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Should load the homepage
3. Test signup/login functionality

### 6.3 Test WebRTC

1. Create a meeting room
2. Open in two different browsers/devices
3. Verify video/audio works
4. Check browser console for any errors

---

## Troubleshooting

### Backend Not Starting

**Check Railway logs:**
1. Go to Railway dashboard → Your service → "Deployments"
2. Click on the latest deployment
3. Check "Logs" tab for errors

**Common issues:**
- Missing environment variables
- MongoDB connection string incorrect
- Port already in use (Railway handles this automatically)

### Frontend Can't Connect to Backend

**Check:**
1. `NEXT_PUBLIC_BACKEND_URL` is set correctly in Vercel
2. Backend health endpoint works: `https://your-backend.railway.app/health`
3. CORS is configured: Check `ALLOWED_ORIGINS` in Railway includes your Vercel URL
4. Check browser console for CORS errors

### Socket.io Not Connecting

**Check:**
1. `NEXT_PUBLIC_BACKEND_URL` points to Railway backend URL
2. Backend logs show socket connections
3. CORS allows your Vercel domain
4. Check browser console for WebSocket errors

### OAuth Not Working

**Check:**
1. Callback URLs are set correctly in Google/GitHub
2. `NEXTAUTH_URL` matches your Vercel domain exactly
3. `NEXTAUTH_SECRET` is set
4. OAuth client IDs/secrets are correct

---

## Environment Variables Summary

### Railway (Backend)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `production` |
| `ALLOWED_ORIGINS` | CORS origins | `https://your-app.vercel.app` |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `EMAIL_VERIFICATION_SECRET` | JWT secret | Generated with `openssl rand -base64 32` |
| `RESEND_API_KEY` | Resend API key | `re_...` |

### Vercel (Frontend)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | NextAuth secret | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_BACKEND_URL` | Railway backend URL | `https://your-backend.railway.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `...googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `GOCSPX-...` |
| `GITHUB_CLIENT_ID` | GitHub OAuth ID | `Iv1...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | `...` |

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Railway backend deployed and URL obtained
- [ ] Vercel frontend deployed and URL obtained
- [ ] All environment variables set in Railway
- [ ] All environment variables set in Vercel
- [ ] `ALLOWED_ORIGINS` updated with Vercel URL
- [ ] `NEXTAUTH_URL` updated with Vercel URL
- [ ] OAuth callback URLs configured
- [ ] Backend health endpoint working
- [ ] Frontend loads correctly
- [ ] WebRTC video calling works

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Railway/Vercel deployment logs
3. Check browser console for errors
4. Verify all environment variables are set correctly
