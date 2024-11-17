import { create } from 'zustand';
import { searchCreator, getCreatorByUsername, getTopCreators } from '../lib/api';

export const useStore = create((set) => ({
  posts: [
    {
      id: '1',
      network: 'instagram',
      username: 'marie_design',
      content: {
        text: "Nouveau projet en cours ! J'ai hâte de vous montrer le résultat final 🎨 #design #creativity",
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800'
      },
      stats: { likes: 234, comments: 18, shares: 5 },
      timestamp: 'il y a 2h'
    },
    {
      id: '2',
      network: 'twitter',
      username: 'tech_alex',
      content: {
        text: "Les dernières innovations en AI sont absolument fascinantes ! Voici un aperçu de ce que j'ai découvert aujourd'hui..."
      },
      stats: { likes: 156, comments: 24, shares: 12 },
      timestamp: 'il y a 3h'
    }
  ],
  searchResults: [],
  selectedCreator: null,
  topCreators: [],
  isLoading: false,
  error: null,
  searchCreators: async (query) => {
    if (!query) {
      set({ searchResults: [], error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const results = await searchCreator(query);
      set({ searchResults: results });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  setSelectedCreator: (creator) => set({ selectedCreator: creator }),
  loadCreator: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const creator = await getCreatorByUsername(username);
      if (creator) {
        set({ selectedCreator: creator });
      } else {
        set({ error: 'Créateur non trouvé' });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  loadTopCreators: async () => {
    set({ isLoading: true, error: null });
    try {
      const creators = await getTopCreators();
      set({ topCreators: creators });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));