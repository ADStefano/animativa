import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-purple flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-white/50">Carregando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/cadastro?mode=login" replace />;
  }

  return <>{children}</>;
};
