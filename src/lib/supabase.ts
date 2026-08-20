import { createClient } from '@supabase/supabase-js';

// Sanitiza URL e Chave para evitar problemas com aspas ou espaços acidentais
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
const supabaseAnonKey = rawAnonKey.trim().replace(/^["']|["']$/g, '');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn(
    '⚠️ Supabase URL ou Anon Key não configuradas corretamente no ambiente (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
  );
}

// Cliente público do Supabase para o frontend
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
