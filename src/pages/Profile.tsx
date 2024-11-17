import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, Instagram, Twitter } from 'lucide-react';
import { SocialCard } from '../components/SocialCard';
import { useStore } from '../store/useStore';

export function Profile() {
  const posts = useStore((state) => state.posts);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl" />
        <div className="absolute -bottom-16 left-6 p-1 bg-white dark:bg-gray-900 rounded-xl">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128"
            alt="Profile"
            className="w-32 h-32 rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="pt-20 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Thomas Durant</h1>
            <p className="text-gray-500">@thomas_design</p>
          </div>
          <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
            Éditer le profil
          </button>
        </div>

        <p className="text-gray-800 dark:text-gray-200">
          Designer UI/UX passionné par l'innovation et les nouvelles technologies. 
          Je partage mon travail et mes découvertes sur HIVE !
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> Paris, France
          </span>
          <span className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" /> thomas-design.com
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Membre depuis Mars 2024
          </span>
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold">1.2k</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">8.5k</p>
            <p className="text-sm text-gray-500">Abonnés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">1.1k</p>
            <p className="text-sm text-gray-500">Abonnements</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Posts récents</h2>
          {posts.map((post) => (
            <SocialCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}