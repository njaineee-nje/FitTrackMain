import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  email_notifications: boolean;
  weekly_reports: boolean;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'run' | 'ride' | 'swim' | 'workout';
  title: string;
  duration: number; // minutes
  distance?: number; // km
  calories: number;
  activity_date: string;
  created_at: string;
}