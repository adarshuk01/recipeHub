import { Server } from 'socket.io';

let io;
const connectedUsers = {}; // userId => socketId

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // adjust for production!
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(connectedUsers)) {
        if (socketId === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const getConnectedUsers = () => connectedUsers;

export { setupSocket, getIo, getConnectedUsers };
