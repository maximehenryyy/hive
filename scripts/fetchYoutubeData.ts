import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const youtube = google.youtube('v3');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const supabase = createClient(
  'https://avpzodslrabeztwcjumm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpvZHNscmFiZXp0d2NqdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDc2NzYsImV4cCI6MjA0NzI4MzY3Nn0.Ql3pOETEoNv66KkhWs4bCpTSnqJq02CwiWE8Rm-DSPo'
);

// Liste des IDs des chaînes YouTube françaises populaires
const CHANNEL_IDS = [
  'UCWeg2Pkate69NFdBeuRFTAw', // SQUEEZIE
  'UCyWqModMQlbIo8274Wh_ZsQ', // Cyprien
  'UC_yP2DpIgs5Y1uWC0T03Chw', // Tibo InShape
  'UCgvqvBoSHB1ctlyyhoHrGwQ', // McFly & Carlito
  'UCgcgOERRreLtVXlEw03gLzw', // Amixem
  'UCaNlYFkGKBz5VlnrGxgKqGg', // Michou
  'UCo3i0nUzZjjLuM7VjAVz4zA', // Inoxtag
  'UCmPSwsooZq8an7xOLQQhAdw', // Domingo
  'UCZFRt9OAL-ySHBzJbTvhTzw', // Joyca
  'UCgB-gFh1LNQ-VQQRPwD_BOA'  // Lena Situations
];

async function fetchChannelData(channelId: string) {
  try {
    const response = await youtube.channels.list({
      key: YOUTUBE_API_KEY,
      id: [channelId],
      part: ['snippet', 'statistics']
    });

    const channel = response.data.items?.[0];
    if (!channel) return null;

    return {
      name: channel.snippet?.title || '',
      username: channel.snippet?.customUrl?.replace('@', '') || '',
      platform: 'youtube',
      followers: parseInt(channel.statistics?.subscriberCount || '0'),
      avatar: channel.snippet?.thumbnails?.default?.url || '',
      verified: true,
      description: channel.snippet?.description || '',
      categories: ['youtube'],
      social_links: {
        youtube: `https://youtube.com/${channel.snippet?.customUrl || ''}`
      }
    };
  } catch (error) {
    console.error(`Error fetching channel ${channelId}:`, error);
    return null;
  }
}

async function fetchAndStoreYoutubeData() {
  console.log('Fetching YouTube data...');

  for (const channelId of CHANNEL_IDS) {
    try {
      const channelData = await fetchChannelData(channelId);
      
      if (channelData) {
        const { error } = await supabase
          .from('creators')
          .upsert([channelData], { onConflict: 'username' });

        if (error) {
          console.error(`Error storing channel ${channelId}:`, error);
        } else {
          console.log(`✅ Successfully stored ${channelData.name} (${channelData.followers.toLocaleString('fr-FR')} abonnés)`);
        }
      }
    } catch (error) {
      console.error(`Failed to process channel ${channelId}:`, error);
    }
  }

  console.log('Finished fetching YouTube data');
  
  // Afficher les résultats
  const { data: creators, error } = await supabase
    .from('creators')
    .select('*')
    .order('followers', { ascending: false });
    
  if (error) {
    console.error('Error fetching results:', error);
  } else {
    console.log('\nTop YouTubers français:');
    creators.forEach((creator, index) => {
      console.log(`${index + 1}. ${creator.name}: ${creator.followers.toLocaleString('fr-FR')} abonnés`);
    });
  }
}

fetchAndStoreYoutubeData();