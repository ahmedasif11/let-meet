# Let-Meet - Video Calling App

A modern video calling application built with Next.js, WebRTC, and Socket.io. Features real-time video/audio communication, screen sharing, chat, and more.

## 🚀 Free Deployment (Recommended)

This app is configured for **100% free deployment** using:
- **Vercel** - Next.js frontend + API routes
- **Railway** - Socket.io signaling server
- **MongoDB Atlas** - Free tier database

### Quick Start Deployment

📖 **See [DEPLOY-FREE.md](./DEPLOY-FREE.md) for complete deployment instructions.**

### Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Vercel        │         │   Railway        │
│   (Next.js)     │◄────────┤   (Socket.io)    │
│   Frontend      │         │   Signaling      │
└────────┬────────┘         └──────────────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB Atlas   │
│   (Database)    │
└─────────────────┘
```

### Why This Architecture?

- ✅ **Vercel**: Optimized for Next.js, automatic deployments, free tier
- ✅ **Railway**: Easy Socket.io deployment, $5 free credit/month
- ✅ **MongoDB Atlas**: Free tier sufficient for development/small apps
- ✅ **No VPS/Docker required**: Everything runs on managed platforms

### ⚠️ Important Notes

- **Docker/PM2**: These deployment methods require a paid VPS/server. The free deployment method uses Vercel + Railway instead.
- **Custom Server**: The `server.ts` file is deprecated. Socket.io has been moved to a separate server in `/socket-server`.
- **Environment Variables**: See `.env.example` for required variables.

---

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd let-meet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Socket Server:**
   ```bash
   cd socket-server
   npm install
   cd ..
   ```

4. **Configure environment variables:**
   
   Create `.env.local` in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   RESEND_API_KEY=your_resend_api_key
   EMAIL_VERIFICATION_SECRET=your_email_verification_secret
   ```

   Create `socket-server/.env`:
   ```env
   PORT=3001
   ALLOWED_ORIGINS=http://localhost:3000
   NODE_ENV=development
   ```

5. **Run the development servers:**

   **Terminal 1 - Socket Server:**
   ```bash
   cd socket-server
   npm run dev
   ```

   **Terminal 2 - Next.js App:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Next.js app: [http://localhost:3000](http://localhost:3000)
   - Socket server health: [http://localhost:3001/health](http://localhost:3001/health)

---

## 📁 Project Structure

```
let-meet/
├── socket-server/          # Standalone Socket.io server
│   ├── src/
│   │   └── index.ts        # Socket.io signaling logic
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── call/            # Video call pages
│   │   └── ...
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   │   ├── sockets/         # Socket.io client
│   │   ├── peer-connection/ # WebRTC logic
│   │   └── ...
│   └── ...
├── server.ts                # DEPRECATED - kept for reference
├── package.json
└── .env.example
```

---

## 🔧 Available Scripts

### Next.js App (Root)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Socket Server (`socket-server/`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run type-check` - Type check without building

---

## 🌐 Environment Variables

See `.env.example` for all required environment variables.

### Key Variables:
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_SOCKET_URL` - Socket server URL (http://localhost:3001 for dev)

---

## 🚀 Deployment

### Free Deployment (Recommended)
See **[DEPLOY-FREE.md](./DEPLOY-FREE.md)** for step-by-step instructions.

### Alternative Deployment Methods
⚠️ **Note**: Docker/PM2 deployments require a paid VPS or server. The free deployment method (Vercel + Railway) is recommended.

---

## 🛡️ Security Notes

- Never commit `.env.local` or `.env` files
- Use strong secrets for `NEXTAUTH_SECRET` and `EMAIL_VERIFICATION_SECRET`
- Configure CORS properly in production
- Use HTTPS in production (Vercel and Railway provide this automatically)

---

## 📚 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Real-time**: Socket.io
- **WebRTC**: Native WebRTC APIs
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Deployed on [Vercel](https://vercel.com) and [Railway](https://railway.app)
- Database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
