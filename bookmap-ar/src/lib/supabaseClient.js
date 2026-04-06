import { createClient } from '@supabase/supabase-js'

// Vercel expects environment variables to start with VITE_ if used in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxxxxx.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
