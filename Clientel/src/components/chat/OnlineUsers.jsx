import React from 'react';
import { Users, Circle } from 'lucide-react';
import { useChat } from '../context/Chatcontext';

const OnlineUsers = () => {
  const { onlineUsers } = useChat();

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-800">Online Users</h3>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {onlineUsers.length}
        </span>
      </div>

      <div className="space-y-2">
        {onlineUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
              <Circle
                size={12}
                className="absolute -top-1 -right-1 text-green-500 fill-current"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || 'Unknown User'}
              </p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        ))}

        {onlineUsers.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No users online
          </p>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;