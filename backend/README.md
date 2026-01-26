# Let-Meet Backend Server

Backend server for the Let-Meet WebRTC video calling application.

## Features

- Express.js REST API
- Socket.io for WebRTC signaling
- MongoDB database integration
- User authentication (signup, login, email verification)
- OAuth user management (Google/GitHub)
- Email verification with OTP

## Tech Stack

- Node.js
- Express.js
- Socket.io
- MongoDB (Mongoose)
- TypeScript
- Resend (for email)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Fill in the environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `EMAIL_VERIFICATION_SECRET`: A secret key for JWT token generation
   - `RESEND_API_KEY`: Your Resend API key for sending emails
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development with hot reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend verification OTP
- `POST /api/auth/login` - User login (for NextAuth credentials provider)
- `POST /api/auth/oauth-user` - Create/update OAuth user

### Health Check

- `GET /health` - Server health check

## Socket.io Events

The server handles WebRTC signaling through Socket.io:

- `joining-request` - Request to join a room
- `joining-request-accepted` - Accept a joining request
- `joining-request-rejected` - Reject a joining request
- `send-offer` - Send WebRTC offer
- `send-answer` - Send WebRTC answer
- `send-ice-candidate` - Send ICE candidate
- `media-status-change` - Update media status (video/audio)

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

The backend can be deployed separately from the frontend. Make sure to:

1. Set all environment variables in your deployment platform
2. Update `ALLOWED_ORIGINS` to include your frontend URL
3. Ensure MongoDB is accessible from your deployment environment
4. Configure CORS properly for production

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Type check without building
