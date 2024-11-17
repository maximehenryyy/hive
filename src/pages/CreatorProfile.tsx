import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Twitter, Instagram, LinkedinIcon, Users, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../store/useStore';

const platformIcons = {
  youtube: { icon: Youtube, color: 'text-red-500' },
  twitter: { icon: Twitter, color: 'text-blue-400' },
  instagram: { icon: Instagram, color: 'text-pink-500' },
  linkedin: { icon: LinkedinIcon, color: 'text-blue-600' },
  tiktok: {
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.2-1.74V11.9a8.55 8.55 0 003.77.89v-3.45a4.83 4.83 0 003.45-2.65z"/>
      </svg>
    ),
    color: 'text-black dark:text-white'
  }
};

export function CreatorProfile() {
  const { username } = useParams<{ username: string }>();
  const { creators, loadCreatorPosts, getCreatorPosts } = useStore();
  
  const creator = creators?.find(c => c.username === username);
  const posts = getCreatorPosts(username || '');

  useEffect(() => {
    if (username) {
      loadCreatorPosts(username);
    }
  }, [username]);

  if (!creator) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Créateur non trouvé</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl" />
        <div className="absolute -bottom-16 left-6 p-1 bg-white dark:bg-gray-900 rounded-xl">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-32 h-32 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {creator.name}
              {creator.verified && (
                <span className="text-blue-500">✓</span>
              )}
            </h1>
            <p className="text-gray-500">@{creator.username}</p>
          </div>
          <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
            Suivre
          </button>
        </div>

        <p className="text-gray-800 dark:text-gray-200">
          {creator.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(creator.followers)}
            </p>
            <p className="text-sm text-gray-500">Abonnés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {creator.categories?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Catégories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {Object.keys(creator.social_links || {}).length}
            </p>
            <p className="text-sm text-gray-500">Réseaux</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(creator.social_links || {}).map(([platform, link]) => {
            const PlatformIcon = platformIcons[platform as keyof typeof platformIcons]?.icon;
            const colorClass = platformIcons[platform as keyof typeof platformIcons]?.color;
            
            return PlatformIcon ? (
              <a
                key={platform}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:opacity-80 transition-opacity ${colorClass}`}
              >
                <PlatformIcon className="w-4 h-4" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ) : null;
          })}
        </div>

        {/* Recent Posts */}
        {posts && posts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Derniers posts</h2>
            <div className="grid gap-4">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                >
                  {post.content.text && (
                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                      {post.content.text}
                    </p>
                  )}
                  {post.content.image && (
                    <img
                      src={post.content.image}
                      alt=""
                      className="rounded-lg w-full h-64 object-cover"
                    />
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{post.timestamp}</span>
                    <div className="flex items-center gap-4">
                      <span>{post.stats.likes} likes</span>
                      <span>{post.stats.comments} commentaires</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}