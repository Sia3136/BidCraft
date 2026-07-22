const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./utils/db');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // JWT Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);
    
    // Automatically join the authenticated user's private room
    if (socket.user && socket.user.userId) {
      const userRoom = `user_${socket.user.userId}`;
      socket.join(userRoom);
      console.log(`[Socket] Authenticated User: ${socket.user.userId} joined ${userRoom}`);
    }

    // Securely join an auction room
    socket.on('join_auction', async (auctionId, callback) => {
      try {
        const res = await db.pool.query("SELECT id FROM auctions WHERE id = $1", [auctionId]);
        
        if (res.rows.length === 0) {
          console.log(`[Socket] Rejected join_auction: Auction ${auctionId} does not exist.`);
          if (typeof callback === 'function') {
            callback({ success: false, error: 'Auction not found' });
          }
          return;
        }

        // Prevent duplicate joins
        const roomName = `auction_${auctionId}`;
        if (!socket.rooms.has(roomName)) {
          socket.join(roomName);
          console.log(`[Socket] Socket ${socket.id} joined room: ${roomName}`);
        }
        
        if (typeof callback === 'function') {
          callback({ success: true });
        }
      } catch (err) {
        console.error(`[Socket] Error joining auction ${auctionId}:`, err);
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Server error' });
        }
      }
    });

    socket.on('leave_auction', (auctionId) => {
      const roomName = `auction_${auctionId}`;
      socket.leave(roomName);
      console.log(`[Socket] Socket ${socket.id} left room: ${roomName}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${socket.id} | Reason: ${reason}`);
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
