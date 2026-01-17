
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// We provide placeholders to prevent build-time crashes if env vars are missing.
// The app will validly build, but you MUST set the real Environment Variables in Vercel for it to work.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
