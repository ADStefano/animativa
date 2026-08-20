import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Shield, 
  Heart, 
  Globe, 
  Users, 
  ArrowRight,
  User,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const LogoSmall = () => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="flex flex-col items-start select-none">
        <div className="flex items-baseline font-black tracking-tighter text-white lowercase text-xl leading-none">
          <span>an</span>
          <span className="relative inline-flex flex-col items-center">
            <span className="absolute rounded-full bg-brand-orange w-1.5 h-1.5 -top-1" />
            <span>ı</span>
          </span>
          <span>mat</span>
          <span className="relative inline-flex flex-col items-center">
            <span className="absolute rounded-full bg-brand-blue w-1.5 h-1.5 -top-1" />
            <span>ı</span>
          </span>
          <span>va</span>
        </div>
        <p className="font-bold uppercase text-white/40 text-[6px] tracking-[0.4em] mt-0.5 leading-none shrink-0">
          Conexões Vivas
        </p>
      </div>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="Logo Animativa" 
      className="h-10 w-auto object-contain" 
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
    />
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin } = useAuth();

  const displayName = profile?.nome || user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';
  const avatarUrl = profile?.foto_perfil || user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

  const navLinks = [
    { name: "Quem Somos", href: "/quem-somos" },
    { name: "Iniciativas", href: "/iniciativas" },
    { name: "Voluntários", href: "/voluntarios" },
    { name: "Projetos", href: "/projetos" },
    { name: "Eventos", href: "/eventos" },
    { name: "Apoie", href: "/apoie" },
  ];

  return (
    <div className="min-h-screen bg-brand-purple selection:bg-brand-orange/30 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-purple/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <LogoSmall />
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === link.href ? "text-brand-orange" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <Link 
                  to="/perfil" 
                  className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:border-brand-orange hover:bg-white/10 transition-all group shrink-0"
                >
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-7 h-7 rounded-full object-cover border border-brand-orange"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left select-none">
                    <p className="text-[10px] font-black uppercase tracking-wider text-white leading-none group-hover:text-brand-orange transition-colors">
                      {displayName.split(" ")[0]}
                    </p>
                    <span className="text-[8px] font-black uppercase text-green-400 leading-none flex items-center gap-1 mt-0.5">
                      <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                      Conectado
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 shrink-0">
                  <Link 
                    to="/cadastro?mode=login" 
                    className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/cadastro" 
                    className="bg-white text-brand-purple hover:bg-brand-orange hover:text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 text-center inline-block"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button with Avatar */}
            <div className="md:hidden flex items-center gap-4">
              {user && (
                <Link to="/perfil" className="w-8 h-8 rounded-full overflow-hidden border border-brand-orange">
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-brand-purple border-b border-white/10 px-4 pt-2 pb-8"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-4 text-sm font-bold uppercase tracking-widest ${
                  location.pathname === link.href ? "text-brand-orange" : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-white/10 mt-4 pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <img 
                      src={avatarUrl} 
                      alt={displayName} 
                      className="w-10 h-10 rounded-full object-cover border border-brand-orange"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-black uppercase tracking-tighter">{displayName}</p>
                      <span className="text-[10px] font-black uppercase text-green-400">Conectado</span>
                    </div>
                  </div>
                  <Link 
                    to="/perfil" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs transition-colors"
                  >
                    Ir para Perfil
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to="/cadastro?mode=login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/cadastro" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-brand-orange text-white py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-lg"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Sponsors & Partners Section (White Band fixed above Footer in Layout) */}
      <section className="bg-white py-12 border-t border-gray-100 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-brand-purple/40 mb-8">
            Parceiros & Apoiadores Coletivos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 hover:opacity-85 transition-opacity duration-300">
            {/* Sponsor 1: SocioImpacto */}
            <div className="flex items-center gap-2 select-none">
              <Users className="w-5 h-5 text-brand-purple" />
              <span className="font-black text-brand-purple tracking-tighter text-lg md:text-xl">Socio<span className="text-brand-orange">Impacto</span></span>
            </div>
            {/* Sponsor 2: Instituto Regenera */}
            <div className="flex items-center gap-2 select-none">
              <Globe className="w-5 h-5 text-brand-purple" />
              <span className="font-bold text-brand-purple tracking-widest text-xs md:text-sm">INSTITUTO REGENERA</span>
            </div>
            {/* Sponsor 3: Coletivo Vivo */}
            <div className="flex items-center gap-1 select-none">
              <span className="font-black text-brand-purple lowercase text-lg md:text-xl">coletı<span className="text-brand-blue font-black">vo</span>vıvo</span>
            </div>
            {/* Sponsor 4: Rede Ativa */}
            <div className="flex items-center gap-2 select-none">
              <Shield className="w-5 h-5 text-brand-purple" />
              <span className="font-extrabold text-brand-purple uppercase tracking-tight text-sm md:text-base">Rede<span className="font-light text-brand-orange">Ativa</span></span>
            </div>
            {/* Sponsor 5: MudaMundo */}
            <div className="flex items-center gap-2 select-none">
              <Heart className="w-5 h-5 text-brand-orange" />
              <span className="font-black text-brand-purple uppercase tracking-tighter text-base md:text-lg">Muda<span className="text-brand-blue font-medium lowercase">mundo</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Link to="/" className="flex items-center gap-2">
                <LogoSmall />
              </Link>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-white/30">Conexões Vivas</p>
              
              {/* Painel de Manutenção link - shown only to ADMIN users */}
              {user && isAdmin && (
                <Link 
                  to="/admin" 
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-orange hover:text-white transition-colors mt-4 bg-brand-orange/10 border border-brand-orange/30 px-4 py-2 rounded-xl"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Painel de Manutenção (Admin)
                </Link>
              )}
            </div>
            
            <div className="flex gap-12 text-xs font-black uppercase tracking-widest text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>

            {/* Adjusted footer links: Instagram, Facebook, Youtube, LinkedIn */}
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                title="Instagram"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer text-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                title="Facebook"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-blue hover:text-brand-blue transition-all cursor-pointer text-white"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                title="YouTube"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer text-white"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                title="LinkedIn"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-blue hover:text-brand-blue transition-all cursor-pointer text-white"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
              &copy; 2026 Animativa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
