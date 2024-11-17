import React from 'react';
import { Heart, MessageCircle, Share2, Instagram, Twitter } from 'lucide-react';

interface SocialCardProps {
  network: 'instagram' | 'twitter';
  username: string;
  content: {
    text?: string;
    image?: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
}

export function SocialCard({ network, username, content, stats, timestamp }: SocialCardProps) {
  const NetworkIcon = network === 'instagram' ? Instagram : Twitter;
  
  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-3 md:p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={`https://images.unsplash.com/photo-${network === 'instagram' ? '1535713875002-d1d0cf377fde' : '1539571696357-5a69c17a67c6'}?auto=format&fit=crop&w=32`}
            alt={username}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{username}</h3>
            <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
              <NetworkIcon className="w-3 h-3 md:w-4 md:h-4" />
              <span>{timestamp}</span>
            </p>
          </div>
        </div>
        
        {content.text && (
          <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 mb-4">{content.text}</p>
        )}
        
        {content.image && (
          <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden">
            <img
              src={content.image}
              alt="Post content"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <button className="flex items-center gap-1 md:gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm">{stats.likes}</span>
          </button>
          <button className="flex items-center gap-1 md:gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm">{stats.comments}</span>
          </button>
          <button className="flex items-center gap-1 md:gap-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm">{stats.shares}</span>
          </button>
        </div>
      </div>
    </article>
  );
}