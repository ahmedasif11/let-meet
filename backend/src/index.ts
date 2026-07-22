import dotenv from 'dotenv';
import path from 'path';

const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
  '.env',
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  try {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log('✅ Environment variables loaded from:', envPath);
      envLoaded = true;
      break;
    }
  } catch (error) {
    continue;
  }
}

if (!envLoaded) {
  console.warn('⚠️  Could not load .env file from any of the expected locations');
  const result = dotenv.config();
  if (result.error) {
    console.warn('   Default location also failed:', result.error.message);
  } else {
    console.log('✅ Environment variables loaded from default location');
  }
}

if (process.env.RESEND_API_KEY) {
  const maskedKey = process.env.RESEND_API_KEY.length > 10 
    ? process.env.RESEND_API_KEY.substring(0, 10) + '...' 
    : '***';
  console.log('✅ RESEND_API_KEY is set:', maskedKey);
} else {
  console.warn('⚠️  RESEND_API_KEY is not set in environment');
}
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectToDB from './db/db.connect';
import authRoutes from './routes/auth.routes';
import { setupSocketIO } from './socket/socket.setup';

const app = express();
// Railway automatically sets PORT, use it or fallback to 3001
const port = parseInt(process.env.PORT || '3001', 10);
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

const isAllowedOrigin = (origin: string): boolean => {
  if (allowedOrigins.includes('*')) {
    return true;
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  return allowedOrigins.some((allowed) => {
    if (allowed === origin) {
      return true;
    }

    try {
      const allowedUrl = new URL(allowed);
      const allowedHost = allowedUrl.hostname;

      if (allowedHost === '*') {
        return true;
      }

      if (allowedHost.startsWith('*.')) {
        const baseHost = allowedHost.slice(2);
        return (
          originUrl.protocol === allowedUrl.protocol &&
          (originUrl.hostname === baseHost || originUrl.hostname.endsWith(`.${baseHost}`))
        );
      }

      return (
        originUrl.protocol === allowedUrl.protocol &&
        originUrl.hostname === allowedUrl.hostname &&
        originUrl.port === allowedUrl.port
      );
    } catch {
      return false;
    }
  });
};

// Log allowed origins for debugging
console.log('🔒 CORS Allowed Origins:', allowedOrigins);

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn('⚠️  CORS blocked origin:', origin);
        console.warn('⚠️  Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true,
  })
);

app.use(express.json());

// Middleware to handle ngrok browser warning
app.use((req, res, next) => {
  // Set header to skip ngrok browser warning
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn('⚠️  Socket.IO CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true,
  },
  transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket (better for ngrok)
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
});

// Setup socket handlers
setupSocketIO(io);

// Connect to database (non-blocking - server will start even if DB fails)
connectToDB()
  .then(() => {
    console.log('✅ Database connection established');
  })
  .catch((error) => {
    console.warn('⚠️  Database connection failed, but server will continue:', error.message);
    console.warn('⚠️  Some features requiring database may not work.');
  })
  .finally(() => {
    // Start server regardless of database connection status
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Backend server running on port ${port}`);
      console.log(`📡 Allowed origins: ${allowedOrigins.join(', ')}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
