import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfobmjqiyesgxeabkbvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmb2JtanFpeWVzZ3hlYWJrYnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzA2MTIsImV4cCI6MjA2MTQ0NjYxMn0.mZWc5eV1kNKt3FsE1gD45u-0bPod28FI8ovEdunlFR0';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
  }
});
