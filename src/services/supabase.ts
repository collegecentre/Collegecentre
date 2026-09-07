import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://giiehnvjdswiwylnrliu.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpaWVobnZqZHN3aXd5bG5ybGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODIzMDcsImV4cCI6MjEwNDM1ODMwN30.l095YasH_yWbJhDPn9eFj48cBmiT9PN-vVwpXVKTCpE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
