import React from 'react';
import Header from '../Layout/Header';
import RoomList from './RoomList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';

const ChatRoom = () => {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar - Room List */}
      <RoomList />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <MessageList />
            <MessageInput />
          </div>

          {/* Online Users Sidebar */}
          <OnlineUsers />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;