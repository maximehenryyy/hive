import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function Explorer() {
  const categories = ['Tendances', 'Pour vous', 'Design', 'Tech', 'Photo', 'Art'];
  const trends = [
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400',
      title: 'Design minimaliste',
      category: 'Design'
    },
    {
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400',
      title: 'Paris la nuit',
      category: 'Photo'
    },
    {
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400',
      title: 'Tech du futur',
      category: 'Tech'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher des tendances..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {trends.map((trend, index) => (
          <motion.div
            key={trend.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <img
                src={trend.image}
                alt={trend.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="text-sm text-purple-300">{trend.category}</span>
                <h3 className="text-lg font-semibold text-white">{trend.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}