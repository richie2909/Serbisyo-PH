import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
