
import { createClient } from '@supabase/supabase-js';

// SAFE INITIALIZATION LOGIC
// -------------------------
// Vercel build environment might not have the env vars set immediately.
// We default to valid placeholder strings to prevent the build from crashing.

const getSupabaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Check if it's a valid string and starts with http. If not, use placeholder.
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return "https://placeholder.supabase.co";
    }
    return url;
};

const getSupabaseKey = () => {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key || typeof key !== 'string' || key.length === 0) {
        return "placeholder-key-for-build";
    }
    return key;
};

const supabaseUrl = getSupabaseUrl();
const supabaseKey = getSupabaseKey();

export const supabase = createClient(supabaseUrl, supabaseKey);
