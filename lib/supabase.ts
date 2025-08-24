import { createClient } from '@supabase/supabase-js';
// @ts-ignore
const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY!;


export const supabase = createClient(url, key);
