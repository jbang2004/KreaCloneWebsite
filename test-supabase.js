require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful!');
      console.log('Session data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection(); 