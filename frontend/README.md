# Let-Meet Frontend

Next.js frontend application for the Let-Meet WebRTC video calling platform.

## Features

- Next.js 15 with App Router
- React 18 with TypeScript
- NextAuth.js for authentication
- Socket.io client for WebRTC signaling
- Real-time video/audio communication
- Screen sharing
- Chat functionality
- Modern UI with Tailwind CSS and Radix UI

## Tech Stack

- **Framework**: Next.js 15, React 18, TypeScript
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io Client
- **WebRTC**: Native WebRTC APIs
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create `.env.local` in the frontend directory (copy from `.env.example`):
   ```env
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/             # NextAuth API route
│   │   ├── auth/            # Authentication pages
│   │   ├── call/            # Video call pages
│   │   └── ...
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   │   ├── sockets/         # Socket.io client
│   │   ├── peer-connection/ # WebRTC logic
│   │   └── ...
│   └── ...
├── public/                  # Static assets
├── package.json
└── next.config.ts
```

## Environment Variables

See `.env.example` for all required environment variables.

### Key Variables:
- `NEXTAUTH_SECRET` - NextAuth secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_BACKEND_URL` - Backend server URL (http://localhost:3001 for dev)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

## Deployment

The frontend can be deployed separately from the backend. Recommended platforms:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Render**

Make sure to set all environment variables in your deployment platform.

## Notes

- The frontend connects to the backend server via `NEXT_PUBLIC_BACKEND_URL`
- NextAuth handles OAuth (Google/GitHub) in the frontend but syncs users to the backend
- Socket.io client connects to the backend server for WebRTC signaling
