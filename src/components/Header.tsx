import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { searchResults, isLoading, searchCreators, setSelectedCreator } = useStore();
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (query: string) => {
      if (query.length >= 2) {
        searchCreators(query);
      }
    },
    [searchCreators]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);
    handleSearch(query);
  };

  const handleSelectCreator = (creator: any) => {
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
      default: return '🌐';
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
            {showResults && (
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
                ) : searchResults.length > 0 ? (
                  searchResults.map((creator) => (
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
                          <span className="ml-1">{getPlatformIcon(creator.platform)}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          @{creator.username} • {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(creator.followers)} abonnés
                        </p>
                      </div>
                    </button>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucun créateur trouvé
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}