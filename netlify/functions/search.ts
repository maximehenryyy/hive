import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

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

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers: CORS_HEADERS,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { username } = JSON.parse(event.body || '{}');
    
    if (!username) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Username is required' })
      };
    }

    // Rechercher sur VIP
    const vipResult = await searchVIP(username);
    
    if (vipResult) {
      // Sauvegarder dans Supabase
      await supabase
        .from('creators')
        .upsert([vipResult], { onConflict: 'username' });

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify([vipResult])
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify([])
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};