import { createClient } from '@supabase/supabase-js';
import { TwitterApi } from 'twitter-api-v2';
import { IgApiClient } from 'instagram-private-api';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  'https://avpzodslrabeztwcjumm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpvZHNscmFiZXp0d2NqdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDc2NzYsImV4cCI6MjA0NzI4MzY3Nn0.Ql3pOETEoNv66KkhWs4bCpTSnqJq02CwiWE8Rm-DSPo'
);

// Configuration Twitter
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Configuration Instagram
const ig = new IgApiClient();
ig.state.generateDevice(process.env.INSTAGRAM_USERNAME || '');

async function fetchTwitterData(username: string) {
  try {
    const user = await twitterClient.v2.userByUsername(username, {
      'user.fields': ['public_metrics', 'profile_image_url', 'description', 'verified']
    });

    if (!user.data) return null;

    return {
      name: user.data.name,
      username: user.data.username,
      platform: 'twitter',
      followers: user.data.public_metrics?.followers_count || 0,
      avatar: user.data.profile_image_url,
      verified: user.data.verified,
      description: user.data.description,
      categories: ['twitter'],
      social_links: {
        twitter: `@${user.data.username}`
      }
    };
  } catch (error) {
    console.error(`Error fetching Twitter data for ${username}:`, error);
    return null;
  }
}

async function fetchInstagramData(username: string) {
  try {
    await ig.simulate.preLoginFlow();
    await ig.account.login(process.env.INSTAGRAM_USERNAME || '', process.env.INSTAGRAM_PASSWORD || '');
    
    const user = await ig.user.searchExact(username);
    const userInfo = await ig.user.info(user.pk);

    return {
      name: userInfo.full_name,
      username: userInfo.username,
      platform: 'instagram',
      followers: userInfo.follower_count,
      avatar: userInfo.profile_pic_url,
      verified: userInfo.is_verified,
      description: userInfo.biography,
      categories: ['instagram'],
      social_links: {
        instagram: `@${userInfo.username}`
      }
    };
  } catch (error) {
    console.error(`Error fetching Instagram data for ${username}:`, error);
    return null;
  }
}

async function fetchAndStoreAllData() {
  // Liste des créateurs à suivre
  const creators = [
    { platform: 'twitter', username: 'xSqueeZie' },
    { platform: 'twitter', username: 'MonsieurDream' },
    { platform: 'instagram', username: 'lenamahfouf' },
    // Ajoutez d'autres créateurs ici
  ];

  console.log('Starting to fetch data from all platforms...');

  for (const creator of creators) {
    let data = null;

    if (creator.platform === 'twitter') {
      data = await fetchTwitterData(creator.username);
    } else if (creator.platform === 'instagram') {
      data = await fetchInstagramData(creator.username);
    }

    if (data) {
      const { error } = await supabase
        .from('creators')
        .upsert([data], { onConflict: 'username' });

      if (error) {
        console.error(`Error storing ${creator.username}:`, error);
      } else {
        console.log(`✅ Successfully stored ${creator.username}`);
      }
    }
  }

  console.log('Finished fetching all data');
}

fetchAndStoreAllData();