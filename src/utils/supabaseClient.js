import { createClient } from '@supabase/supabase-js';

// Reutilizamos las variables de entorno que ya tienes en tu proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);