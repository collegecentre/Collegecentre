import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * CollegeCentre 2.0 Supabase Client Foundation
 * Ready for Phase 1 data modeling & authentication
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
