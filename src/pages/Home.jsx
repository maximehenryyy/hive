import React from 'react';
import { motion } from 'framer-motion';
import { SocialCard } from '../components/SocialCard';
import { useStore } from '../store/useStore';

export function Home() {
  const { posts } = useStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {posts?.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SocialCard {...post} />
        </motion.div>
      ))}
    </motion.div>
  );
}