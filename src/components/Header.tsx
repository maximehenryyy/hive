import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { searchResults, isLoading, searchCreators, setSelectedCreator } = useStore();
  const navigate = useNavigate();

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) {
        searchCreators(query);
      }
    }, 500),
    [searchCreators]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);
    handleSearch(query);
  };

  const handleSelectCreator = (creator: any) => {
    if (creator.platform === 'not_found' || creator.platform === 'error') {
      return;
    }
    setSearchQuery('');
    setShowResults(false);
    setSelectedCreator(creator);
    navigate(`/creator/${creator.username}`);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return '🎥';
      case 'twitter': return '🐦';
      case 'instagram': return '📸';
      case 'tiktok': return '📱';
      case 'twitch': return '🎮';
      case 'not_found': return '❌';
      case 'error': return '⚠️';
      default: return '🌐';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'text-red-500';
      case 'twitter': return 'text-blue-400';
      case 'instagram': return 'text-pink-500';
      case 'tiktok': return 'text-gray-900 dark:text-white';
      case 'twitch': return 'text-purple-500';
      case 'not_found': return 'text-gray-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 lg:right-64 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 flex items-center justify-between z-20">
      <div className="flex-1 max-w-2xl mx-auto flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Rechercher un créateur..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-purple-500 transition-all"
          />

          <AnimatePresence>
            {showResults && (searchQuery.length >= 2 || searchResults.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                      Recherche en cours...
                    </div>
                  </div>
                ) : searchResults.creators?.length > 0 ? (
                  searchResults.creators.map((creator) => (
                    <button
                      key={creator.username}
                      onClick={() => handleSelectCreator(creator)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {creator.name}
                          {creator.verified && <span className="text-blue-500 ml-1">✓</span>}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={getPlatformColor(creator.platform)}>
                            {getPlatformIcon(creator.platform)}
                          </span>
                          <span className="text-gray-500">@{creator.username}</span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucun créateur trouvé
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}