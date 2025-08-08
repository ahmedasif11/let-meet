import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const expressApp = express();
    const server = createServer(expressApp);

    const io = new Server(server, {
      cors: {
        origin: dev ? 'http://localhost:3000' : false,
        methods: ['GET', 'POST'],
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
        delete connectedPeers[socket.id];
        io.to(connectedPeers[socket.id].room).emit(
          'user-disconnected',
          socket.id
        );
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

    server.listen(port, (err?: Error) => {
      if (err) throw err;
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
