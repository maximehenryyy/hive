import { supabase } from './supabase';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface SearchFilters {
  platform?: string;
  category?: string;
  location?: string;
  page?: number;
  pageSize?: number;
}

async function searchVIP(query: string) {
  try {
    const searchUrl = `https://veryimportantpeople.fr/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const firstResult = $('.influencer-card').first();
    
    if (!firstResult.length) return null;

    const name = firstResult.find('.influencer-name').text().trim();
    const username = firstResult.find('.influencer-username').text().trim();
    const avatar = firstResult.find('.influencer-avatar img').attr('src');
    const followers = firstResult.find('.followers-count').text().trim();
    const description = firstResult.find('.influencer-bio').text().trim();
    
    const socialLinks: Record<string, string> = {};
    firstResult.find('.social-links a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        if (href.includes('instagram.com')) socialLinks.instagram = href;
        else if (href.includes('twitter.com')) socialLinks.twitter = href;
        else if (href.includes('youtube.com')) socialLinks.youtube = href;
        else if (href.includes('tiktok.com')) socialLinks.tiktok = href;
        else if (href.includes('twitch.tv')) socialLinks.twitch = href;
      }
    });

    return {
      name,
      username: username.toLowerCase().replace('@', ''),
      platform: Object.keys(socialLinks)[0] || 'unknown',
      followers: parseInt(followers.replace(/[^0-9]/g, '')) || 0,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      verified: true,
      description,
      categories: Object.keys(socialLinks),
      social_links: socialLinks
    };
  } catch (error) {
    console.error('VIP search error:', error);
    return null;
  }
}

export async function searchCreator(query: string, filters: SearchFilters = {}) {
  if (!query || query.length < 2) {
    throw new Error('La recherche doit contenir au moins 2 caractères');
  }
  
  const { page = 1, pageSize = 5 } = filters;
  const offset = (page - 1) * pageSize;
  
  try {
    // First, search in Supabase
    let supabaseQuery = supabase
      .from('creators')
      .select('*', { count: 'exact' })
      .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
      .order('followers', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (filters.platform) {
      supabaseQuery = supabaseQuery.eq('platform', filters.platform);
    }
    if (filters.category) {
      supabaseQuery = supabaseQuery.contains('categories', [filters.category]);
    }

    const { data: creators, error, count } = await supabaseQuery;

    if (error) throw error;

    if (creators && creators.length > 0) {
      return {
        creators,
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    }

    // If no results in database, search VIP
    const vipResult = await searchVIP(query);
    if (vipResult) {
      // Store in Supabase
      const { error: insertError } = await supabase
        .from('creators')
        .upsert([vipResult], { onConflict: 'username' });

      if (insertError) {
        console.error('Error storing VIP data:', insertError);
      }

      return {
        creators: [vipResult],
        totalCount: 1,
        currentPage: 1,
        totalPages: 1
      };
    }

    return {
      creators: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      message: 'Aucun créateur trouvé pour cette recherche'
    };

  } catch (error) {
    console.error('Search Error:', error);
    throw new Error('Une erreur est survenue lors de la recherche');
  }
}

export async function getTopCreators(filters: SearchFilters = {}) {
  const { page = 1, pageSize = 20 } = filters;
  const offset = (page - 1) * pageSize;

  try {
    let query = supabase
      .from('creators')
      .select('*', { count: 'exact' })
      .order('followers', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (filters.platform) {
      query = query.eq('platform', filters.platform);
    }
    if (filters.category) {
      query = query.contains('categories', [filters.category]);
    }

    const { data: creators, error, count } = await query;

    if (error) throw error;

    return {
      creators: creators || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error('Error fetching top creators:', error);
    throw new Error('Une erreur est survenue lors de la récupération des créateurs populaires');
  }
}