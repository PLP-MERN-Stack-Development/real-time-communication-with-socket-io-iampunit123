import React, { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, startTyping, stopTyping } = useChat();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Typing indicators
    if (value && !isTyping) {
      setIsTyping(true);
      startTyping();
    } else if (!value && isTyping) {
      setIsTyping(false);
      stopTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              maxLength={1000}
            />
            <button
              type="button"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Smile size={20} />
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;