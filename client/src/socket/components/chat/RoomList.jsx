import React from 'react';
import { Hash, Plus, Users } from 'lucide-react';
import { useChat } from '../context/Chatcontext';

const RoomList = () => {
  const { currentRoom, joinRoom, rooms } = useChat();

  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6 p-2">
        <div className="w-8 h-8">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20H80V70H50L30 80V70H20V20Z" fill="white" />
            <path d="M30 35H70" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 45H60" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 55H65" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-bold text-xl">
          <span className="text-white">Chit</span>
          <span className="text-green-400">Chat</span>
        </span>
      </div>

      {/* Rooms */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Channels
          </h3>
          <button className="text-gray-400 hover:text-white transition">
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {rooms.map((room) => (
            <button
              key={room.name}
              onClick={() => joinRoom(room.name)}
              className={`w-full flex items-center space-x-2 px-2 py-2 rounded text-left transition ${
                currentRoom === room.name
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Hash size={16} className="text-gray-400" />
              <span className="flex-1">{room.name}</span>
              <Users size={14} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;