# Socket.io Signaling Server

Standalone Socket.io server for WebRTC signaling in the Let-Meet application.

## Overview

This server handles all WebRTC signaling between peers:
- Room management
- Peer connection setup (offers, answers, ICE candidates)
- Media status updates
- Participant management

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `PORT` env var).

### Production

```bash
# Build
npm run build

# Start
npm start
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=development
```

### Production Configuration

For production (Railway deployment):

```env
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
```

**Important**: `ALLOWED_ORIGINS` must include your Vercel deployment URL(s) to allow CORS.

## API Endpoints

### Health Check
- `GET /health` - Returns server status

## Socket Events

### Client → Server
- `joining-request` - Request to join a room
- `joining-request-accepted` - Accept a joining request
- `joining-request-rejected` - Reject a joining request
- `send-offer` - Send WebRTC offer
- `send-answer` - Send WebRTC answer
- `send-ice-candidate` - Send ICE candidate
- `media-status-change` - Update video/audio status

### Server → Client
- `joined-as-admin` - Confirmed as room admin
- `new-user-joining-room` - New user wants to join
- `user-accepted-and-connected` - User accepted into room
- `joining-request-accepted` - Joining request was accepted
- `joining-request-rejected` - Joining request was rejected
- `receive-offer` - Receive WebRTC offer
- `receive-answer` - Receive WebRTC answer
- `receive-ice-candidate` - Receive ICE candidate
- `media-status-change` - Media status update
- `user-disconnected` - User left the room

## Deployment

See the main [DEPLOY-FREE.md](../DEPLOY-FREE.md) for Railway deployment instructions.

## Architecture

This server is intentionally separate from the Next.js app to:
- Allow independent scaling
- Enable deployment on different platforms (Railway)
- Keep WebRTC signaling logic isolated
- Support Vercel's serverless architecture (which doesn't support persistent Socket.io connections)
