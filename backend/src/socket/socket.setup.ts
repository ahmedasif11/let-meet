import { Server } from 'socket.io';

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

export function setupSocketIO(io: Server) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

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
        console.log(`[Socket] Joining request from ${socket.id} to room ${roomId}`);
        
        if (!rooms[roomId]) {
          rooms[roomId] = { adminId: socket.id, userIds: [socket.id] };
          connectedPeers[socket.id].room = roomId;
          connectedPeers[socket.id].isConnected = true;
          connectedPeers[socket.id].participant = participant;
          socket.join(roomId);

          socket.emit('joined-as-admin');
          console.log(`[Socket] ${socket.id} joined as admin of room ${roomId}`);
        } else {
          const adminId = rooms[roomId].adminId;
          connectedPeers[socket.id].room = roomId;
          connectedPeers[socket.id].isConnected = false;
          connectedPeers[socket.id].participant = participant;
          if (adminId !== socket.id) {
            socket.to(adminId).emit('new-user-joining-room', participant);
            console.log(`[Socket] Notifying admin ${adminId} of new user ${socket.id}`);
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
        console.log(`[Socket] Joining request accepted for ${socketId}`);
        
        if (!connectedPeers[socketId]) {
          console.warn(`[Socket] Peer ${socketId} not found`);
          return;
        }

        if (connectedPeers[socketId].isConnected) {
          console.warn(`[Socket] Peer ${socketId} already connected`);
          return;
        }

        if (!connectedPeers[socketId].room) {
          console.warn(`[Socket] Peer ${socketId} has no room`);
          return;
        }

        const roomId = connectedPeers[socketId]?.room;
        if (!roomId || !rooms[roomId]) {
          console.warn(`[Socket] Room ${roomId} not found`);
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
        console.log(`[Socket] ${socketId} accepted and connected to room ${roomId}`);
      }
    );

    socket.on('joining-request-rejected', (socketId: string) => {
      console.log(`[Socket] Joining request rejected for ${socketId}`);
      
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
      ({ candidate, to }: { candidate: any; to: string }) => {
        io.to(to).emit('receive-ice-candidate', {
          candidate,
          from: socket.id,
        });
      }
    );

    socket.on(
      'send-offer',
      ({ offer, to }: { offer: any; to: string }) => {
        io.to(to).emit('receive-offer', {
          offer,
          from: socket.id,
        });
      }
    );

    socket.on(
      'send-answer',
      ({ answer, to }: { answer: any; to: string }) => {
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
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      
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
            console.log(`[Socket] Room ${roomId} deleted (empty)`);
          }
        }
      }

      delete connectedPeers[socket.id];
    });
  });
}
