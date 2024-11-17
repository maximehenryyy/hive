import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://avpzodslrabeztwcjumm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpvZHNscmFiZXp0d2NqdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDc2NzYsImV4cCI6MjA0NzI4MzY3Nn0.Ql3pOETEoNv66KkhWs4bCpTSnqJq02CwiWE8Rm-DSPo'
);

const creators = [
  {
    name: 'Squeezie',
    username: 'squeezie',
    platform: 'youtube',
    followers: 18200000,
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Créateur de contenu gaming et divertissement',
    categories: ['gaming', 'divertissement'],
    social_links: {
      youtube: '@squeezie',
      instagram: '@squeezie',
      twitter: '@xSqueeZie'
    }
  },
  {
    name: 'Cyprien',
    username: 'cyprien',
    platform: 'youtube',
    followers: 14600000,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Humoriste et créateur de contenu',
    categories: ['humour', 'divertissement'],
    social_links: {
      youtube: '@cyprien',
      instagram: '@cyprien',
      twitter: '@MonsieurDream'
    }
  },
  {
    name: 'Léna Situations',
    username: 'lenasituations',
    platform: 'instagram',
    followers: 4200000,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Mode, lifestyle et vlogs',
    categories: ['mode', 'lifestyle'],
    social_links: {
      youtube: '@lenasituations',
      instagram: '@lenamahfouf',
      twitter: '@lenasituations'
    }
  },
  {
    name: 'Tibo InShape',
    username: 'tiboinshape',
    platform: 'youtube',
    followers: 9200000,
    avatar: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Sport, fitness et lifestyle',
    categories: ['sport', 'fitness'],
    social_links: {
      youtube: '@tiboinshape',
      instagram: '@tiboinshape',
      twitter: '@TiboInShape'
    }
  },
  {
    name: 'Mcfly et Carlito',
    username: 'mcflyetcarlito',
    platform: 'youtube',
    followers: 7300000,
    avatar: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Humour et divertissement',
    categories: ['humour', 'musique'],
    social_links: {
      youtube: '@mcflyetcarlito',
      instagram: '@mcflyetcarlito',
      twitter: '@mcflyetcarlito'
    }
  },
  {
    name: 'Norman',
    username: 'norman',
    platform: 'youtube',
    followers: 12100000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Humour et sketches',
    categories: ['humour', 'divertissement'],
    social_links: {
      youtube: '@norman',
      instagram: '@norman',
      twitter: '@NormanDesVideos'
    }
  },
  {
    name: 'Enjoy Phoenix',
    username: 'enjoyphoenix',
    platform: 'youtube',
    followers: 3800000,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Beauté, lifestyle et DIY',
    categories: ['beauté', 'lifestyle'],
    social_links: {
      youtube: '@enjoyphoenix',
      instagram: '@enjoyphoenix',
      twitter: '@EnjoyPhoenix'
    }
  },
  {
    name: 'Amixem',
    username: 'amixem',
    platform: 'youtube',
    followers: 7100000,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200',
    verified: true,
    description: 'Humour et gaming',
    categories: ['humour', 'gaming'],
    social_links: {
      youtube: '@amixem',
      instagram: '@amixem',
      twitter: '@AmiXem'
    }
  }
];

async function populateCreators() {
  try {
    console.log('Starting to populate creators...');
    
    for (const creator of creators) {
      const { error } = await supabase
        .from('creators')
        .upsert([creator], { onConflict: 'username' });
      
      if (error) {
        console.error(`Error inserting ${creator.name}:`, error);
      } else {
        console.log(`✅ Successfully inserted ${creator.name}`);
      }
    }
    
    console.log('Finished populating creators');
    
    // Verify the data
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('followers', { ascending: false });
      
    if (error) {
      console.error('Error fetching creators:', error);
    } else {
      console.log(`Found ${data.length} creators in database`);
      console.log(data);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

populateCreators();