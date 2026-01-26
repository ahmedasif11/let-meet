# Free Deployment Guide

This guide will help you deploy Let-Meet to **100% free hosting** using:
- **Vercel** (Next.js frontend + API routes)
- **Railway** (Socket.io signaling server)
- **MongoDB Atlas** (free tier database)

## Prerequisites

1. GitHub account (for Vercel deployment)
2. Vercel account (free tier)
3. Railway account (free tier with $5 credit/month)
4. MongoDB Atlas account (free tier)

---

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (M0 Sandbox)
3. Create a database user (username/password)
4. Whitelist IP addresses:
   - For development: Add `0.0.0.0/0` (allows all IPs - only for testing)
   - For production: Add Vercel IP ranges or specific IPs
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

---

## Step 2: Deploy Socket Server to Railway

### 2.1 Prepare Socket Server

1. Navigate to the socket-server directory:
   ```bash
   cd socket-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the server:
   ```bash
   npm run build
   ```

### 2.2 Deploy to Railway

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. **Important**: Configure the service:
   - **Root Directory**: Set to `socket-server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Add Environment Variables in Railway:
   ```
   PORT=3000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
   ```
   - Replace `your-app.vercel.app` with your actual Vercel domain (you'll get this after Step 3)
   - For now, you can use a placeholder and update it later

6. Railway will automatically:
   - Deploy your service
   - Assign a public URL (e.g., `https://your-socket-server.railway.app`)
   - **Copy this URL** - you'll need it for Vercel

### 2.3 Update CORS After Vercel Deployment

After deploying to Vercel (Step 3), update the `ALLOWED_ORIGINS` in Railway:
1. Go to your Railway project → Variables
2. Update `ALLOWED_ORIGINS` with your actual Vercel URL(s)
3. Railway will automatically redeploy

---

## Step 3: Deploy Next.js App to Vercel

### 3.1 Prepare Repository

1. Ensure your code is pushed to GitHub
2. Make sure `.env.local` is in `.gitignore` (it should be)

### 3.2 Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables** in Vercel:

   ```
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=https://your-app.vercel.app

   # Socket Server (from Railway)
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app

   # OAuth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Email Service
   RESEND_API_KEY=your_resend_api_key
   EMAIL_VERIFICATION_SECRET=your_email_verification_secret
   ```

   **Important Notes:**
   - Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal
   - Generate `EMAIL_VERIFICATION_SECRET`: Run `openssl rand -base64 32`
   - `NEXTAUTH_URL` should be your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_SOCKET_URL` should be your Railway socket server URL

6. Click "Deploy"
7. Wait for deployment to complete
8. **Copy your Vercel deployment URL** (e.g., `https://your-app.vercel.app`)

### 3.3 Configure OAuth Callback URLs

After deployment, update your OAuth provider callback URLs:

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client
3. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/credentials` (if needed)

#### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update "Authorization callback URL":
   - `https://your-app.vercel.app/api/auth/callback/github`

### 3.4 Update Railway CORS

1. Go back to Railway
2. Update `ALLOWED_ORIGINS` with your actual Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
   ```
3. Railway will automatically redeploy

---

## Step 4: Verify Deployment

1. **Test Vercel Deployment:**
   - Visit `https://your-app.vercel.app`
   - Check if the app loads correctly
   - Test authentication (login/signup)

2. **Test Socket Server:**
   - Visit `https://your-socket-server.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test WebRTC Connection:**
   - Create a meeting room
   - Join from multiple devices/browsers
   - Verify video/audio works

---

## Environment Variables Summary

### Vercel (Next.js App)
```
MONGODB_URI=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
RESEND_API_KEY=...
EMAIL_VERIFICATION_SECRET=...
```

### Railway (Socket Server)
```
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
```

---

## Troubleshooting

### Socket Connection Issues
- **Problem**: Socket.io not connecting
- **Solution**: 
  - Verify `NEXT_PUBLIC_SOCKET_URL` in Vercel matches Railway URL
  - Check `ALLOWED_ORIGINS` in Railway includes your Vercel domain
  - Check Railway logs for CORS errors

### NextAuth Issues
- **Problem**: OAuth redirects failing
- **Solution**:
  - Verify `NEXTAUTH_URL` matches your Vercel domain exactly
  - Check OAuth callback URLs in Google/GitHub settings
  - Ensure `NEXTAUTH_SECRET` is set

### Database Connection Issues
- **Problem**: MongoDB connection errors
- **Solution**:
  - Verify `MONGODB_URI` is correct
  - Check MongoDB Atlas IP whitelist includes Vercel IPs
  - For testing, temporarily allow `0.0.0.0/0` (all IPs)

### Build Failures
- **Problem**: Vercel build fails
- **Solution**:
  - Check build logs in Vercel dashboard
  - Ensure all dependencies are in `package.json`
  - Verify TypeScript compilation passes locally

---

## Free Tier Limits

### Vercel
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (suitable for Next.js API routes)

### Railway
- ✅ $5 free credit/month
- ✅ Sufficient for small Socket.io server
- ⚠️ May need to upgrade for high traffic

### MongoDB Atlas
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Suitable for development/small apps

---

## Updating Your Deployment

### Update Next.js App
1. Push changes to GitHub
2. Vercel automatically redeploys

### Update Socket Server
1. Push changes to GitHub
2. Railway automatically redeploys (if connected to GitHub)
3. Or manually redeploy in Railway dashboard

---

## Local Development

For local development, you need to run both servers:

### Terminal 1: Socket Server
```bash
cd socket-server
npm install
npm run dev
```

### Terminal 2: Next.js App
```bash
npm install
npm run dev
```

### Environment Variables
Create `.env.local` in the root:
```env
MONGODB_URI=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
# ... other variables
```

Create `socket-server/.env`:
```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=development
```

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel/Railway deployment logs
3. Verify all environment variables are set correctly
4. Ensure OAuth callback URLs are configured properly
