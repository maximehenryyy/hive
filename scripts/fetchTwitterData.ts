import { TwitterApi } from 'twitter-api-v2';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
});

// Liste des comptes Twitter français populaires
const TWITTER_USERNAMES = [
  'xSqueeZie',      // Squeezie
  'MonsieurDream',  // Cyprien
  'TiboInShape',    // Tibo InShape
  'Mcfly_Carlito',  // McFly et Carlito
  'AmiXem',         // Amixem
  'Michou_YT',      // Michou
  'InoxtTag',       // Inoxtag
  'Domingo',        // Domingo
  'Joueur_du_Grenier', // JDG
  'lenasituations', // Léna Situations
  'NormanDesVideos', // Norman
  'EnjoyPhoenix',   // EnjoyPhoenix
  'RebeuDeter',     // Mohamed Henni
  'Sardoche_Lol',   // Sardoche
  'Gotaga',         // Gotaga
];

async function fetchTwitterData(username: string) {
  try {
    console.log(`Fetching data for Twitter user: ${username}`);
    
    const user = await twitterClient.v2.userByUsername(username, {
      'user.fields': ['public_metrics', 'profile_image_url', 'description', 'verified']
    });

    if (!user.data) {
      console.log(`No data found for ${username}`);
      return null;
    }

    const userData = {
      name: user.data.name,
      username: user.data.username.toLowerCase(),
      platform: 'twitter',
      followers: user.data.public_metrics?.followers_count || 0,
      avatar: user.data.profile_image_url?.replace('_normal', '') || '',
      verified: user.data.verified || false,
      description: user.data.description || '',
      categories: ['twitter'],
      social_links: {
        twitter: `https://twitter.com/${user.data.username}`
      }
    };

    console.log(`✅ Successfully fetched data for ${username} (${userData.followers.toLocaleString('fr-FR')} followers)`);
    return userData;

  } catch (error) {
    console.error(`Error fetching data for ${username}:`, error);
    return null;
  }
}

async function fetchAndStoreTwitterData() {
  console.log('Starting Twitter data collection...');

  for (const username of TWITTER_USERNAMES) {
    try {
      const userData = await fetchTwitterData(username);
      
      if (userData) {
        const { error } = await supabase
          .from('creators')
          .upsert([userData], { onConflict: 'username' });

        if (error) {
          console.error(`Error storing ${username}:`, error);
        } else {
          console.log(`✅ Successfully stored ${username} in database`);
        }
      }
    } catch (error) {
      console.error(`Failed to process ${username}:`, error);
    }
  }

  console.log('Finished Twitter data collection');
  
  // Afficher les résultats
  const { data: creators, error } = await supabase
    .from('creators')
    .select('*')
    .eq('platform', 'twitter')
    .order('followers', { ascending: false });
    
  if (error) {
    console.error('Error fetching results:', error);
  } else {
    console.log('\nTop Twitter creators:');
    creators.forEach((creator, index) => {
      console.log(`${index + 1}. ${creator.name} (@${creator.username}): ${creator.followers.toLocaleString('fr-FR')} followers`);
    });
  }
}

fetchAndStoreTwitterData();