import { supabase } from './supabase';

export async function searchCreator(query) {
  if (!query) return [];
  
  try {
    const { data: creators, error } = await supabase
      .from('creators')
      .select('*')
      .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
      .order('followers', { ascending: false })
      .limit(5);

    if (error) throw error;
    return creators || [];
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
}

export async function getCreatorByUsername(username) {
  try {
    const { data: creator, error } = await supabase
      .from('creators')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return creator;
  } catch (error) {
    console.error('Creator fetch error:', error);
    return null;
  }
}

export async function getTopCreators(limit = 20) {
  try {
    const { data: creators, error } = await supabase
      .from('creators')
      .select('*')
      .order('followers', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return creators || [];
  } catch (error) {
    console.error('Top creators fetch error:', error);
    return [];
  }
}