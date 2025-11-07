import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './Authcontext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, socket } = useAuth();
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add some mock messages for demo
  useEffect(() => {
    const mockMessages = [
      {
        _id: '1',
        sender: { _id: 'system', username: 'System', avatar: '' },
        content: 'Welcome to ChitChat! Start messaging now.',
        room: 'general',
        createdAt: new Date().toISOString(),
        messageType: 'system'
      },
      {
        _id: '2', 
        sender: { _id: 'demo1', username: 'Alice', avatar: '' },
        content: 'Hello everyone! 👋',
        room: 'general',
        createdAt: new Date(Date.now() - 300000).toISOString(),
        messageType: 'text'
      },
      {
        _id: '3',
        sender: { _id: 'demo2', username: 'Bob', avatar: '' },
        content: 'Hey Alice! How are you doing?',
        room: 'general', 
        createdAt: new Date(Date.now() - 180000).toISOString(),
        messageType: 'text'
      }
    ];
    setMessages(mockMessages);

    // Mock rooms
    setRooms([
      { name: 'general', description: 'General discussion' },
      { name: 'random', description: 'Random talks' },
      { name: 'help', description: 'Get help and support' }
    ]);

    // Mock online users
    setOnlineUsers([
      { id: '1', username: 'Alice', avatar: '', isOnline: true },
      { id: '2', username: 'Bob', avatar: '', isOnline: true },
      { id: '3', username: user?.username, avatar: '', isOnline: true }
    ]);
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    // Socket event listeners
    socket.on('receive-message', handleNewMessage);
    socket.on('user-joined-room', handleUserJoined);
    socket.on('user-left-room', handleUserLeft);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('online-users-update', handleOnlineUsersUpdate);
    socket.on('message-read', handleMessageRead);
    socket.on('error', handleSocketError);

    // Join general room by default
    socket.emit('join-room', 'general');

    return () => {
      socket.off('receive-message', handleNewMessage);
      socket.off('user-joined-room', handleUserJoined);
      socket.off('user-left-room', handleUserLeft);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('online-users-update', handleOnlineUsersUpdate);
      socket.off('message-read', handleMessageRead);
      socket.off('error', handleSocketError);
    };
  }, [socket, user]);

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleUserJoined = (data) => {
    toast.success(`${data.username} joined the room`);
  };

  const handleUserLeft = (data) => {
    toast.info(`${data.username} left the room`);
  };

  const handleUserTyping = (data) => {
    setTypingUsers(prev => {
      if (!prev.includes(data.username)) {
        return [...prev, data.username];
      }
      return prev;
    });
  };

  const handleUserStopTyping = (data) => {
    setTypingUsers(prev => prev.filter(username => username !== data.username));
  };

  const handleOnlineUsersUpdate = (users) => {
    setOnlineUsers(users);
  };

  const handleMessageRead = (data) => {
    // Update message read status
    setMessages(prev => prev.map(msg => 
      msg._id === data.messageId 
        ? { ...msg, readBy: [...(msg.readBy || []), { user: data.readBy }] }
        : msg
    ));
  };

  const handleSocketError = (error) => {
    toast.error(error.message || 'Socket connection error');
  };

  const sendMessage = (content, messageType = 'text') => {
    if (!socket || !content.trim()) return;

    // Create mock message for immediate display
    const mockMessage = {
      _id: Date.now().toString(),
      sender: { _id: user.id, username: user.username, avatar: user.avatar },
      content: content.trim(),
      room: currentRoom,
      createdAt: new Date().toISOString(),
      messageType
    };

    setMessages(prev => [...prev, mockMessage]);

    // Emit to socket (will be handled by backend when connected)
    socket.emit('send-message', {
      room: currentRoom,
      content: content.trim(),
      messageType
    });
  };

  const joinRoom = (roomName) => {
    if (!socket) return;

    // Leave current room
    if (currentRoom) {
      socket.emit('leave-room', currentRoom);
    }

    // Join new room
    socket.emit('join-room', roomName);
    setCurrentRoom(roomName);
    setMessages([]);
    setTypingUsers([]);

    // Add room join message
    const joinMessage = {
      _id: Date.now().toString(),
      sender: { _id: 'system', username: 'System', avatar: '' },
      content: `You joined #${roomName}`,
      room: roomName,
      createdAt: new Date().toISOString(),
      messageType: 'system'
    };
    setMessages([joinMessage]);
  };

  const startTyping = () => {
    if (!socket) return;
    socket.emit('typing-start', currentRoom);
  };

  const stopTyping = () => {
    if (!socket) return;
    socket.emit('typing-stop', currentRoom);
  };

  const markMessageAsRead = (messageId) => {
    if (!socket) return;
    socket.emit('mark-message-read', {
      messageId,
      room: currentRoom
    });
  };

  const value = {
    currentRoom,
    messages,
    rooms,
    onlineUsers,
    typingUsers,
    loading,
    sendMessage,
    joinRoom,
    startTyping,
    stopTyping,
    markMessageAsRead,
    setMessages,
    setRooms
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};