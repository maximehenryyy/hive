import React from 'react';
import { Home, Compass, Bell, MessageSquare, User } from 'lucide-react';
import { Link } from './Link';
import { useLocation } from 'react-router-dom';

export function MobileNav() {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Compass, label: 'Explorer', href: '/explorer' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profil', href: '/profile' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-5 ${
                isActive 
                  ? 'text-purple-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}