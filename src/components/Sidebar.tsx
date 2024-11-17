import React from 'react';
import { Home, Compass, Bell, MessageSquare, User, Settings } from 'lucide-react';
import { Link } from './Link';

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Compass, label: 'Explorer', href: '/explorer' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profil', href: '/profile' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">H</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          HIVE
        </span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}