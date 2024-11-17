import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Twitter, Instagram, LinkedinIcon } from 'lucide-react';
import { useStore } from '../store/useStore';

const platformIcons = {
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: LinkedinIcon,
  tiktok: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.2-1.74V11.9a8.55 8.55 0 003.77.89v-3.45a4.83 4.83 0 003.45-2.65z"/>
    </svg>
  ),
};

export function TopCreators() {
  const { creators, loadCreators, isLoading } = useStore();

  useEffect(() => {
    loadCreators();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Top Créateurs Français</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {creators.map((creator) => {
            const PlatformIcon = platformIcons[creator.platform];
            return (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-800"
              >
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {creator.name}
                    </h3>
                    {creator.verified && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <PlatformIcon className="w-4 h-4" />
                    <span>@{creator.username}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('fr-FR', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(creator.followers)}
                  </p>
                  <p className="text-sm text-gray-500">abonnés</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}