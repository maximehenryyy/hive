import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Notifications() {
  const { notifications, markNotificationAsRead } = useStore();

  const getIcon = (type: 'like' | 'comment' | 'follow') => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-lg border ${
            notification.read
              ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              : 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800'
          }`}
          onClick={() => markNotificationAsRead(notification.id)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white">
                <span className="font-semibold">{notification.username}</span>{' '}
                {notification.content}
              </p>
              <p className="text-sm text-gray-500">{notification.timestamp}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}