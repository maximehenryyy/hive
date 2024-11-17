import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { searchCreator, getTopCreators } from '../lib/api';

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

interface SearchResults {
  creators: Creator[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  message?: string;
}

interface StoreState {
  user: any | null;
  isDemoMode: boolean;
  searchResults: SearchResults;
  selectedCreator: Creator | null;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  searchCreators: (query: string) => Promise<void>;
  setSelectedCreator: (creator: Creator | null) => void;
  loadCreator: (username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  initialize: () => void;
  cleanup: () => void;
}

let creatorSubscription: any = null;

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  isDemoMode: false,
  searchResults: {
    creators: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0
  },
  selectedCreator: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 5
  },

  searchCreators: async (query: string) => {
    if (!query || query.length < 2) {
      set({ 
        searchResults: {
          creators: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 0
        },
        error: null 
      });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const results = await searchCreator(query, get().filters);
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        isLoading: false,
        searchResults: {
          creators: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 0,
          message: 'Une erreur est survenue lors de la recherche'
        }
      });
    }
  },

  setSelectedCreator: (creator) => set({ selectedCreator: creator }),

  loadCreator: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      
      if (creator) {
        set({ selectedCreator: creator });
      } else {
        set({ error: 'Créateur non trouvé' });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isDemoMode: false });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  enterDemoMode: () => set({ isDemoMode: true }),
  exitDemoMode: () => set({ isDemoMode: false }),
  setError: (error) => set({ error }),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  initialize: () => {
    // Initialize Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({ user: session.user });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user || null });
    });

    // Subscribe to creators table changes
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
          async (payload) => {
            const { searchResults } = get();
            
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const updatedCreator = payload.new as Creator;
              const index = searchResults.creators.findIndex(c => c.username === updatedCreator.username);
              
              if (index !== -1) {
                const newCreators = [...searchResults.creators];
                newCreators[index] = updatedCreator;
                set({ 
                  searchResults: {
                    ...searchResults,
                    creators: newCreators
                  }
                });
              }
            }
            
            const { selectedCreator } = get();
            if (selectedCreator && payload.new.username === selectedCreator.username) {
              set({ selectedCreator: payload.new as Creator });
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