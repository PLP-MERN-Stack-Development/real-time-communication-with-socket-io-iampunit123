import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from "../context/Authcontext";

import { useChat } from '../context/Chatcontext';
import { Check, CheckCheck } from 'lucide-react';

const MessageList = () => {
  const { user } = useAuth();
  const { messages, typingUsers } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isOwnMessage = (message) => {
    return message.sender._id === user.id;
  };

  const isMessageRead = (message) => {
    return message.readBy && message.readBy.length > 0;
  };

  const isSystemMessage = (message) => {
    return message.messageType === 'system';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'} ${
            isSystemMessage(message) ? 'justify-center' : ''
          }`}
        >
          {isSystemMessage(message) ? (
            <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
              {message.content}
            </div>
          ) : (
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isOwnMessage(message)
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              {!isOwnMessage(message) && (
                <div className="font-medium text-sm text-blue-600 mb-1">
                  {message.sender.username}
                </div>
              )}
              
              <div className="break-words">{message.content}</div>
              
              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                isOwnMessage(message) ? 'text-blue-200' : 'text-gray-500'
              }`}>
                <span className="text-xs">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </span>
                
                {isOwnMessage(message) && (
                  <div className="flex items-center">
                    {isMessageRead(message) ? (
                      <CheckCheck size={14} className="text-green-300" />
                    ) : (
                      <Check size={14} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="flex justify-start">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-600">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;