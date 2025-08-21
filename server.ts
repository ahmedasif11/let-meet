// server.ts
import express from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import cors from 'cors';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const expressApp = express();

    // CORS setup
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
        origin: '*',
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
    const rooms: {
      [key: string]: { adminId: string; userIds: string[] };
    } = {};

    io.on('connection', (socket) => {
      connectedPeers[socket.id] = {
        id: socket.id,
        room: '',
        isConnected: false,
      };

      socket.on('joining-request', (roomId: string) => {
        if (!rooms[roomId]) {
          rooms[roomId] = { adminId: socket.id, userIds: [socket.id] };
          connectedPeers[socket.id].room = roomId;
          connectedPeers[socket.id].isConnected = true;
          socket.join(roomId);

          socket.emit('joined-as-admin');
        } else {
          const adminId = rooms[roomId].adminId;
          connectedPeers[socket.id].room = roomId;
          connectedPeers[socket.id].isConnected = false;

          if (adminId !== socket.id) {
            socket.to(adminId).emit('new-user-joining-room', socket.id);
          } else {
            socket.emit('joined-as-admin');
          }
        }
      });

      socket.on('joining-request-accepted', (socketId: string) => {
        const roomId = connectedPeers[socketId]?.room;
        if (!roomId) {
          return;
        }

        if (rooms[roomId].userIds.includes(socketId)) {
          return;
        }

        connectedPeers[socketId].isConnected = true;
        rooms[roomId].userIds.push(socketId);
        io.sockets.sockets.get(socketId)?.join(roomId);

        socket.to(roomId).emit('joining-request-accepted', socketId);

        setTimeout(() => {
          socket.emit('user-accepted-and-connected', socketId);
        }, 500);
      });

      socket.on('joining-request-rejected', (socketId: string) => {
        const roomId = connectedPeers[socketId]?.room;
        if (!roomId) {
          return;
        }

        io.to(socketId).emit('joining-request-rejected');

        delete connectedPeers[socketId];
        if (rooms[roomId]) {
          rooms[roomId].userIds = rooms[roomId].userIds.filter(
            (id) => id !== socketId
          );
        }
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

      socket.on(
        'send-offer',
        ({ offer, to }: { offer: RTCSessionDescriptionInit; to: string }) => {
          io.to(to).emit('receive-offer', {
            offer,
            from: socket.id,
          });
        }
      );

      socket.on(
        'send-answer',
        ({ answer, to }: { answer: RTCSessionDescriptionInit; to: string }) => {
          io.to(to).emit('receive-answer', {
            answer,
            from: socket.id,
          });
        }
      );

      socket.on('end-call', () => {
        const roomId = connectedPeers[socket.id]?.room;
        if (roomId) {
          io.to(roomId).emit('user-disconnected', socket.id);
        }
      });

      socket.on('disconnect', () => {
        const peer = connectedPeers[socket.id];
        if (peer && peer.room) {
          const roomId = peer.room;
          io.to(roomId).emit('user-disconnected', socket.id);

          if (rooms[roomId]) {
            rooms[roomId].userIds = rooms[roomId].userIds.filter(
              (id) => id !== socket.id
            );

            if (rooms[roomId].userIds.length === 0) {
              delete rooms[roomId];
            }
          }
        }

        delete connectedPeers[socket.id];
      });
    });

    // Let Next.js handle frontend requests
    expressApp.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, '0.0.0.0', (err?: Error) => {
      if (err) throw err;
      console.log(`Server ready at http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
