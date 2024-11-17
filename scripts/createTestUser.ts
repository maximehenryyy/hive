import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://avpzodslrabeztwcjumm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHpvZHNscmFiZXp0d2NqdW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDc2NzYsImV4cCI6MjA0NzI4MzY3Nn0.Ql3pOETEoNv66KkhWs4bCpTSnqJq02CwiWE8Rm-DSPo'
);

async function createTestUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@hive.fr',
    password: 'HiveTest123!',
    options: {
      data: {
        username: 'testuser',
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('User created successfully:', data);
  }
}

createTestUser();