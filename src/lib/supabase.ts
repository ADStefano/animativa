import { createClient } from '@supabase/supabase-js';

// Suporta múltiplos nomes de variáveis para máxima compatibilidade
const env = (import.meta as any).env || {};

const rawUrl = (
  env.VITE_SUPABASE_URL ||
  env.SUPABASE_URL ||
  env.VITE_PUBLIC_SUPABASE_URL ||
  ''
);

const rawAnonKey = (
  env.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_KEY ||
  env.VITE_SUPABASE_PUBLIC_KEY ||
  env.VITE_ANON_KEY ||
  env.SUPABASE_ANON_KEY ||
  env.SUPABASE_KEY ||
  ''
);

// Sanitiza URL e Chave para evitar problemas com aspas ou espaços acidentais
export const supabaseUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
export const supabaseAnonKey = rawAnonKey.trim().replace(/^["']|["']$/g, '');

// Função diagnóstica para verificar a integridade da chave do Supabase
function diagnoseKey(key: string) {
  if (!key) return { valid: false, message: 'Chave não informada' };
  const parts = key.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      message: `Chave não é um JWT válido de 3 partes. Recebeu ${parts.length} partes. Verifique se copiou a chave 'anon' 'public' completa do Supabase.`,
    };
  }
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
    return {
      valid: !isExpired,
      role: payload.role || payload.aud || 'desconhecido',
      exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Sem expiração',
      isExpired,
      iss: payload.iss || '',
      ref: payload.ref || '',
    };
  } catch (e: any) {
    return { valid: false, message: 'Falha ao decodificar payload JWT: ' + e?.message };
  }
}

const keyDiag = diagnoseKey(supabaseAnonKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseAnonKey.length >= 20
);

if (isSupabaseConfigured) {
  if (!keyDiag.valid) {
    console.warn('⚠️ [Supabase Diagnostic] Problema detectado na VITE_SUPABASE_ANON_KEY:', keyDiag);
  } else {
    console.info(`✅ [Supabase Conectado] Role: ${keyDiag.role} | Expira em: ${keyDiag.exp} | Projeto: ${supabaseUrl}`);
  }
} else {
  console.warn(
    '⚠️ [Animativa] Supabase URL ou Anon Key não configuradas no ambiente.\n' +
    'Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão preenchidas no painel de Settings.'
  );
}

// Fetch resiliente que garante o envio do apikey no Header E no Query Param
const resilientFetch: typeof fetch = async (input, init = {}) => {
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as any)?.url || '';
  const initialHeaders = (init as any)?.headers || (typeof input === 'object' && input && 'headers' in input ? (input as any).headers : {});
  const headers = new Headers(initialHeaders);

  if (supabaseAnonKey && isSupabaseConfigured) {
    // 1. Garante cabeçalho apikey
    if (!headers.has('apikey')) {
      headers.set('apikey', supabaseAnonKey);
    }
    
    // 2. Se for uma chamada REST ou Auth para o Supabase, injeta apikey como query param
    // Isso garante que o PostgREST aceite a chamada mesmo se o proxy ou CORS preflight descartar cabeçalhos
    try {
      if (url.includes('.supabase.co') || (supabaseUrl && url.includes(supabaseUrl))) {
        const parsed = new URL(url);
        if (!parsed.searchParams.has('apikey')) {
          parsed.searchParams.set('apikey', supabaseAnonKey);
          url = parsed.toString();
        }
      }
    } catch {
      // Ignora erro de parsing de URL relativa
    }
  }

  return fetch(url, {
    ...init,
    headers,
  });
};

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
    global: {
      fetch: resilientFetch,
      headers: supabaseAnonKey && isSupabaseConfigured ? {
        apikey: supabaseAnonKey,
      } : undefined,
    }
  }
);


