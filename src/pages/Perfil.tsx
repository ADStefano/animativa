import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Check, 
  AlertCircle, 
  Plus, 
  Calendar, 
  Heart, 
  LogOut, 
  Save, 
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthUser, setAuthUser, logoutUser, subscribeAuthChange, UserProfile } from "../utils/auth";

const ALL_INITIATIVES = [
  "Vozes da Periferia",
  "Sementes do Amanhã",
  "Eco-Ação",
  "Saúde em Movimento",
  "Tecnologia Social",
  "Arte Solidária",
  "Recicla Já",
  "Sorriso de Criança"
];

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••");
  const [twoFactor, setTwoFactor] = useState(false);
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  
  // New event history states
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventRole, setNewEventRole] = useState("Voluntário");

  const [notif, setNotif] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    // Initial fetch
    const current = getAuthUser();
    setUser(current);
    if (current) {
      setName(current.name);
      setEmail(current.email);
      setTwoFactor(!!current.twoFactorEnabled);
      setSelectedInitiatives(current.initiatives || []);
    }

    // Subscribe to any external updates
    const unsubscribe = subscribeAuthChange((updated) => {
      setUser(updated);
      if (updated) {
        setName(updated.name);
        setEmail(updated.email);
        setTwoFactor(!!updated.twoFactorEnabled);
        setSelectedInitiatives(updated.initiatives || []);
      }
    });

    return unsubscribe;
  }, []);

  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-purple flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Acesso Restrito</h2>
        <p className="text-sm text-white/60 max-w-sm mb-8">Você precisa estar conectado ao sistema para acessar a sua área de perfil.</p>
        <Link 
          to="/cadastro" 
          className="px-8 py-4 bg-brand-orange text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all"
        >
          Ir para Login / Cadastro
        </Link>
      </div>
    );
  }

  const triggerNotif = (message: string, type = "success") => {
    setNotif({ show: true, message, type });
    setTimeout(() => {
      setNotif({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleSaveLoginInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      triggerNotif("Nome e E-mail são obrigatórios.", "error");
      return;
    }
    
    const updatedUser: UserProfile = {
      ...user,
      name,
      email,
      twoFactorEnabled: twoFactor
    };
    setAuthUser(updatedUser);
    triggerNotif("Informações de login atualizadas com sucesso!");
  };

  const handleToggleInitiative = (iniName: string) => {
    let updated: string[];
    if (selectedInitiatives.includes(iniName)) {
      updated = selectedInitiatives.filter(i => i !== iniName);
    } else {
      updated = [...selectedInitiatives, iniName];
    }
    setSelectedInitiatives(updated);
    
    const updatedUser: UserProfile = {
      ...user,
      initiatives: updated
    };
    setAuthUser(updatedUser);
    triggerNotif(`Iniciativas atualizadas!`);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) {
      triggerNotif("Preencha o título e a data do evento.", "error");
      return;
    }

    const newEvent = {
      title: newEventTitle,
      date: newEventDate,
      role: newEventRole
    };

    const updatedEvents = [newEvent, ...(user.events || [])];
    const updatedUser: UserProfile = {
      ...user,
      events: updatedEvents
    };

    setAuthUser(updatedUser);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventRole("Voluntário");
    triggerNotif("Participação em evento registrada com sucesso!");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

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
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Área do Voluntário</h1>
            <p className="text-white/60 text-sm mt-2">Gerencie suas credenciais, causas apoiadas e portfólio de impacto.</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-6 py-3 rounded-2xl text-red-400 text-xs font-black uppercase tracking-widest transition-all"
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
              <Check className="w-5 h-5 shrink-0" />
              <span>{notif.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column Left (Profile Card & Login Info Form) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Profile Stat Card */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] relative overflow-hidden flex items-center gap-6">
              <div className="relative">
                <img 
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-brand-orange shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-blue rounded-full border-2 border-brand-purple flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Membro Ativo</span>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white mt-1">{user.name || "Sem Nome"}</h3>
                <p className="text-xs text-white/50">{user.email}</p>
              </div>
            </div>

            {/* Login Credentials Edit Form */}
            <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem]">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                <Lock className="w-5 h-5 text-brand-orange" />
                Informações de Login
              </h2>
              <form onSubmit={handleSaveLoginInfo} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">E-mail de Login</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nova senha..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm" 
                    />
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-brand-blue" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Segurança em 2 Etapas</p>
                      <p className="text-[9px] text-white/40">Código temporário enviado por e-mail</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${twoFactor ? 'bg-brand-orange' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4.5 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </form>
            </div>
          </div>

          {/* Column Right (Volunteer Initiatives & Event History Register) */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Initiatives Selection Section */}
            <section className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem]">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                <Heart className="w-5 h-5 text-brand-orange" />
                Iniciativas de Apoio
              </h2>
              <p className="text-xs text-white/50 mb-6">Selecione quais causas você atua ou gostaria de atuar como voluntário.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALL_INITIATIVES.map((ini) => {
                  const isChecked = selectedInitiatives.includes(ini);
                  return (
                    <button
                      key={ini}
                      onClick={() => handleToggleInitiative(ini)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                        isChecked 
                          ? "bg-brand-orange/10 border-brand-orange text-white" 
                          : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black uppercase tracking-wider">{ini}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked ? "bg-brand-orange border-brand-orange" : "border-white/20 group-hover:border-white/40"
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Event History Section */}
            <section className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem] space-y-8">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-brand-blue" />
                  Histórico de Eventos
                </h2>
                <p className="text-xs text-white/50">Registre sua participação nos eventos comunitários da Animativa para montar seu portfólio.</p>
              </div>

              {/* Form to Register Event Participation */}
              <form onSubmit={handleAddEvent} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue block">Registrar Nova Participação</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Título do Evento</label>
                    <input 
                      type="text" 
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Ex: Mutirão de Reflorestamento"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue transition-colors text-xs" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Data de Participação</label>
                    <input 
                      type="text" 
                      required
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      placeholder="Ex: 10 Mai 2026"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue transition-colors text-xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Função / Cargo</label>
                    <select
                      value={newEventRole}
                      onChange={(e) => setNewEventRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-blue transition-colors text-xs appearance-none"
                    >
                      <option>Voluntário</option>
                      <option>Facilitador</option>
                      <option>Organizador</option>
                      <option>Palestrante</option>
                      <option>Apoiador</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="py-3 bg-brand-blue text-white hover:bg-white hover:text-brand-purple rounded-xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar ao Histórico
                  </button>
                </div>
              </form>

              {/* Event History Timeline List */}
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block">Eventos Registrados</span>
                
                {(!user.events || user.events.length === 0) ? (
                  <p className="text-xs text-white/30 text-center py-8">Nenhum evento registrado ainda. Preencha o formulário acima para adicionar.</p>
                ) : (
                  <div className="space-y-3">
                    {user.events.map((evt, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-tighter">{evt.title}</h4>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">{evt.date}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-brand-orange">{evt.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </section>

          </div>

        </div>

      </div>
    </div>
  );
}
