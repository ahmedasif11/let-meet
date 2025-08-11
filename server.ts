import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import next from 'next';
import cors from 'cors';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const expressApp = express();

    // Enable CORS for all routes
    expressApp.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'ngrok-skip-browser-warning',
        ],
        credentials: true,
      })
    );

    // Additional headers for ngrok compatibility
    expressApp.use((req, res, next) => {
      res.header('ngrok-skip-browser-warning', 'true');
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, ngrok-skip-browser-warning'
      );
      next();
    });

    const server = createServer(expressApp);

    const io = new Server(server, {
      cors: {
        origin: '*', // Allow all origins for Socket.IO
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    interface Peer {
      id: string;
      room: string;
      isConnected: boolean;
    }

    const connectedPeers: { [key: string]: Peer } = {};

    const rooms: { [key: string]: string[] } = {};

    io.on('connection', (socket) => {
      console.log('a user connected:', socket.id);

      connectedPeers[socket.id] = {
        id: socket.id,
        room: '',
        isConnected: false,
      };

      socket.on('join-room', (roomId: string) => {
        if (!rooms[roomId]) {
          rooms[roomId] = [];
        } else {
          io.to(roomId).emit('new-user-joined', socket.id);
        }
        socket.join(roomId);
        rooms[roomId].push(socket.id);
        connectedPeers[socket.id].room = roomId;
        socket.emit('joined-room', roomId);
      });

      socket.on(
        'send-ice-candidate',
        ({ candidate, to }: { candidate: RTCIceCandidate; to: string }) => {
          io.to(to).emit('receive-ice-candidate', {
            candidate,
            from: socket.id,
          });
        }
      );

      socket.on('send-offer', ({ offer, to }: { offer: any; to: any }) => {
        io.to(to).emit('receive-offer', {
          offer,
          from: socket.id,
        });
      });

      socket.on('send-answer', ({ answer, to }: { answer: any; to: any }) => {
        io.to(to).emit('receive-answer', {
          answer,
          from: socket.id,
        });
      });

      socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        const peer = connectedPeers[socket.id];
        if (peer && peer.room) {
          io.to(peer.room).emit('user-disconnected', socket.id);
          // Remove from room array
          rooms[peer.room] = (rooms[peer.room] || []).filter(
            (id) => id !== socket.id
          );
        }
        delete connectedPeers[socket.id];
      });

      socket.on('end-call', () => {
        io.to(connectedPeers[socket.id].room).emit(
          'user-disconnected',
          socket.id
        );
      });
    });

    // Handle all Next.js requests
    expressApp.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, '0.0.0.0', (err?: Error) => {
      if (err) throw err;
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Server is accessible from external IPs on port ${port}`);
      console.log(`For ngrok access, use: ngrok http ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
