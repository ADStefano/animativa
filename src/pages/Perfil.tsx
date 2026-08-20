import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Lock, 
  Check, 
  AlertCircle, 
  LogOut, 
  Save, 
  ArrowLeft,
  Heart,
  Calendar,
  Briefcase,
  Plus,
  Loader2,
  Building,
  HandHeart
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { ShieldCheck } from "lucide-react";

export default function Perfil() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut, refreshProfile } = useAuth();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<string | null>(null);
  const [isVolunteer, setIsVolunteer] = useState<boolean | null>(null);
  const [userInitiatives, setUserInitiatives] = useState<any[]>([]);

  const [notif, setNotif] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (user) {
      setName(profile?.nome || user.user_metadata?.nome || user.email?.split('@')[0] || "");
      setEmail(user.email || "");

      // Consulta se o usuário possui cadastro como voluntário na tabela de domínio
      checkVolunteerAndInitiatives();
    }
  }, [user, profile]);

  const checkVolunteerAndInitiatives = async () => {
    if (!user) return;
    try {
      // 1. Checa voluntário
      const { data: volData } = await supabase
        .from('voluntario')
        .select('id, nome, data_cadastro, habilidades, status_voluntario')
        .eq('email', user.email)
        .maybeSingle();

      if (volData) {
        setIsVolunteer(true);
        setVolunteerStatus(volData.status_voluntario || 'PENDENTE');
      } else {
        setIsVolunteer(false);
        setVolunteerStatus(null);
      }

      // 2. Checa iniciativas cadastradas
      const { data: iniData } = await supabase
        .from('iniciativa')
        .select('id, nome, setor_sociedade, cidade, uf, autorizada')
        .eq('email', user.email);

      setUserInitiatives(iniData || []);
    } catch (err) {
      console.warn("Erro ao buscar vínculos do usuário:", err);
    }
  };

  const triggerNotif = (message: string, type = "success") => {
    setNotif({ show: true, message, type });
    setTimeout(() => {
      setNotif({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerNotif("O nome é obrigatório.", "error");
      return;
    }

    setLoading(true);
    try {
      // Atualiza metadados no Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { nome: name.trim() }
      });

      if (authUpdateError) {
        throw authUpdateError;
      }

      // Atualiza na tabela usuario se existir
      if (profile?.id) {
        await supabase
          .from('usuario')
          .update({ nome: name.trim(), updated_at: new Date().toISOString() })
          .eq('id', profile.id);
      }

      // Se informou nova senha
      if (password.trim().length >= 6) {
        const { error: pwdError } = await supabase.auth.updateUser({
          password: password.trim()
        });
        if (pwdError) throw pwdError;
        setPassword("");
      }

      await refreshProfile();
      triggerNotif("Perfil atualizado com sucesso no Supabase!");
    } catch (err: any) {
      triggerNotif(err?.message || "Erro ao salvar alterações.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      navigate("/");
    }
  };

  const displayName = profile?.nome || name || user?.email?.split('@')[0] || "Usuário";
  const avatarUrl = profile?.foto_perfil || user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

  return (
    <div className="py-24 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-orange/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-blue/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Back Button & Profile Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-brand-orange transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Área do Usuário</h1>
            <p className="text-white/60 text-sm mt-2">Gerencie sua conta na Animativa, suas iniciativas e cadastros de voluntariado.</p>
          </div>
          
          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-3 rounded-2xl text-red-400 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>

        {/* Global Notification Banner */}
        <AnimatePresence>
          {notif.show && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-4 md:right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border text-sm font-bold shadow-2xl ${
                notif.type === "success" 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {notif.type === "success" ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{notif.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column Left (Profile Card & Login Info Form) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Profile Stat Card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-brand-orange shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-blue rounded-full border-2 border-brand-purple flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                    Conta Supabase
                  </span>
                  {profile?.role === 'ADMIN' ? (
                    <span className="px-2.5 py-0.5 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  ) : profile?.role === 'COORDENADOR' ? (
                    <span className="px-2.5 py-0.5 bg-brand-blue/20 border border-brand-blue/40 text-brand-blue text-[9px] font-black uppercase tracking-widest rounded-full">
                      Coordenador
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 text-white/70 text-[9px] font-black uppercase tracking-widest rounded-full">
                      Voluntário
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white mt-1">{displayName}</h3>
                <p className="text-xs text-white/50">{user?.email}</p>
              </div>
            </div>

            {/* Admin Quick Access Banner if user is Admin */}
            {isAdmin && (
              <div className="bg-gradient-to-r from-brand-orange/20 via-brand-purple/40 to-brand-orange/10 border border-brand-orange/40 p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-lg shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">Privilégios de Administrador</h4>
                    <p className="text-[11px] text-white/60">Acesse o painel de aprovação e gerenciamento.</p>
                  </div>
                </div>
                <Link
                  to="/admin"
                  className="w-full sm:w-auto px-6 py-3 bg-brand-orange hover:bg-white hover:text-brand-purple text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg text-center shrink-0"
                >
                  Abrir Painel Admin &rarr;
                </Link>
              </div>
            )}

            {/* Edit Profile Form */}
            <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem]">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-brand-orange" />
                Dados do Perfil
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="email" 
                      value={email}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white/50 cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Alterar Senha (Opcional)</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Deixe em branco para manter a atual"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar Alterações
                </button>
              </form>
            </div>
          </div>

          {/* Column Right (Diferenciação: Ações de Voluntário & Ações de Iniciativa) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bloco 1: Status de Voluntariado */}
            <section className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <HandHeart className="w-5 h-5 text-brand-orange" />
                  Cadastro de Voluntário
                </h2>
                {isVolunteer ? (
                  volunteerStatus === 'APROVADO' ? (
                    <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                      Aprovado
                    </span>
                  ) : volunteerStatus === 'REPROVADO' ? (
                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                      Reprovado
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                      Aguardando Aprovação
                    </span>
                  )
                ) : (
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Não Cadastrado
                  </span>
                )}
              </div>
              
              <p className="text-xs text-white/60 mb-6 leading-relaxed">
                {isVolunteer 
                  ? volunteerStatus === 'APROVADO'
                    ? "Seu cadastro de voluntário está aprovado! Você está apto para participar de todas as ações e projetos."
                    : volunteerStatus === 'REPROVADO'
                    ? "Seu cadastro de voluntário não foi aprovado pela coordenação. Você pode atualizar seus dados para uma nova análise."
                    : "Seu cadastro de voluntário foi recebido e está em análise pela equipe da Animativa."
                  : "Criar uma conta na plataforma não o torna automaticamente um voluntário. Se deseja atuar nos projetos e causas sociais, complete seu cadastro de voluntário."}
              </p>

              {isVolunteer ? (
                <Link
                  to="/voluntarios"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all"
                >
                  Ver / Atualizar Dados de Voluntário
                </Link>
              ) : (
                <Link
                  to="/voluntarios"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Quero ser Voluntário
                </Link>
              )}
            </section>

            {/* Bloco 2: Minhas Iniciativas Cadastradas */}
            <section className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Building className="w-5 h-5 text-brand-blue" />
                    Minhas Iniciativas
                  </h2>
                  <p className="text-xs text-white/50 mt-1">Iniciativas e projetos cadastrados por você na plataforma.</p>
                </div>

                <Link 
                  to="/iniciativas"
                  className="px-4 py-2.5 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 rounded-xl text-brand-blue text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Iniciativa
                </Link>
              </div>

              {userInitiatives.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center space-y-3">
                  <Building className="w-8 h-8 text-white/20 mx-auto" />
                  <p className="text-xs text-white/40">Você ainda não cadastrou nenhuma iniciativa social.</p>
                  <Link 
                    to="/iniciativas"
                    className="inline-block text-xs font-bold text-brand-orange hover:underline uppercase tracking-wider"
                  >
                    Cadastrar Minha Primeira Iniciativa &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userInitiatives.map((ini) => (
                    <div 
                      key={ini.id} 
                      className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tighter text-white">{ini.nome}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                          {ini.setor_sociedade || "Impacto Social"} • {ini.cidade ? `${ini.cidade} - ${ini.uf}` : "Nacional"}
                        </p>
                      </div>
                      <Link 
                        to={`/projetos/${ini.id}`}
                        className="text-xs font-bold text-brand-blue hover:underline uppercase tracking-wider"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

        </div>

      </div>
    </div>
  );
}
