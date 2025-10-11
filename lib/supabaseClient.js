import { createClient } from '@supabase/supabase-js'

// Get the variables from the "environment" variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
