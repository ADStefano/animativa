import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-purple flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-white/50">
            Verificando permissões de acesso...
          </p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!user) {
    return <Navigate to="/cadastro?mode=login&redirect=admin" replace />;
  }

  // Usuário autenticado, mas NÃO é ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-purple text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Acesso Restrito
            </h1>
            <p className="text-xs text-white/60 leading-relaxed">
              Esta área é exclusiva para administradores da Animativa. O perfil atual (<strong>{profile?.nome || user.email}</strong>) possui a função <strong>{profile?.role || 'USUÁRIO'}</strong> e não tem permissão para acessar o painel administrativo.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Link
              to="/perfil"
              className="w-full py-4 bg-brand-orange hover:bg-white hover:text-brand-purple text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Ver Meu Perfil
            </Link>
            <Link
              to="/"
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Usuário é ADMIN confirmado pelo banco
  return <>{children}</>;
};
