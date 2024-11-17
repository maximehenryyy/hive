import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avpzodslrabeztwcjumm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpvZHNscmFiZXp0d2NqdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDc2NzYsImV4cCI6MjA0NzI4MzY3Nn0.Ql3pOETEoNv66KkhWs4bCpTSnqJq02CwiWE8Rm-DSPo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('count')
      .single();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}