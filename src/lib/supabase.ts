import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyesdwzvucbpcdijjhdn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5ZXNkd3p2dWNicGNkaWpqaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjIyMzAsImV4cCI6MjEwMzY5ODIzMH0.lRWJvh9Vr4EJpLpS-NOE6c-e0LqM1yVDnBd3Jxm3qyM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);