import React from 'react';
import { TrendingUp, Users, Activity, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

export function RightSidebar() {
  const suggestions = [
    { username: 'marie_design', followers: '12.4k', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32' },
    { username: 'tech_alex', followers: '8.2k', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=32' },
    { username: 'photo_julia', followers: '15.7k', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=32' },
  ];

  const trendingTopics = [
    { tag: 'design', posts: '2.3k' },
    { tag: 'technology', posts: '1.8k' },
    { tag: 'photography', posts: '1.5k' },
  ];

  return (
    <aside className="fixed right-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Vue d'ensemble
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Total abonnés', value: '23.5k', icon: Users },
            { label: 'Posts vus', value: '1,234', icon: TrendingUp },
            { label: 'Interactions', value: '856', icon: Activity },
            { label: 'Hashtags suivis', value: '28', icon: Hash },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-purple-500" />
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending Topics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tendances
        </h2>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <motion.div
              key={topic.tag}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-500" />
                <span className="text-gray-900 dark:text-white">#{topic.tag}</span>
              </div>
              <span className="text-sm text-gray-500">{topic.posts} posts</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suggestions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Suggestions
        </h2>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <motion.div
              key={user.username}
              whileHover={{ x: 5 }}
              className="flex items-center gap-3"
            >
              <img
                src={user.image}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.followers} abonnés</p>
              </div>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                Suivre
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </aside>
  );
}