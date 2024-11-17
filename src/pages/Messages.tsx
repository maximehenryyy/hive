import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip, ArrowLeft } from 'lucide-react';

export function Messages() {
  const [message, setMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
  const conversations = [
    {
      id: '1',
      username: 'marie_design',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32',
      lastMessage: 'Super projet ! On en discute bientôt ?',
      timestamp: '14:23',
      unread: 2
    },
    {
      id: '2',
      username: 'tech_alex',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=32',
      lastMessage: "Merci pour l'info !",
      timestamp: 'Hier',
      unread: 0
    }
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] -mt-6 -mx-4 md:-mx-6 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-800 ${
        selectedConversation ? 'hidden md:block' : 'block'
      }`}>
        <div className="p-4">
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              className="p-4 cursor-pointer"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={conversation.image}
                  alt={conversation.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{conversation.username}</h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${
        !selectedConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <button 
            className="md:hidden"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32"
              alt="Contact"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">marie_design</h3>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Messages will be displayed here */}
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none"
            />
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-purple-500 hover:text-purple-600">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}