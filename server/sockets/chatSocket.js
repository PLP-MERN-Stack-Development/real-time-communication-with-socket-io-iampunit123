<<<<<<< HEAD
const { socketAuth } = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');

// Store active users and their socket connections
const activeUsers = new Map();

const setupSocket = (io) => {
  // Socket middleware for authentication
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.user.username} connected with socket ID: ${socket.id}`);

    // Add user to active users
    activeUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: socket.user,
      rooms: new Set()
    });

    // Update user online status
    User.findByIdAndUpdate(socket.user._id, {
      isOnline: true,
      socketId: socket.id,
      lastSeen: new Date()
    }).exec();

    // Broadcast online users to all clients
    broadcastOnlineUsers(io);

    // Join room
    socket.on('join-room', async (roomName) => {
      try {
        const room = await Room.findOne({ name: roomName });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        socket.join(roomName);
        
        const userData = activeUsers.get(socket.user._id.toString());
        if (userData) {
          userData.rooms.add(roomName);
        }

        // Notify others in the room
        socket.to(roomName).emit('user-joined-room', {
          username: socket.user.username,
          room: roomName,
          timestamp: new Date()
        });

        console.log(`👥 ${socket.user.username} joined room: ${roomName}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leave-room', (roomName) => {
      socket.leave(roomName);
      
      const userData = activeUsers.get(socket.user._id.toString());
      if (userData) {
        userData.rooms.delete(roomName);
      }

      socket.to(roomName).emit('user-left-room', {
        username: socket.user.username,
        room: roomName,
        timestamp: new Date()
      });

      console.log(`🚪 ${socket.user.username} left room: ${roomName}`);
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { room, content, messageType = 'text' } = data;

        // Create message in database
        const message = await Message.create({
          sender: socket.user._id,
          content,
          room,
          messageType
        });

        // Populate message with sender info
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar');

        // Broadcast message to room
        io.to(room).emit('receive-message', populatedMessage);

        console.log(`💬 ${socket.user.username} sent message in ${room}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing-start', (room) => {
      socket.to(room).emit('user-typing', {
        username: socket.user.username,
        room
      });
    });

    socket.on('typing-stop', (room) => {
      socket.to(room).emit('user-stop-typing', {
        username: socket.user.username,
        room
      });
    });

    // Message read receipt
    socket.on('mark-message-read', async (data) => {
      try {
        const { messageId, room } = data;
        
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: {
            readBy: {
              user: socket.user._id,
              readAt: new Date()
            }
          }
        });

        socket.to(room).emit('message-read', {
          messageId,
          readBy: socket.user.username
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`❌ User ${socket.user.username} disconnected`);

      // Update user status
      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Remove from active users
      activeUsers.delete(socket.user._id.toString());

      // Broadcast updated online users
      broadcastOnlineUsers(io);
    });
  });
};

// Helper function to broadcast online users
const broadcastOnlineUsers = (io) => {
  const onlineUsers = Array.from(activeUsers.values()).map(userData => ({
    id: userData.user._id,
    username: userData.user.username,
    avatar: userData.user.avatar,
    isOnline: true
  }));

  io.emit('online-users-update', onlineUsers);
};

// Get active users for a specific room
const getRoomUsers = (roomName) => {
  const roomUsers = [];
  
  activeUsers.forEach((userData) => {
    if (userData.rooms.has(roomName)) {
      roomUsers.push({
        id: userData.user._id,
        username: userData.user.username,
        avatar: userData.user.avatar
      });
    }
  });
  
  return roomUsers;
};

module.exports = {
  setupSocket,
  getRoomUsers,
  activeUsers
=======
const { socketAuth } = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');

// Store active users and their socket connections
const activeUsers = new Map();

const setupSocket = (io) => {
  // Socket middleware for authentication
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.user.username} connected with socket ID: ${socket.id}`);

    // Add user to active users
    activeUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: socket.user,
      rooms: new Set()
    });

    // Update user online status
    User.findByIdAndUpdate(socket.user._id, {
      isOnline: true,
      socketId: socket.id,
      lastSeen: new Date()
    }).exec();

    // Broadcast online users to all clients
    broadcastOnlineUsers(io);

    // Join room
    socket.on('join-room', async (roomName) => {
      try {
        const room = await Room.findOne({ name: roomName });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        socket.join(roomName);
        
        const userData = activeUsers.get(socket.user._id.toString());
        if (userData) {
          userData.rooms.add(roomName);
        }

        // Notify others in the room
        socket.to(roomName).emit('user-joined-room', {
          username: socket.user.username,
          room: roomName,
          timestamp: new Date()
        });

        console.log(`👥 ${socket.user.username} joined room: ${roomName}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leave-room', (roomName) => {
      socket.leave(roomName);
      
      const userData = activeUsers.get(socket.user._id.toString());
      if (userData) {
        userData.rooms.delete(roomName);
      }

      socket.to(roomName).emit('user-left-room', {
        username: socket.user.username,
        room: roomName,
        timestamp: new Date()
      });

      console.log(`🚪 ${socket.user.username} left room: ${roomName}`);
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { room, content, messageType = 'text' } = data;

        // Create message in database
        const message = await Message.create({
          sender: socket.user._id,
          content,
          room,
          messageType
        });

        // Populate message with sender info
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar');

        // Broadcast message to room
        io.to(room).emit('receive-message', populatedMessage);

        console.log(`💬 ${socket.user.username} sent message in ${room}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing-start', (room) => {
      socket.to(room).emit('user-typing', {
        username: socket.user.username,
        room
      });
    });

    socket.on('typing-stop', (room) => {
      socket.to(room).emit('user-stop-typing', {
        username: socket.user.username,
        room
      });
    });

    // Message read receipt
    socket.on('mark-message-read', async (data) => {
      try {
        const { messageId, room } = data;
        
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: {
            readBy: {
              user: socket.user._id,
              readAt: new Date()
            }
          }
        });

        socket.to(room).emit('message-read', {
          messageId,
          readBy: socket.user.username
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`❌ User ${socket.user.username} disconnected`);

      // Update user status
      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Remove from active users
      activeUsers.delete(socket.user._id.toString());

      // Broadcast updated online users
      broadcastOnlineUsers(io);
    });
  });
};

// Helper function to broadcast online users
const broadcastOnlineUsers = (io) => {
  const onlineUsers = Array.from(activeUsers.values()).map(userData => ({
    id: userData.user._id,
    username: userData.user.username,
    avatar: userData.user.avatar,
    isOnline: true
  }));

  io.emit('online-users-update', onlineUsers);
};

// Get active users for a specific room
const getRoomUsers = (roomName) => {
  const roomUsers = [];
  
  activeUsers.forEach((userData) => {
    if (userData.rooms.has(roomName)) {
      roomUsers.push({
        id: userData.user._id,
        username: userData.user.username,
        avatar: userData.user.avatar
      });
    }
  });
  
  return roomUsers;
};

module.exports = {
  setupSocket,
  getRoomUsers,
  activeUsers
>>>>>>> master
};