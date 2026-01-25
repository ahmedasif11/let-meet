// DEPRECATED: This file is no longer used.
// Socket.io server has been moved to /socket-server
// Next.js app now runs standalone and connects to the separate socket server via NEXT_PUBLIC_SOCKET_URL
// This file is kept for reference only and can be deleted.

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
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6,
    });

    interface Peer {
      id: string;
      room: string;
      isConnected: boolean;
      participant: Participant;
    }

    interface Participant {
      id: string;
      name: string;
      avatar?: string;
      isVideoOn?: boolean;
      isAudioOn?: boolean;
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
        participant: {
          id: '',
          name: '',
          avatar: '',
          isVideoOn: false,
          isAudioOn: false,
        },
      };

      socket.on(
        'joining-request',
        ({
          participant,
          roomId,
        }: {
          participant: Participant;
          roomId: string;
        }) => {
          if (!rooms[roomId]) {
            rooms[roomId] = { adminId: socket.id, userIds: [socket.id] };
            connectedPeers[socket.id].room = roomId;
            connectedPeers[socket.id].isConnected = true;
            connectedPeers[socket.id].participant = participant;
            socket.join(roomId);

            socket.emit('joined-as-admin');
          } else {
            const adminId = rooms[roomId].adminId;
            connectedPeers[socket.id].room = roomId;
            connectedPeers[socket.id].isConnected = false;
            connectedPeers[socket.id].participant = participant;
            if (adminId !== socket.id) {
              socket.to(adminId).emit('new-user-joining-room', participant);
            } else {
              socket.emit('joined-as-admin');
            }
          }
        }
      );

      socket.on(
        'joining-request-accepted',
        ({ participant }: { participant: Participant }) => {
          const socketId = participant.id;
          if (!connectedPeers[socketId]) {
            return;
          }

          if (connectedPeers[socketId].isConnected) {
            return;
          }

          if (!connectedPeers[socketId].room) {
            return;
          }

          const roomId = connectedPeers[socketId]?.room;
          if (!roomId || !rooms[roomId]) {
            return;
          }

          const participants = Object.values(connectedPeers)
            .filter((peer: Peer) => peer.isConnected)
            .map((peer: Peer) => peer.participant);

          io.in(roomId).emit(
            'user-accepted-and-connected',
            connectedPeers[socketId].participant
          );

          connectedPeers[socketId].isConnected = true;
          rooms[roomId].userIds.push(socketId);
          io.sockets.sockets.get(socketId)?.join(roomId);

          socket.to(socketId).emit('joining-request-accepted', participants);
        }
      );

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

      socket.on(
        'media-status-change',
        ({
          videoEnabled,
          audioEnabled,
        }: {
          videoEnabled: boolean;
          audioEnabled: boolean;
        }) => {
          const roomId = connectedPeers[socket.id]?.room;
          if (!roomId) {
            return;
          }

          // Update the participant's state in the server
          if (connectedPeers[socket.id]) {
            connectedPeers[socket.id].participant.isVideoOn = videoEnabled;
            connectedPeers[socket.id].participant.isAudioOn = audioEnabled;
          }

          io.in(roomId).emit('media-status-change', {
            id: socket.id,
            videoEnabled,
            audioEnabled,
          });
        }
      );

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
