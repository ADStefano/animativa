import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  Calendar, 
  Settings, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2,
  ArrowUpRight,
  Briefcase,
  X,
  User,
  Shield,
  ShieldAlert,
  Handshake,
  Upload,
  Image as ImageIcon,
  Sun,
  Moon
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAuthUser } from "../utils/auth";

type Tab = "dashboard" | "iniciativas" | "voluntarios" | "projetos" | "eventos" | "usuarios" | "configuracoes" | "parceiros" | "solicitacoes";

interface EditModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const EditModal = ({ title, onClose, onSave, children }: EditModalProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-[#121212] border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
    >
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <XCircle className="w-6 h-6 text-white/40 hover:text-white" />
        </button>
      </div>
      <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {children}
      </div>
      <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
        <button onClick={onClose} className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancelar</button>
        <button onClick={onSave} className="px-8 py-4 bg-brand-orange rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-orange/20">Confirmar</button>
      </div>
    </motion.div>
  </motion.div>
);

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-all" />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-all appearance-none" />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-all min-h-[120px] resize-none" />
);

export default function Admin() {
  const user = getAuthUser();

  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Acesso Negado</h2>
        <p className="text-sm text-white/50 max-w-sm mb-8">O Painel de Manutenção está disponível apenas para administradores logados.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/" 
            className="px-8 py-4 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
          >
            Voltar ao Início
          </Link>
          <Link 
            to="/cadastro?mode=login" 
            className="px-8 py-4 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }

    return () => {
      document.documentElement.classList.remove("light-theme");
    };
  }, []);

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  };

  const [editingItem, setEditingItem] = useState<{ type: Tab, data: any, isNew?: boolean } | null>(null);

  // Initial Data States
  const [iniciativas, setIniciativas] = useState([
    { name: "Vozes da Periferia", cat: "Cultura", status: "Ativo", date: "12/03/2026" },
    { name: "Sementes do Amanhã", cat: "Educação", status: "Ativo", date: "10/03/2026" },
    { name: "Eco-Ação", cat: "Meio Ambiente", status: "Pendente", date: "15/03/2026" },
    { name: "Saúde em Movimento", cat: "Saúde", status: "Ativo", date: "08/03/2026" },
    { name: "Tecnologia Social", cat: "Educação", status: "Ativo", date: "05/03/2026" },
    { name: "Arte Solidária", cat: "Cultura", status: "Ativo", date: "01/03/2026" },
    { name: "Recicla Já", cat: "Meio Ambiente", status: "Ativo", date: "25/02/2026" },
    { name: "Sorriso de Criança", cat: "Saúde", status: "Ativo", date: "20/02/2026" },
  ]);

  const [voluntarios, setVoluntarios] = useState([
    { name: "Ana Clara", skills: ["Design", "Social Media"], availability: "Finais de Semana", status: "Ativo" },
    { name: "Ricardo Souza", skills: ["TI", "Gestão"], availability: "Noite", status: "Ativo" },
    { name: "Mariana Lima", skills: ["Educação", "Artes"], availability: "Manhã", status: "Pendente" },
  ]);

  const [projetos, setProjetos] = useState([
    { title: "Re-Verde Urbano", initiative: "Eco-Vida", progress: 75, status: "Em andamento", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" },
    { title: "EducaTech", initiative: "TechSocial", progress: 40, status: "Em andamento", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" },
    { title: "Cozinha Solidária", initiative: "Bairro Vivo", progress: 100, status: "Concluído", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" },
    { title: "Arte na Praça", initiative: "Cultura Livre", progress: 30, status: "Em andamento", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800" },
    { title: "Código para Todos", initiative: "TechSocial", progress: 60, status: "Em andamento", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" },
    { title: "Horta Comunitária", initiative: "Eco-Vida", progress: 90, status: "Em andamento", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800" },
    { title: "Música no Parque", initiative: "Cultura Viva", progress: 100, status: "Concluído", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" },
    { title: "Saúde Itinerante", initiative: "Saúde Já", progress: 20, status: "Em andamento", image: "https://images.unsplash.com/photo-1505751172107-573957a243b0?auto=format&fit=crop&q=80&w=800" },
    { title: "Tecnologia Social", initiative: "InovaSocial", progress: 50, status: "Em andamento", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" },
    { title: "Esporte para Vida", initiative: "AtivaMente", progress: 85, status: "Em andamento", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800" },
    { title: "Alfabetização Já", initiative: "EducaMais", progress: 45, status: "Em andamento", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800" },
    { title: "Oceano Limpo", initiative: "Eco-Vida", progress: 15, status: "Em andamento", image: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?auto=format&fit=crop&q=80&w=800" },
    { title: "Teatro na Escola", initiative: "Cultura Viva", progress: 70, status: "Em andamento", image: "https://images.unsplash.com/photo-1503095396549-807a8bc36675?auto=format&fit=crop&q=80&w=800" },
    { title: "Inclusão Digital", initiative: "TechSocial", progress: 95, status: "Em andamento", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800" },
    { title: "Sustentabilidade Rural", initiative: "Eco-Vida", progress: 10, status: "Em andamento", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" },
  ]);

  const [eventos, setEventos] = useState([
    { title: "Workshop: Design de Impacto", date: "15 Abr", type: "Online", location: "Zoom" },
    { title: "Encontro Regional Sul", date: "22 Abr", type: "Presencial", location: "Curitiba, PR" },
    { title: "Webinar: Captação de Recursos", date: "05 Mai", type: "Online", location: "YouTube" },
    { title: "Hackathon Social 2026", date: "12 Mai", type: "Presencial", location: "São Paulo, SP" },
  ]);

  const [usuarios, setUsuarios] = useState([
    { name: "Gus Silva", email: "gus@animativa.org", role: "Administrador", status: "Ativo", twoFactorEnabled: true, dateJoined: "01/01/2026", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" },
    { name: "Ana Clara", email: "ana.clara@gmail.com", role: "Voluntário", status: "Ativo", twoFactorEnabled: false, dateJoined: "12/03/2026", avatar: "" },
    { name: "Ricardo Souza", email: "ricardo.souza@outlook.com", role: "Coordenador", status: "Ativo", twoFactorEnabled: true, dateJoined: "28/02/2026", avatar: "" },
    { name: "Mariana Lima", email: "mari.lima@yahoo.com", role: "Voluntário", status: "Pendente", twoFactorEnabled: false, dateJoined: "15/03/2026", avatar: "" },
  ]);

  const [parceiros, setParceiros] = useState([
    { id: "1", name: "Instituto Cooperar", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150", type: "Parceiro", site: "https://cooperar.org" },
    { id: "2", name: "Fundação Educar", logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=150", type: "Apoiador", site: "https://educar.org" },
    { id: "3", name: "União Social", logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=150", type: "Apoiador", site: "https://uniaosocial.org" },
  ]);

  // Custom Fields States
  const [projectCategories, setProjectCategories] = useState(["Cultura", "Educação", "Meio Ambiente", "Saúde", "Inovação", "Esporte", "Tecnologia", "Social"]);
  const [volunteerSkills, setVolunteerSkills] = useState(["Design", "Social Media", "TI", "Gestão", "Educação", "Artes", "Cozinha", "Ensino", "Saúde", "Direito", "Marketing", "Eventos"]);
  const [impactTypes, setImpactTypes] = useState(["Social", "Ambiental", "Educacional", "Cultural", "Econômico"]);

  const [managingConfig, setManagingConfig] = useState<{ id: string, label: string, items: string[] } | null>(null);

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "iniciativas", label: "Iniciativas", icon: Sparkles },
    { id: "voluntarios", label: "Voluntários", icon: Users },
    { id: "projetos", label: "Projetos", icon: Briefcase },
    { id: "eventos", label: "Eventos", icon: Calendar },
    { id: "usuarios", label: "Usuários", icon: User },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  const stats = [
    { label: "Iniciativas", value: "12", trend: "+20%", color: "brand-orange", icon: Sparkles },
    { label: "Voluntários", value: "1.240", trend: "+5%", color: "brand-blue", icon: Users },
    { label: "Eventos", value: "8", trend: "Este mês", color: "white", icon: Calendar },
    { label: "Impacto", value: "45k", trend: "+12%", color: "brand-orange", icon: ArrowUpRight },
  ];

  const handleApprovePending = (type: string, idOrKey: string) => {
    if (type === "iniciativa") {
      setIniciativas(iniciativas.map(i => i.name === idOrKey ? { ...i, status: "Ativo" } : i));
    } else if (type === "voluntario") {
      setVoluntarios(voluntarios.map(v => v.name === idOrKey ? { ...v, status: "Ativo" } : v));
    } else if (type === "usuario") {
      setUsuarios(usuarios.map(u => u.email === idOrKey ? { ...u, status: "Ativo" } : u));
    }
  };

  const handleRejectPending = (type: string, idOrKey: string) => {
    if (confirm(`Deseja realmente recusar esta solicitação?`)) {
      if (type === "iniciativa") {
        setIniciativas(iniciativas.filter(i => i.name !== idOrKey));
      } else if (type === "voluntario") {
        setVoluntarios(voluntarios.filter(v => v.name !== idOrKey));
      } else if (type === "usuario") {
        setUsuarios(usuarios.filter(u => u.email !== idOrKey));
      }
    }
  };

  const onSaveConfig = () => {
    if (!managingConfig) return;
    if (managingConfig.id === "categories") setProjectCategories(managingConfig.items);
    if (managingConfig.id === "skills") setVolunteerSkills(managingConfig.items);
    if (managingConfig.id === "impact") setImpactTypes(managingConfig.items);
    setManagingConfig(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-brand-purple/20 backdrop-blur-3xl p-8 flex flex-col sticky top-0 h-screen">
        <div className="mb-12">
          <Link to="/" className="text-2xl font-black text-white lowercase tracking-tighter flex items-baseline">
            an
            <span className="relative inline-flex flex-col items-center">
              <span className="absolute -top-[0.2em] w-[0.18em] h-[0.18em] rounded-full bg-brand-orange" />
              ı
            </span>
            mat
            <span className="relative inline-flex flex-col items-center">
              <span className="absolute -top-[0.2em] w-[0.18em] h-[0.18em] rounded-full bg-brand-blue" />
              ı
            </span>
            va
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">Painel Admin</p>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id as Tab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === link.id 
                  ? "bg-white text-brand-purple shadow-xl" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 px-4">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border border-brand-orange"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-widest">{user.name}</p>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Super Usuário</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {activeTab === "solicitacoes" ? "Solicitações Pendentes" : sidebarLinks.find(l => l.id === activeTab)?.label}
            </h1>
            <p className="text-white/40 text-sm">Bem-vindo de volta ao centro de comando.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-brand-orange transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <div className="space-y-12">
                {/* Stats Grid - Highlighting in larger numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/20 transition-all flex flex-col justify-between min-h-[200px]">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/10 blur-3xl -mr-12 -mt-12 group-hover:bg-${stat.color}/20 transition-all`} />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</span>
                        {stat.icon && <stat.icon className={`w-6 h-6 text-${stat.color}`} />}
                      </div>
                      
                      <div className="relative z-10 mt-6">
                        <p className="text-5xl md:text-6xl font-black tracking-tighter mb-3">{stat.value}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                            {stat.trend}
                          </span>
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Crescimento</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity below Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-black uppercase tracking-tighter">Solicitações Pendentes</h2>
                      <button 
                        onClick={() => setActiveTab("solicitacoes")}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:text-white transition-colors"
                      >
                        Ver Todas
                      </button>
                    </div>
                    <div className="space-y-6">
                      {(() => {
                        const pendingIniciativas = iniciativas.filter(i => i.status === "Pendente").map(i => ({
                          id: i.name,
                          name: i.name,
                          type: "Iniciativa",
                          date: i.date || "Recente",
                          rawType: "iniciativa"
                        }));

                        const pendingVoluntarios = voluntarios.filter(v => v.status === "Pendente").map(v => ({
                          id: v.name,
                          name: v.name,
                          type: "Voluntário",
                          date: "Recente",
                          rawType: "voluntario"
                        }));

                        const pendingUsuarios = usuarios.filter(u => u.status === "Pendente").map(u => ({
                          id: u.email,
                          name: u.name,
                          type: "Usuário",
                          date: u.dateJoined || "Recente",
                          rawType: "usuario"
                        }));

                        const dashboardPending = [...pendingIniciativas, ...pendingVoluntarios, ...pendingUsuarios].slice(0, 3);

                        if (dashboardPending.length === 0) {
                          return (
                            <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl text-center text-xs text-white/30 uppercase font-black tracking-widest">
                              Nenhuma pendência
                            </div>
                          );
                        }

                        return dashboardPending.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center">
                                {item.type === "Iniciativa" ? <Sparkles className="w-5 h-5 text-brand-orange" /> : item.type === "Voluntário" ? <Users className="w-5 h-5 text-brand-blue" /> : <User className="w-5 h-5 text-white" />}
                              </div>
                              <div>
                                <p className="text-sm font-black uppercase tracking-tighter">{item.name}</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.type} • {item.date}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleApprovePending(item.rawType, item.id)}
                                className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-500"
                                title="Aprovar"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleRejectPending(item.rawType, item.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                                title="Recusar"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-black uppercase tracking-tighter">Próximos Eventos</h2>
                      <button 
                        onClick={() => setActiveTab("eventos")}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-white transition-colors"
                      >
                        Gerenciar Agenda
                      </button>
                    </div>
                    <div className="space-y-6">
                      {[
                        { title: "Hackathon Social", date: "28 Mar", time: "14:00", attendees: 45 },
                        { title: "Workshop CNV", date: "02 Abr", time: "19:00", attendees: 120 },
                        { title: "Encontro de Líderes", date: "05 Abr", time: "10:00", attendees: 15 },
                      ].map((event, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-center">
                              <span className="text-[10px] font-black text-brand-orange leading-none">{event.date.split(' ')[0]}</span>
                              <span className="text-[8px] font-black uppercase text-white/40">{event.date.split(' ')[1]}</span>
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-tighter">{event.title}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">{event.time} • {event.attendees} Inscritos</p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ArrowUpRight className="w-5 h-5 text-white/40" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "iniciativas" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Gestão de Iniciativas</h2>
                  <button 
                    onClick={() => setEditingItem({ type: "iniciativas", data: { name: "", cat: "Educação", status: "Pendente", date: new Date().toLocaleDateString() }, isNew: true })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Iniciativa
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Iniciativa</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Categoria</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Data</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iniciativas.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-brand-purple/40 border border-white/10" />
                              <span className="text-sm font-black uppercase tracking-tighter">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">{item.cat}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Ativo' ? 'bg-green-500' : 'bg-brand-orange'}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-black text-white/40">{item.date}</td>
                          <td className="px-8 py-6">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setEditingItem({ type: "iniciativas", data: item })}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "voluntarios" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Gestão de Voluntários</h2>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Exportar CSV</button>
                    <button 
                      onClick={() => setEditingItem({ type: "voluntarios", data: { name: "", skills: [], availability: "Manhã", status: "Pendente" }, isNew: true })}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                    >
                      <Plus className="w-4 h-4" />
                      Novo Voluntário
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Nome</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Habilidades</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Disponibilidade</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voluntarios.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-black text-xs">
                                {item.name.charAt(0)}
                              </div>
                              <span className="text-sm font-black uppercase tracking-tighter">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2">
                              {item.skills.map(skill => (
                                <span key={skill} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-full border border-white/5">{skill}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{item.availability}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Ativo' ? 'bg-green-500' : 'bg-brand-orange'}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setEditingItem({ type: "voluntarios", data: item })}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "projetos" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Gestão de Projetos</h2>
                  <button 
                    onClick={() => setEditingItem({ type: "projetos", data: { title: "", initiative: "", progress: 0, status: "Em andamento", image: "" }, isNew: true })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-purple border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Projeto
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projetos.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((project, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group">
                      <div className="flex gap-4 mb-6 items-start">
                        {project.image ? (
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 shrink-0 bg-white/5 flex items-center justify-center text-white/20">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black uppercase tracking-tighter mb-1 truncate">{project.title}</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Iniciativa: {project.initiative}</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shrink-0 ${project.status === 'Concluído' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-brand-blue/20 text-brand-blue bg-brand-blue/10'}`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white/40">Progresso</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange transition-all duration-500" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingItem({ type: "projetos", data: project })}
                          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all"
                        >
                          Editar Campos
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "eventos" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Agenda de Eventos</h2>
                  <button 
                    onClick={() => setEditingItem({ type: "eventos", data: { title: "", date: "", type: "Online", location: "" }, isNew: true })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                  >
                    <Plus className="w-4 h-4" />
                    Agendar Evento
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {eventos.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())).map((event, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group hover:border-brand-blue transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-white/20" />
                        </button>
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{event.title}</h3>
                      <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-6">{event.date}</p>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-white/40">
                          <div className={`w-2 h-2 rounded-full ${event.type === 'Online' ? 'bg-blue-400' : 'bg-green-400'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{event.type}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{event.location}</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingItem({ type: "eventos", data: event })}
                          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all"
                        >
                          Editar
                        </button>
                        <button className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 transition-all hover:text-white"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "usuarios" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Gestão de Usuários</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Gerencie permissões, segurança e credenciais de acesso</p>
                  </div>
                  <button 
                    onClick={() => setEditingItem({ 
                      type: "usuarios", 
                      data: { name: "", email: "", role: "Voluntário", status: "Pendente", twoFactorEnabled: false, dateJoined: new Date().toLocaleDateString(), avatar: "" }, 
                      isNew: true 
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-purple transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Usuário</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Função</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">2FA Segurança</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Cadastro</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-12 text-center text-xs text-white/30 uppercase font-black tracking-widest">
                            Nenhum usuário encontrado
                          </td>
                        </tr>
                      ) : (
                        usuarios.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                {item.avatar ? (
                                  <img 
                                    src={item.avatar} 
                                    alt={item.name} 
                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-brand-orange text-xs">
                                    {item.name ? item.name.charAt(0) : "U"}
                                  </div>
                                )}
                                <div>
                                  <span className="text-sm font-black uppercase tracking-tighter block">{item.name || "Sem Nome"}</span>
                                  <span className="text-[10px] text-white/40 block">{item.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                item.role === 'Administrador' 
                                  ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' 
                                  : item.role === 'Coordenador' 
                                    ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' 
                                    : 'bg-white/5 border-white/10 text-white/60'
                              }`}>
                                {item.role}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center justify-center">
                                {item.twoFactorEnabled ? (
                                  <div className="flex items-center gap-1.5 text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Ativo</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-white/30 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Inativo</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-black text-white/40">{item.dateJoined}</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'Ativo' 
                                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
                                    : item.status === 'Pendente' 
                                      ? 'bg-brand-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]' 
                                      : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                }`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingItem({ type: "usuarios", data: item })}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                  title="Editar Usuário"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir o usuário ${item.name}?`)) {
                                      setUsuarios(usuarios.filter(u => u.email !== item.email));
                                    }
                                  }}
                                  className="p-2 hover:bg-red-500/20 text-red-500/60 hover:text-red-400 rounded-lg transition-colors"
                                  title="Remover Usuário"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "configuracoes" && (
              <div className="max-w-2xl space-y-12">
                <section className="space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter">Campos Personalizados</h2>
                  <div className="space-y-4">
                    {[
                      { id: "categories", label: "Categorias de Projetos", items: projectCategories },
                      { id: "skills", label: "Habilidades de Voluntários", items: volunteerSkills },
                      { id: "impact", label: "Tipos de Impacto", items: impactTypes },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <div>
                          <p className="text-sm font-black uppercase tracking-tighter">{item.label}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.items.length} opções configuradas</p>
                        </div>
                        <button 
                          onClick={() => setManagingConfig({ id: item.id, label: item.label, items: [...item.items] })}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all"
                        >
                          Gerenciar
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">Parceiros & Apoiadores</h2>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Gerencie os logotipos exibidos no portal institucional</p>
                    </div>
                    <button 
                      onClick={() => setEditingItem({ 
                        type: "parceiros", 
                        data: { id: Date.now().toString(), name: "", logo: "", type: "Parceiro", site: "" }, 
                        isNew: true 
                      })}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-brand-purple transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Novo Parceiro
                    </button>
                  </div>

                  {parceiros.length === 0 ? (
                    <div className="p-8 border border-white/5 bg-white/[0.02] rounded-2xl text-center text-xs text-white/30 uppercase font-black tracking-widest">
                      Nenhum parceiro cadastrado
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {parceiros.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-white/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 border border-white/10 overflow-hidden shrink-0">
                              <img 
                                src={item.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150"} 
                                alt={item.name} 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150";
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-tighter text-white truncate max-w-[150px]">{item.name || "Sem Nome"}</p>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border inline-block mt-1 ${
                                item.type === 'Parceiro' 
                                  ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' 
                                  : item.type === 'Patrocinador'
                                    ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange'
                                    : 'bg-white/5 border-white/10 text-white/50'
                              }`}>
                                {item.type}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 shrink-0">
                            <button 
                              onClick={() => setEditingItem({ type: "parceiros", data: item })}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja remover o parceiro ${item.name}?`)) {
                                  setParceiros(parceiros.filter(p => p.id !== item.id));
                                }
                              }}
                              className="p-2 hover:bg-red-500/20 text-red-500/60 hover:text-red-400 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Aparência & Tema</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Selecione o modo de exibição visual da plataforma</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => toggleTheme("light")}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                        theme === "light"
                          ? "bg-white text-brand-purple border-brand-orange shadow-lg scale-[1.02]"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${theme === "light" ? "bg-brand-purple/5 text-brand-purple" : "bg-white/5 text-white"}`}>
                          <Sun className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tighter">Modo Claro</p>
                          <p className={`text-[9px] uppercase tracking-widest ${theme === "light" ? "text-brand-purple/60" : "text-white/40"}`}>Interface clara e limpa</p>
                        </div>
                      </div>
                      {theme === "light" && <div className="w-2.5 h-2.5 bg-brand-orange rounded-full" />}
                    </button>

                    <button
                      onClick={() => toggleTheme("dark")}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                        theme === "dark"
                          ? "bg-white/10 text-white border-brand-orange shadow-lg scale-[1.02]"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-white/10 text-white" : "bg-white/5 text-white"}`}>
                          <Moon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tighter">Modo Escuro</p>
                          <p className={`text-[9px] uppercase tracking-widest ${theme === "dark" ? "text-white/60" : "text-white/40"}`}>Interface noturna imersiva</p>
                        </div>
                      </div>
                      {theme === "dark" && <div className="w-2.5 h-2.5 bg-brand-orange rounded-full" />}
                    </button>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter">Segurança & Acesso</h2>
                  <div className="p-8 bg-brand-orange/10 border border-brand-orange/20 rounded-[2.5rem]">
                    <h3 className="text-sm font-black uppercase tracking-tighter text-brand-orange mb-2">Modo de Manutenção</h3>
                    <p className="text-xs text-white/60 mb-6 leading-relaxed">Ao ativar este modo, apenas administradores poderão acessar a plataforma pública. Útil para atualizações críticas.</p>
                    <button className="px-8 py-3 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Ativar Modo</button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "solicitacoes" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Fila de Aprovação</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Gerencie as novas solicitações e cadastros pendentes</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-brand-purple transition-all"
                  >
                    Voltar ao Dashboard
                  </button>
                </div>

                {/* Combined list of all real pending items */}
                {(() => {
                  const pendingIniciativas = iniciativas.filter(i => i.status === "Pendente").map(i => ({
                    id: i.name,
                    name: i.name,
                    type: "Iniciativa",
                    info: i.cat,
                    date: i.date || "15/03/2026",
                    rawType: "iniciativa"
                  }));

                  const pendingVoluntarios = voluntarios.filter(v => v.status === "Pendente").map(v => ({
                    id: v.name,
                    name: v.name,
                    type: "Voluntário",
                    info: v.skills.join(", "),
                    date: "Recentemente",
                    rawType: "voluntario"
                  }));

                  const pendingUsuarios = usuarios.filter(u => u.status === "Pendente").map(u => ({
                    id: u.email,
                    name: u.name,
                    type: "Usuário",
                    info: `${u.role} (${u.email})`,
                    date: u.dateJoined || "Recentemente",
                    rawType: "usuario"
                  }));

                  const allPending = [...pendingIniciativas, ...pendingVoluntarios, ...pendingUsuarios]
                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

                  if (allPending.length === 0) {
                    return (
                      <div className="p-16 border border-white/5 bg-white/[0.01] rounded-[2.5rem] text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-40" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">Nenhuma solicitação pendente</h3>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Bom trabalho! Tudo está em dia.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allPending.map((item, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-white/20 transition-all min-h-[180px]">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                item.rawType === 'iniciativa'
                                  ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange'
                                  : item.rawType === 'voluntario'
                                    ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'
                                    : 'bg-white/5 border-white/10 text-white/50'
                              }`}>
                                {item.type}
                              </span>
                              <span className="text-[9px] text-white/30 uppercase tracking-widest">{item.date}</span>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tighter text-white">{item.name}</h3>
                            <p className="text-xs text-white/50 mt-1">{item.info}</p>
                          </div>

                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <span className="text-[9px] text-brand-orange uppercase font-black tracking-widest">Aguardando Avaliação</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleApprovePending(item.rawType, item.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                title="Aprovar"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Aprovar
                              </button>
                              <button 
                                onClick={() => handleRejectPending(item.rawType, item.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                title="Recusar"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Recusar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Edit Modals */}
      <AnimatePresence>
        {editingItem && (
          <EditModal 
            title={editingItem.isNew 
              ? `Novo ${editingItem.type === "usuarios" ? "Usuário" : editingItem.type === "parceiros" ? "Parceiro / Apoiador" : editingItem.type.slice(0, -1)}` 
              : `Editar ${editingItem.type === "usuarios" ? "Usuário" : editingItem.type === "parceiros" ? "Parceiro / Apoiador" : editingItem.type.slice(0, -1)}`} 
            onClose={() => setEditingItem(null)}
            onSave={() => {
              if (editingItem.isNew) {
                if (editingItem.type === "iniciativas") setIniciativas([...iniciativas, editingItem.data]);
                if (editingItem.type === "voluntarios") setVoluntarios([...voluntarios, editingItem.data]);
                if (editingItem.type === "projetos") setProjetos([...projetos, editingItem.data]);
                if (editingItem.type === "eventos") setEventos([...eventos, editingItem.data]);
                if (editingItem.type === "usuarios") setUsuarios([...usuarios, editingItem.data]);
                if (editingItem.type === "parceiros") setParceiros([...parceiros, editingItem.data]);
              } else {
                // Basic update logic (matching by name/title/email for now)
                if (editingItem.type === "iniciativas") setIniciativas(iniciativas.map(i => i.name === editingItem.data.name ? editingItem.data : i));
                if (editingItem.type === "voluntarios") setVoluntarios(voluntarios.map(v => v.name === editingItem.data.name ? editingItem.data : v));
                if (editingItem.type === "projetos") setProjetos(projetos.map(p => p.title === editingItem.data.title ? editingItem.data : p));
                if (editingItem.type === "eventos") setEventos(eventos.map(e => e.title === editingItem.data.title ? editingItem.data : e));
                if (editingItem.type === "usuarios") setUsuarios(usuarios.map(u => u.email === editingItem.data.email ? editingItem.data : u));
                if (editingItem.type === "parceiros") setParceiros(parceiros.map(p => p.id === editingItem.data.id ? editingItem.data : p));
              }
              setEditingItem(null);
            }}
          >
            <div className="space-y-6">
              {editingItem.type === "iniciativas" && (
                <>
                  <FormField label="Nome da Iniciativa">
                    <Input 
                      defaultValue={editingItem.data.name} 
                      onChange={(e) => {
                        const newData = { ...editingItem.data, name: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Categoria">
                      <Select 
                        defaultValue={editingItem.data.cat}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, cat: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="">Selecione...</option>
                        {projectCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField label="Status">
                      <Select 
                        defaultValue={editingItem.data.status}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, status: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Ativo</option>
                        <option>Pendente</option>
                        <option>Inativo</option>
                      </Select>
                    </FormField>
                  </div>
                  <FormField label="Descrição da Iniciativa">
                    <TextArea placeholder="Descreva o propósito e impacto da iniciativa..." />
                  </FormField>
                  <FormField label="Website / Link">
                    <Input placeholder="https://..." />
                  </FormField>
                </>
              )}

              {editingItem.type === "voluntarios" && (
                <>
                  <FormField label="Nome Completo">
                    <Input 
                      defaultValue={editingItem.data.name}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, name: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <FormField label="Habilidades (separadas por vírgula)">
                    <Input 
                      defaultValue={editingItem.data.skills.join(", ")}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, skills: e.target.value.split(",").map(s => s.trim()) };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Disponibilidade">
                      <Select 
                        defaultValue={editingItem.data.availability}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, availability: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Manhã</option>
                        <option>Tarde</option>
                        <option>Noite</option>
                        <option>Finais de Semana</option>
                      </Select>
                    </FormField>
                    <FormField label="Status">
                      <Select 
                        defaultValue={editingItem.data.status}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, status: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Ativo</option>
                        <option>Pendente</option>
                        <option>Inativo</option>
                      </Select>
                    </FormField>
                  </div>
                  <FormField label="Mini Bio">
                    <TextArea placeholder="Breve resumo do voluntário..." />
                  </FormField>
                </>
              )}

              {editingItem.type === "projetos" && (
                <>
                  <FormField label="Título do Projeto">
                    <Input 
                      defaultValue={editingItem.data.title}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, title: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <FormField label="Iniciativa Responsável">
                    <Select 
                      defaultValue={editingItem.data.initiative}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, initiative: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    >
                      <option value="">Selecione...</option>
                      {iniciativas.map(ini => (
                        <option key={ini.name} value={ini.name}>{ini.name}</option>
                      ))}
                    </Select>
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tipo de Impacto">
                      <Select>
                        <option value="">Selecione...</option>
                        {impactTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField label="Status">
                      <Select 
                        defaultValue={editingItem.data.status}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, status: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Em andamento</option>
                        <option>Concluído</option>
                        <option>Pausado</option>
                      </Select>
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField label="Progresso (%)">
                      <Input 
                        type="number" 
                        defaultValue={editingItem.data.progress} 
                        min="0" 
                        max="100" 
                        onChange={(e) => {
                          const newData = { ...editingItem.data, progress: parseInt(e.target.value) || 0 };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      />
                    </FormField>
                  </div>
                  <FormField label="Imagem de Capa do Projeto">
                    <div className="space-y-4">
                      {/* Image Preview */}
                      <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                        {editingItem.data.image ? (
                          <>
                            <img 
                              src={editingItem.data.image} 
                              alt="Project Cover Preview" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newData = { ...editingItem.data, image: "" };
                                setEditingItem({ ...editingItem, data: newData });
                              }}
                              className="absolute top-3 right-3 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                              title="Remover imagem"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-6 text-white/30">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-xs font-black uppercase tracking-wider">Sem imagem de capa</p>
                            <p className="text-[9px] uppercase tracking-widest mt-1">Carregue um arquivo local ou informe uma URL</p>
                          </div>
                        )}
                      </div>

                      {/* Upload / URL Selector */}
                      <div className="grid grid-cols-1 gap-4">
                        {/* Drag and Drop / File Select styled component */}
                        <div className="relative border border-dashed border-white/20 hover:border-brand-orange/40 rounded-2xl p-6 transition-all bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer text-center group">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64String = reader.result as string;
                                  const newData = { ...editingItem.data, image: base64String };
                                  setEditingItem({ ...editingItem, data: newData });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload className="w-6 h-6 text-white/40 group-hover:text-brand-orange mx-auto mb-2 transition-colors" />
                          <p className="text-xs font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">Enviar Arquivo</p>
                          <p className="text-[8px] uppercase tracking-widest text-white/30 mt-1">Arraste uma imagem ou clique para navegar (PNG, JPG, WEBP)</p>
                        </div>

                        {/* Text input for image URL */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block">Ou insira o Link da Imagem</label>
                          <Input 
                            value={editingItem.data.image || ""}
                            onChange={(e) => {
                              const newData = { ...editingItem.data, image: e.target.value };
                              setEditingItem({ ...editingItem, data: newData });
                            }}
                            placeholder="Ex: https://images.unsplash.com/... ou URL da imagem"
                          />
                        </div>
                      </div>
                    </div>
                  </FormField>
                  <FormField label="Descrição do Projeto">
                    <TextArea placeholder="Detalhes sobre o que está sendo realizado..." />
                  </FormField>
                </>
              )}

              {editingItem.type === "eventos" && (
                <>
                  <FormField label="Título do Evento">
                    <Input 
                      defaultValue={editingItem.data.title}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, title: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Data">
                      <Input 
                        type="text" 
                        defaultValue={editingItem.data.date}
                        placeholder="Ex: 15 Abr"
                        onChange={(e) => {
                          const newData = { ...editingItem.data, date: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      />
                    </FormField>
                    <FormField label="Horário">
                      <Input type="time" />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tipo">
                      <Select 
                        defaultValue={editingItem.data.type}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, type: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Presencial</option>
                        <option>Online</option>
                        <option>Híbrido</option>
                      </Select>
                    </FormField>
                    <FormField label="Local / Link">
                      <Input 
                        defaultValue={editingItem.data.location}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, location: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      />
                    </FormField>
                  </div>
                  <FormField label="Descrição do Evento">
                    <TextArea placeholder="O que acontecerá neste evento?" />
                  </FormField>
                </>
              )}

              {editingItem.type === "usuarios" && (
                <>
                  <FormField label="Nome Completo">
                    <Input 
                      defaultValue={editingItem.data.name}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, name: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: Carlos Oliveira"
                    />
                  </FormField>
                  <FormField label="E-mail">
                    <Input 
                      defaultValue={editingItem.data.email}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, email: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: carlos@animativa.org"
                      disabled={!editingItem.isNew} // Email is the identifier, disable it on edits
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Função / Permissão">
                      <Select 
                        defaultValue={editingItem.data.role}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, role: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Administrador</option>
                        <option>Coordenador</option>
                        <option>Voluntário</option>
                      </Select>
                    </FormField>
                    <FormField label="Status">
                      <Select 
                        defaultValue={editingItem.data.status}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, status: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Ativo</option>
                        <option>Pendente</option>
                        <option>Inativo</option>
                      </Select>
                    </FormField>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-brand-blue" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">Segurança em 2 Etapas</p>
                        <p className="text-[9px] text-white/40">Segundo fator de autenticação habilitado</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newData = { ...editingItem.data, twoFactorEnabled: !editingItem.data.twoFactorEnabled };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${editingItem.data.twoFactorEnabled ? 'bg-brand-orange' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${editingItem.data.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </>
              )}

              {editingItem.type === "parceiros" && (
                <>
                  <FormField label="Nome do Parceiro / Apoiador">
                    <Input 
                      defaultValue={editingItem.data.name}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, name: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: Instituto Ayrton Senna"
                    />
                  </FormField>
                  <FormField label="URL do Logo">
                    <Input 
                      defaultValue={editingItem.data.logo}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, logo: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: https://images.unsplash.com/... ou URL da imagem"
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tipo">
                      <Select 
                        defaultValue={editingItem.data.type}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, type: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Parceiro</option>
                        <option>Apoiador</option>
                        <option>Patrocinador</option>
                      </Select>
                    </FormField>
                    <FormField label="Website / Link">
                      <Input 
                        defaultValue={editingItem.data.site}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, site: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                        placeholder="Ex: https://parceiro.org"
                      />
                    </FormField>
                  </div>
                  {editingItem.data.logo && (
                    <div className="mt-4 p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Pré-visualização do Logo</p>
                      <img 
                        src={editingItem.data.logo} 
                        alt="Logo Preview" 
                        className="h-16 w-auto object-contain max-w-[200px] border border-white/10 p-2 rounded-xl bg-white"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150";
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </EditModal>
        )}
      </AnimatePresence>

      {/* Config Management Modal */}
      <AnimatePresence>
        {managingConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setManagingConfig(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">{managingConfig.label}</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Gerenciar opções disponíveis</p>
                  </div>
                  <button onClick={() => setManagingConfig(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Adicionar novo item..."
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-brand-purple transition-all"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = e.currentTarget.value.trim();
                          if (val && !managingConfig.items.includes(val)) {
                            setManagingConfig({ ...managingConfig, items: [...managingConfig.items, val] });
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <p className="text-[10px] text-white/20 mt-2 px-2">Pressione Enter para adicionar</p>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {managingConfig.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                        <span className="text-sm font-medium">{item}</span>
                        <button
                          onClick={() => setManagingConfig({ ...managingConfig, items: managingConfig.items.filter((_, i) => i !== idx) })}
                          className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setManagingConfig(null)} 
                    className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={onSaveConfig} 
                    className="flex-1 px-6 py-4 bg-brand-purple rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-purple/80 transition-all shadow-lg shadow-brand-purple/20"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
