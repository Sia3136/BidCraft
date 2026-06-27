const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room for specific auction
    socket.on('join_auction', (auctionId) => {
      socket.join(`auction_${auctionId}`);
      console.log(`Socket ${socket.id} joined room: auction_${auctionId}`);
    });

    socket.on('leave_auction', (auctionId) => {
      socket.leave(`auction_${auctionId}`);
      console.log(`Socket ${socket.id} left room: auction_${auctionId}`);
    });

    // Join room for user specific notifications
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room: user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = {
  initSocket,
  getIo
};
