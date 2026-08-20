import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserRole = 'VOLUNTARIO' | 'ADMIN' | 'COORDENADOR';
export type UserStatus = 'ATIVO' | 'INATIVO' | 'PENDENTE';

export interface UserProfile {
  id: number;
  auth_user_id: string;
  nome: string;
  email: string;
  foto_perfil?: string | null;
  role?: UserRole | string;
  status?: UserStatus | string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, nome: string) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se as credenciais do Supabase estão preenchidas
  const isConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your-project')
  );

  const fetchProfile = async (authUser: User) => {
    try {
      if (!isConfigured) {
        // Fallback local caso ainda não configurado o endpoint do Supabase
        setProfile({
          id: 1,
          auth_user_id: authUser.id,
          nome: authUser.user_metadata?.nome || authUser.email?.split('@')[0] || 'Usuário',
          email: authUser.email || '',
          foto_perfil: authUser.user_metadata?.avatar_url || null,
          role: 'VOLUNTARIO',
          status: 'ATIVO',
        });
        return;
      }

      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil do usuário no Supabase:', error);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Se ainda não existir na tabela usuario, monta a partir dos metadados da auth
        const fallbackProfile: UserProfile = {
          id: 0,
          auth_user_id: authUser.id,
          nome: authUser.user_metadata?.nome || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuário',
          email: authUser.email || '',
          foto_perfil: authUser.user_metadata?.avatar_url || null,
          role: 'VOLUNTARIO',
          status: 'ATIVO',
        };
        setProfile(fallbackProfile);

        // Tenta inserir para garantir integridade
        try {
          const { data: inserted } = await supabase
            .from('usuario')
            .upsert({
              auth_user_id: authUser.id,
              nome: fallbackProfile.nome,
              email: fallbackProfile.email,
              foto_perfil: fallbackProfile.foto_perfil,
              role: fallbackProfile.role,
              status: fallbackProfile.status,
            })
            .select()
            .single();

          if (inserted) {
            setProfile(inserted as UserProfile);
          }
        } catch (e) {
          // Silencioso se der erro de constraint/permissão temporária
        }
      }
    } catch (err) {
      console.error('Erro inesperado ao carregar perfil:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Recupera a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Ouve alterações no estado da autenticação (login, logout, refresh de token)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    });

    if (!error && data.user) {
      await fetchProfile(data.user);
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      await fetchProfile(data.user);
    }

    return { data, error };
  };

  const signInWithOAuth = async (provider: 'google' | 'facebook') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/perfil',
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error };
  };

  const isAdmin = profile?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        loading,
        isConfigured,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
