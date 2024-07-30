// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (typeof window !== "undefined") {
	supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
