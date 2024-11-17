import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { searchCreator } from '../lib/api';

interface Creator {
  id?: string;
  name: string;
  username: string;
  platform: string;
  followers: number;
  avatar: string;
  verified: boolean;
  description: string;
  categories: string[];
  social_links: Record<string, string>;
}

interface SearchFilters {
  platform?: string;
  category?: string;
  location?: string;
  page?: number;
  pageSize?: number;
}

interface StoreState {
  user: any | null;
  isDemoMode: boolean;
  isLoading: boolean;
  error: string | null;
  searchResults: Creator[];
  selectedCreator: Creator | null;
  filters: SearchFilters;
  searchCreators: (query: string) => Promise<void>;
  setSelectedCreator: (creator: Creator | null) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  initialize: () => void;
  cleanup: () => void;
}

let creatorSubscription: any = null;

export const useStore = create<StoreState>((set) => ({
  user: null,
  isDemoMode: false,
  isLoading: false,
  error: null,
  searchResults: [],
  selectedCreator: null,
  filters: {
    page: 1,
    pageSize: 5
  },

  searchCreators: async (query: string) => {
    if (!query || query.length < 2) {
      set({ searchResults: [], error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { creators } = await searchCreator(query);
      set({ searchResults: creators || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedCreator: (creator) => set({ selectedCreator: creator }),
  setError: (error) => set({ error }),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({ user: session.user });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user || null });
    });

    if (!creatorSubscription) {
      creatorSubscription = supabase
        .channel('creators-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'creators'
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              set((state) => ({
                searchResults: [...state.searchResults, payload.new as Creator]
              }));
            }
          }
        )
        .subscribe();
    }
  },

  cleanup: () => {
    if (creatorSubscription) {
      supabase.removeChannel(creatorSubscription);
      creatorSubscription = null;
    }
  }
}));