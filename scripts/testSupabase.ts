import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://avpzodslrabeztwcjumm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpvZHNscmFiZXp0d2NqdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDc2NzYsImV4cCI6MjA0NzI4MzY3Nn0.Ql3pOETEoNv66KkhWs4bCpTSnqJq02CwiWE8Rm-DSPo'
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // 1. Create the table
    const { error: createError } = await supabase.rpc('create_creators_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS creators (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
          platform TEXT NOT NULL,
          followers BIGINT NOT NULL,
          avatar TEXT,
          verified BOOLEAN DEFAULT FALSE,
          description TEXT,
          categories TEXT[],
          social_links JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS creators_platform_idx ON creators(platform);
        CREATE INDEX IF NOT EXISTS creators_followers_idx ON creators(followers DESC);
        CREATE INDEX IF NOT EXISTS creators_username_idx ON creators(username);
      `
    });
    
    if (createError) {
      console.log('Table might already exist, continuing...');
    } else {
      console.log('✅ Table created successfully');
    }

    // 2. Insert test data
    const testCreator = {
      name: 'Test Creator',
      username: 'testcreator',
      platform: 'youtube',
      followers: 1000000,
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200',
      verified: true,
      description: 'Test creator for verification',
      categories: ['test'],
      social_links: { youtube: '@testcreator' }
    };

    const { error: insertError } = await supabase
      .from('creators')
      .upsert([testCreator]);
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
    } else {
      console.log('✅ Test data inserted successfully');
    }

    // 3. Verify data
    const { data: creators, error: fetchError } = await supabase
      .from('creators')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
    } else {
      console.log('✅ Data verification successful');
      console.log(`Found ${creators.length} creators in database`);
      console.log(creators);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testConnection();