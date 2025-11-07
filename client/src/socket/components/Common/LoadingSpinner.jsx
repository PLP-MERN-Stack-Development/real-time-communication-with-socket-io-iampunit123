import React from 'react';
import ChitChatLogo from '../Logo/ChitChatLogo';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce mb-4">
          <ChitChatLogo size={80} />
        </div>
        <div className="font-bold text-3xl text-gray-800 mb-4">
          <span className="text-blue-600">Chit</span>
          <span className="text-green-600">Chat</span>
        </div>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading ChitChat...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;