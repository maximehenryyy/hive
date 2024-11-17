import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Globe, HelpCircle } from 'lucide-react';

export function Settings() {
  const sections = [
    {
      icon: User,
      title: 'Profil',
      description: 'Gérez vos informations personnelles',
      items: ['Photo de profil', 'Informations du compte', 'Réseaux sociaux']
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configurez vos préférences de notifications',
      items: ['Push notifications', 'Emails', 'Sons']
    },
    {
      icon: Lock,
      title: 'Confidentialité',
      description: 'Gérez vos paramètres de confidentialité',
      items: ['Visibilité du compte', 'Blocage', 'Données personnelles']
    },
    {
      icon: Palette,
      title: 'Apparence',
      description: "Personnalisez l'interface de HIVE",
      items: ['Thème', 'Couleurs', 'Police']
    },
    {
      icon: Globe,
      title: 'Langue',
      description: 'Choisissez votre langue préférée',
      items: ['Langue de l\'interface', 'Format de date', 'Région']
    },
    {
      icon: HelpCircle,
      title: 'Aide',
      description: 'Obtenez de l\'aide et des informations',
      items: ['Centre d\'aide', 'Contactez-nous', 'FAQ']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="grid gap-6">
        {sections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {section.items.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}