import { supabase } from '../src/lib/supabase';

const initialCreators = [
  {
    name: 'Squeezie',
    username: 'squeezie',
    platform: 'youtube',
    followers: 18200000,
    avatar: 'https://yt3.googleusercontent.com/ytc/AIf8zZTUVa5AiXTGzGj4r-vvlF9XWR_1x8W8OPtaKu9F=s176-c-k-c0x00ffffff-no-rj',
    verified: true,
    description: 'Créateur de contenu gaming et divertissement',
    categories: ['gaming', 'divertissement'],
    social_links: {
      youtube: 'https://youtube.com/@squeezie',
      instagram: 'https://instagram.com/xsqueezie',
      twitter: 'https://twitter.com/xSqueeZie'
    }
  },
  {
    name: 'Cyprien',
    username: 'cyprien',
    platform: 'youtube',
    followers: 14600000,
    avatar: 'https://yt3.googleusercontent.com/ytc/AIf8zZRhxgZ_WUr5iYlANc8VJLvY5t7hNX9-wSM2Z7kR=s176-c-k-c0x00ffffff-no-rj',
    verified: true,
    description: 'Humoriste et créateur de contenu',
    categories: ['humour', 'divertissement'],
    social_links: {
      youtube: 'https://youtube.com/@cyprien',
      instagram: 'https://instagram.com/cyprien',
      twitter: 'https://twitter.com/MonsieurDream'
    }
  },
  {
    name: 'Léna Situations',
    username: 'lenasituations',
    platform: 'instagram',
    followers: 4200000,
    avatar: 'https://yt3.googleusercontent.com/ytc/AIf8zZQJQZc8JR4gEQz9mdwxEXP86TWB_mEvqKlXVJjB=s176-c-k-c0x00ffffff-no-rj',
    verified: true,
    description: 'Mode, lifestyle et vlogs',
    categories: ['mode', 'lifestyle'],
    social_links: {
      youtube: 'https://youtube.com/@lenasituations',
      instagram: 'https://instagram.com/lenamahfouf',
      twitter: 'https://twitter.com/lenasituations'
    }
  }
];

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('creators')
      .select('count')
      .single();

    if (testError) {
      console.error('Connection test failed:', testError);
      return;
    }

    console.log('Connection successful, inserting initial data...');

    // Insert initial creators
    for (const creator of initialCreators) {
      const { error } = await supabase
        .from('creators')
        .upsert([creator], { onConflict: 'username' });

      if (error) {
        console.error(`Error inserting ${creator.name}:`, error);
      } else {
        console.log(`✅ Successfully inserted ${creator.name}`);
      }
    }

    console.log('Database initialization complete!');

  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

initializeDatabase();