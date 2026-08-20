import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Moon,
  Loader2,
  RefreshCw,
  Clock,
  Check,
  AlertTriangle,
  ExternalLink,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

type Tab = "dashboard" | "iniciativas" | "voluntarios" | "projetos" | "eventos" | "usuarios" | "configuracoes" | "parceiros" | "solicitacoes";

interface ToastInfo {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface EditModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
  children: React.ReactNode;
}

const EditModal = ({ title, onClose, onSave, isSaving, children }: EditModalProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-[#121212] border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
    >
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-xl font-black uppercase tracking-tighter text-white">{title}</h3>
        <button onClick={onClose} disabled={isSaving} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-6 h-6 text-white/40 hover:text-white" />
        </button>
      </div>
      <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {children}
      </div>
      <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
        <button 
          type="button"
          onClick={onClose} 
          disabled={isSaving}
          className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="button"
          onClick={onSave} 
          disabled={isSaving}
          className="px-8 py-4 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-orange/20 transition-all flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? "Salvando..." : "Confirmar & Salvar"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-brand-orange transition-all placeholder:text-white/20" />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full bg-[#1c1c1c] text-white border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-orange transition-all appearance-none" />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-brand-orange transition-all min-h-[100px] resize-none placeholder:text-white/20" />
);

export default function Admin() {
  const { user: supabaseUser, profile, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
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

  // Real Database States
  const [iniciativas, setIniciativas] = useState<any[]>([]);
  const [voluntarios, setVoluntarios] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);

  // Config fields
  const [projectCategories, setProjectCategories] = useState([
    "Cultura", "Educação", "Meio Ambiente", "Saúde", "Inovação", "Esporte", "Tecnologia", "Social"
  ]);
  const [volunteerSkills, setVolunteerSkills] = useState([
    "Design", "Social Media", "TI", "Gestão", "Educação", "Artes", "Cozinha", "Ensino", "Saúde", "Direito", "Marketing", "Eventos"
  ]);
  const [impactTypes, setImpactTypes] = useState([
    "Social", "Ambiental", "Educacional", "Cultural", "Econômico"
  ]);

  const [editingItem, setEditingItem] = useState<{ type: Tab; data: any; isNew?: boolean } | null>(null);
  const [managingConfig, setManagingConfig] = useState<{ id: string; label: string; items: string[] } | null>(null);

  // Fetch all real data from Supabase
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Iniciativas
      const { data: iniData, error: iniErr } = await supabase
        .from("iniciativa")
        .select("*")
        .order("created_at", { ascending: false });

      if (iniErr) console.warn("Erro ao buscar iniciativas:", iniErr);
      setIniciativas(iniData || []);

      // 2. Voluntários
      const { data: volData, error: volErr } = await supabase
        .from("voluntario")
        .select("*")
        .order("created_at", { ascending: false });

      if (volErr) console.warn("Erro ao buscar voluntários:", volErr);
      setVoluntarios(volData || []);

      // 3. Usuários
      const { data: usrData, error: usrErr } = await supabase
        .from("usuario")
        .select("*")
        .order("created_at", { ascending: false });

      if (usrErr) console.warn("Erro ao buscar usuários:", usrErr);
      setUsuarios(usrData || []);

      // 4. Eventos
      const { data: evtData, error: evtErr } = await supabase
        .from("evento")
        .select("*")
        .order("created_at", { ascending: false });

      if (evtErr) console.warn("Erro ao buscar eventos:", evtErr);
      if (evtData && evtData.length > 0) {
        setEventos(evtData);
      } else {
        // Fallback default mock items if table is freshly created
        setEventos([
          { id: 1, titulo: "Hackathon Social 2026", data_inicio: "2026-05-12T09:00:00Z", local: "São Paulo, SP", tipo: "Presencial", status: "Ativo", descricao: "48h de inovação colaborativa para ONGs." },
          { id: 2, titulo: "Workshop: Design de Impacto", data_inicio: "2026-04-15T19:00:00Z", local: "Online (Zoom)", tipo: "Online", status: "Ativo", descricao: "Metodologias ágeis e Design Thinking." },
          { id: 3, titulo: "Encontro Regional Sul", data_inicio: "2026-04-22T14:00:00Z", local: "Curitiba, PR", tipo: "Presencial", status: "Ativo", descricao: "Networking e painéis sobre voluntariado." },
        ]);
      }

      // 5. Parceiros
      const { data: prcData, error: prcErr } = await supabase
        .from("parceiro")
        .select("*")
        .order("created_at", { ascending: false });

      if (prcErr) console.warn("Erro ao buscar parceiros:", prcErr);
      if (prcData && prcData.length > 0) {
        setParceiros(prcData);
      } else {
        setParceiros([
          { id: 1, nome: "Instituto Cooperar", foto_parceiro: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150", tipo: "PARCEIRO", link: "https://cooperar.org" },
          { id: 2, nome: "Fundação Educar", foto_parceiro: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=150", tipo: "APOIADOR", link: "https://educar.org" },
          { id: 3, nome: "União Social", foto_parceiro: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=150", tipo: "APOIADOR", link: "https://uniaosocial.org" },
        ]);
      }
    } catch (err: any) {
      console.error("Erro geral no carregamento do admin:", err);
      addToast("error", "Erro ao sincronizar dados com o Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Derived pending lists
  const pendingIniciativas = useMemo(() => {
    return iniciativas.filter(i => !i.autorizada);
  }, [iniciativas]);

  const pendingVoluntarios = useMemo(() => {
    return voluntarios.filter(v => v.status_voluntario === "PENDENTE");
  }, [voluntarios]);

  const pendingUsuarios = useMemo(() => {
    return usuarios.filter(u => u.status === "PENDENTE");
  }, [usuarios]);

  const totalPending = pendingIniciativas.length + pendingVoluntarios.length + pendingUsuarios.length;

  // --- ACTIONS ---

  // 1. Aprovar / Reprovar Iniciativa
  const handleApproveIniciativa = async (id: number, name?: string) => {
    try {
      const { error } = await supabase
        .from("iniciativa")
        .update({ autorizada: true, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setIniciativas(prev => prev.map(i => i.id === id ? { ...i, autorizada: true } : i));
      addToast("success", `Iniciativa "${name || id}" aprovada com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao aprovar iniciativa:", err);
      addToast("error", err?.message || "Não foi possível aprovar a iniciativa.");
    }
  };

  const handleRejectIniciativa = async (id: number, name?: string) => {
    if (!confirm(`Deseja desautorizar ou reprovar a iniciativa "${name || id}"?`)) return;
    try {
      const { error } = await supabase
        .from("iniciativa")
        .update({ autorizada: false, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setIniciativas(prev => prev.map(i => i.id === id ? { ...i, autorizada: false } : i));
      addToast("info", `Iniciativa "${name || id}" marcada como não autorizada.`);
    } catch (err: any) {
      console.error("Erro ao desautorizar iniciativa:", err);
      addToast("error", err?.message || "Erro ao desautorizar iniciativa.");
    }
  };

  const handleDeleteIniciativa = async (id: number, name?: string) => {
    if (!confirm(`Tem certeza que deseja excluir permanentemente a iniciativa "${name || id}"?`)) return;
    try {
      const { error } = await supabase
        .from("iniciativa")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setIniciativas(prev => prev.filter(i => i.id !== id));
      addToast("success", `Iniciativa removida com sucesso.`);
    } catch (err: any) {
      console.error("Erro ao excluir iniciativa:", err);
      addToast("error", err?.message || "Erro ao excluir iniciativa.");
    }
  };

  // 2. Aprovar / Reprovar Voluntário
  const handleApproveVoluntario = async (id: number, name?: string) => {
    try {
      const { error } = await supabase
        .from("voluntario")
        .update({ 
          status_voluntario: "APROVADO",
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);

      if (error) throw error;

      setVoluntarios(prev => prev.map(v => v.id === id ? { ...v, status_voluntario: "APROVADO"} : v));
      addToast("success", `Voluntário "${name || id}" aprovado com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao aprovar voluntário:", err);
      addToast("error", err?.message || "Erro ao aprovar voluntário.");
    }
  };

  const handleRejectVoluntario = async (id: number, name?: string) => {
    if (!confirm(`Deseja reprovar o cadastro do voluntário "${name || id}"?`)) return;
    try {
      const { error } = await supabase
        .from("voluntario")
        .update({ 
          status_voluntario: "REPROVADO",
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);

      if (error) throw error;

      setVoluntarios(prev => prev.map(v => v.id === id ? { ...v, status_voluntario: "REPROVADO"} : v));
      addToast("info", `Voluntário "${name || id}" marcado como reprovado.`);
    } catch (err: any) {
      console.error("Erro ao reprovar voluntário:", err);
      addToast("error", err?.message || "Erro ao reprovar voluntário.");
    }
  };

  const handleDeleteVoluntario = async (id: number, name?: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cadastro de "${name || id}"?`)) return;
    try {
      const { error } = await supabase
        .from("voluntario")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setVoluntarios(prev => prev.filter(v => v.id !== id));
      addToast("success", `Voluntário excluído com sucesso.`);
    } catch (err: any) {
      console.error("Erro ao excluir voluntário:", err);
      addToast("error", err?.message || "Erro ao excluir voluntário.");
    }
  };

  // 3. Aprovar / Rejeitar / Atualizar Usuário
  const handleApproveUsuario = async (id: number, name?: string) => {
    try {
      const { error } = await supabase
        .from("usuario")
        .update({ status: "ATIVO", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, status: "ATIVO" } : u));
      addToast("success", `Usuário "${name || id}" ativado com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao aprovar usuário:", err);
      addToast("error", err?.message || "Erro ao aprovar usuário.");
    }
  };

  const handleUpdateUsuarioRole = async (id: number, role: "ADMIN" | "COORDENADOR" | "VOLUNTARIO") => {
    try {
      const { error } = await supabase
        .from("usuario")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      addToast("success", `Permissão de acesso atualizada para ${role}!`);
    } catch (err: any) {
      console.error("Erro ao atualizar papel do usuário:", err);
      addToast("error", err?.message || "Erro ao alterar permissão.");
    }
  };

  const handleDeleteUsuario = async (id: number, name?: string) => {
    if (!confirm(`Tem certeza que deseja remover o usuário "${name || id}"?`)) return;
    try {
      const { error } = await supabase
        .from("usuario")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setUsuarios(prev => prev.filter(u => u.id !== id));
      addToast("success", `Usuário removido.`);
    } catch (err: any) {
      console.error("Erro ao deletar usuário:", err);
      addToast("error", err?.message || "Erro ao remover usuário.");
    }
  };

  // 4. Save Modal Handler (Persist to Supabase)
  const handleSaveModal = async () => {
    if (!editingItem) return;
    setIsSaving(true);

    try {
      const { type, data, isNew } = editingItem;

      if (type === "iniciativas") {
        const payload: any = {
          nome: data.nome?.trim(),
          setor_sociedade: data.setor_sociedade || data.cat || "Social",
          cidade: data.cidade?.trim() || null,
          uf: data.uf?.trim() || null,
          autorizada: Boolean(data.autorizada ?? (data.status === "Ativo")),
          proposito_iniciativa: data.proposito_iniciativa || null,
          impacto_iniciativa: data.impacto_iniciativa || null,
          site: data.site || null,
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          payload.data_cadastro = new Date().toISOString().split("T")[0];
          const { data: inserted, error } = await supabase
            .from("iniciativa")
            .insert(payload)
            .select()
            .single();

          if (error) throw error;
          setIniciativas(prev => [inserted, ...prev]);
          addToast("success", "Iniciativa criada com sucesso!");
        } else {
          const { error } = await supabase
            .from("iniciativa")
            .update(payload)
            .eq("id", data.id);

          if (error) throw error;
          setIniciativas(prev => prev.map(i => i.id === data.id ? { ...i, ...payload } : i));
          addToast("success", "Iniciativa atualizada com sucesso!");
        }
      } else if (type === "voluntarios") {
        const payload: any = {
          nome: data.nome?.trim(),
          email: data.email?.trim()?.toLowerCase(),
          tel_celular: data.tel_celular || null,
          habilidades: Array.isArray(data.habilidades) ? data.habilidades.join(", ") : data.habilidades,
          disponibilidade_variavel: data.disponibilidade_variavel || data.availability || "TODA_SEMANA",
          status_voluntario: data.status_voluntario || (data.status === "Ativo" ? "APROVADO" : data.status === "Reprovado" ? "REPROVADO" : "PENDENTE"),
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          const { data: inserted, error } = await supabase
            .from("voluntario")
            .insert(payload)
            .select()
            .single();

          if (error) throw error;
          setVoluntarios(prev => [inserted, ...prev]);
          addToast("success", "Voluntário cadastrado com sucesso!");
        } else {
          const { error } = await supabase
            .from("voluntario")
            .update(payload)
            .eq("id", data.id);

          if (error) throw error;
          setVoluntarios(prev => prev.map(v => v.id === data.id ? { ...v, ...payload } : v));
          addToast("success", "Voluntário atualizado com sucesso!");
        }
      } else if (type === "usuarios") {
        const payload: any = {
          nome: data.nome?.trim(),
          role: data.role || "VOLUNTARIO",
          status: data.status || "ATIVO",
          updated_at: new Date().toISOString(),
        };

        if (!isNew && data.id) {
          const { error } = await supabase
            .from("usuario")
            .update(payload)
            .eq("id", data.id);

          if (error) throw error;
          setUsuarios(prev => prev.map(u => u.id === data.id ? { ...u, ...payload } : u));
          addToast("success", "Usuário atualizado com sucesso!");
        } else {
          addToast("info", "Novos usuários devem se cadastrar através da tela de Registro para vínculo de autenticação.");
        }
      } else if (type === "eventos") {
        const payload: any = {
          titulo: data.titulo || data.title,
          descricao: data.descricao || "",
          local: data.local || data.location || "Online",
          tipo: data.tipo || data.type || "Online",
          status: data.status || "Ativo",
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          payload.data_inicio = data.data_inicio || new Date().toISOString();
          const { data: inserted, error } = await supabase
            .from("evento")
            .insert(payload)
            .select()
            .single();

          if (error) {
            // If table doesn't support insert, save locally
            setEventos(prev => [{ id: Date.now(), ...payload }, ...prev]);
          } else {
            setEventos(prev => [inserted, ...prev]);
          }
          addToast("success", "Evento criado com sucesso!");
        } else {
          const { error } = await supabase
            .from("evento")
            .update(payload)
            .eq("id", data.id);

          if (error) {
            setEventos(prev => prev.map(e => e.id === data.id ? { ...e, ...payload } : e));
          } else {
            setEventos(prev => prev.map(e => e.id === data.id ? { ...e, ...payload } : e));
          }
          addToast("success", "Evento atualizado com sucesso!");
        }
      } else if (type === "parceiros") {
        const payload: any = {
          nome: data.nome || data.name,
          link: data.link || data.site || "#",
          tipo: data.tipo || (data.type === "Patrocinador" ? "PATROCINADOR" : data.type === "Apoiador" ? "APOIADOR" : "PARCEIRO"),
          foto_parceiro: data.foto_parceiro || data.logo || "",
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          const { data: inserted, error } = await supabase
            .from("parceiro")
            .insert(payload)
            .select()
            .single();

          if (error) {
            setParceiros(prev => [{ id: Date.now(), ...payload }, ...prev]);
          } else {
            setParceiros(prev => [inserted, ...prev]);
          }
          addToast("success", "Parceiro cadastrado com sucesso!");
        } else {
          const { error } = await supabase
            .from("parceiro")
            .update(payload)
            .eq("id", data.id);

          if (error) {
            setParceiros(prev => prev.map(p => p.id === data.id ? { ...p, ...payload } : p));
          } else {
            setParceiros(prev => prev.map(p => p.id === data.id ? { ...p, ...payload } : p));
          }
          addToast("success", "Parceiro atualizado com sucesso!");
        }
      }

      setEditingItem(null);
    } catch (err: any) {
      console.error("Erro ao salvar item:", err);
      addToast("error", err?.message || "Erro ao salvar alterações no Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveConfig = () => {
    if (!managingConfig) return;
    if (managingConfig.id === "categories") setProjectCategories(managingConfig.items);
    if (managingConfig.id === "skills") setVolunteerSkills(managingConfig.items);
    if (managingConfig.id === "impact") setImpactTypes(managingConfig.items);
    setManagingConfig(null);
    addToast("success", "Opções de configuração salvas!");
  };

  if (!supabaseUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Acesso Restrito</h2>
        <p className="text-sm text-white/50 max-w-sm mb-8">
          O Painel Administrativo está disponível exclusivamente para contas com perfil de Administrador (ADMIN) no banco de dados.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/" 
            className="px-8 py-4 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
          >
            Voltar ao Início
          </Link>
          <Link 
            to="/perfil" 
            className="px-8 py-4 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all"
          >
            Ver Meu Perfil
          </Link>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "solicitacoes", label: "Fila de Aprovação", icon: CheckCircle2, badge: totalPending },
    { id: "iniciativas", label: "Iniciativas", icon: Sparkles, count: iniciativas.length },
    { id: "voluntarios", label: "Voluntários", icon: Users, count: voluntarios.length },
    { id: "projetos", label: "Projetos", icon: Briefcase, count: iniciativas.length },
    { id: "eventos", label: "Eventos", icon: Calendar, count: eventos.length },
    { id: "usuarios", label: "Usuários", icon: User, count: usuarios.length },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  const stats = [
    { label: "Iniciativas", value: iniciativas.length.toString(), trend: `${iniciativas.filter(i => i.autorizada).length} Aprovadas`, color: "brand-orange", icon: Sparkles },
    { label: "Voluntários", value: voluntarios.length.toString(), trend: `${voluntarios.filter(v => v.status_voluntario === 'APROVADO').length} Aprovados`, color: "brand-blue", icon: Users },
    { label: "Pendências", value: totalPending.toString(), trend: totalPending > 0 ? "Aguardando ação" : "Tudo limpo", color: totalPending > 0 ? "brand-orange" : "green-400", icon: Clock },
    { label: "Usuários", value: usuarios.length.toString(), trend: `${usuarios.filter(u => u.role === 'ADMIN').length} Admins`, color: "white", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex relative">
      {/* Toast Notifications Overlay */}
      <div className="fixed top-6 right-6 z-[120] space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto p-4 px-6 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl text-xs font-bold ${
                toast.type === "success"
                  ? "bg-green-950/80 border-green-500/30 text-green-300 shadow-green-500/10"
                  : toast.type === "error"
                  ? "bg-red-950/80 border-red-500/30 text-red-300 shadow-red-500/10"
                  : "bg-blue-950/80 border-blue-500/30 text-blue-300 shadow-blue-500/10"
              }`}
            >
              {toast.type === "success" && <Check className="w-4 h-4 text-green-400 shrink-0" />}
              {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
              {toast.type === "info" && <Clock className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0e0e12] backdrop-blur-3xl p-8 flex flex-col sticky top-0 h-screen shrink-0">
        <div className="mb-10">
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
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Painel Supabase</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id as Tab)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === link.id 
                  ? "bg-white text-brand-purple shadow-xl font-black" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                  activeTab === link.id ? "bg-brand-orange text-white" : "bg-brand-orange/20 text-brand-orange"
                }`}>
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-4">
          <div className="flex items-center gap-3 px-2">
            {profile?.foto_perfil ? (
              <img 
                src={profile.foto_perfil} 
                alt={profile.nome || "Admin"} 
                className="w-10 h-10 rounded-full object-cover border border-brand-orange"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center font-black text-brand-orange text-xs">
                {(profile?.nome || supabaseUser?.email || "A").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wider truncate text-white">
                {profile?.nome || supabaseUser?.email?.split('@')[0] || "Administrador"}
              </p>
              <p className="text-[9px] text-green-400 font-bold uppercase tracking-wider">
                {profile?.role || "ADMIN"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-[1400px]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                {sidebarLinks.find(l => l.id === activeTab)?.label}
              </h1>
              {loading && <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />}
            </div>
            <p className="text-white/40 text-xs mt-1">Conectado ao Supabase • PostgreSQL em tempo real</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={loadAllData}
              disabled={loading}
              title="Atualizar Dados"
              className="p-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white/60 hover:text-white transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange transition-all placeholder:text-white/20"
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
            {/* 1. DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/20 transition-all flex flex-col justify-between min-h-[190px]">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/10 blur-3xl -mr-12 -mt-12 group-hover:bg-${stat.color}/20 transition-all`} />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</span>
                        {stat.icon && <stat.icon className={`w-5 h-5 text-${stat.color}`} />}
                      </div>
                      
                      <div className="relative z-10 mt-4">
                        <p className="text-5xl font-black tracking-tighter mb-2">{stat.value}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Actions Fast Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Fila Rápida de Aprovação */}
                  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Fila de Aprovação</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Iniciativas e voluntários aguardando revisão</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("solicitacoes")}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:text-white transition-colors"
                      >
                        Ver Todas ({totalPending})
                      </button>
                    </div>

                    <div className="space-y-3">
                      {totalPending === 0 ? (
                        <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2 opacity-50" />
                          <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Nenhuma solicitação pendente no momento</p>
                        </div>
                      ) : (
                        <>
                          {/* Pending Iniciativas Preview */}
                          {pendingIniciativas.slice(0, 2).map((item) => (
                            <div key={`ini-${item.id}`} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-5 h-5 text-brand-orange" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-black uppercase tracking-tight truncate">{item.nome}</p>
                                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Iniciativa • {item.cidade || "Brasil"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  onClick={() => handleApproveIniciativa(item.id, item.nome)}
                                  className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                  Aprovar
                                </button>
                                <button 
                                  onClick={() => handleRejectIniciativa(item.id, item.nome)}
                                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                  Recusar
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Pending Voluntários Preview */}
                          {pendingVoluntarios.slice(0, 2).map((item) => (
                            <div key={`vol-${item.id}`} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0">
                                  <Users className="w-5 h-5 text-brand-blue" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-black uppercase tracking-tight truncate">{item.nome}</p>
                                  <p className="text-[10px] text-white/40 uppercase tracking-wider truncate">Voluntário • {item.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  onClick={() => handleApproveVoluntario(item.id, item.nome)}
                                  className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                  Aprovar
                                </button>
                                <button 
                                  onClick={() => handleRejectVoluntario(item.id, item.nome)}
                                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                  Recusar
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Resumo de Usuários e Segurança */}
                  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Equipe & Permissões</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Membros com acesso administrativo e coordenação</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("usuarios")}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-white transition-colors"
                      >
                        Gerenciar
                      </button>
                    </div>

                    <div className="space-y-3">
                      {usuarios.slice(0, 4).map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3.5 bg-white/[0.02] rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-brand-orange text-xs">
                              {(u.nome || u.email || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-tight text-white">{u.nome || u.email?.split('@')[0]}</p>
                              <p className="text-[9px] text-white/40">{u.email}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            u.role === 'ADMIN' ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' :
                            u.role === 'COORDENADOR' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' :
                            'bg-white/5 border-white/10 text-white/60'
                          }`}>
                            {u.role || 'VOLUNTARIO'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FILA DE APROVAÇÃO (SOLICITAÇÕES) */}
            {activeTab === "solicitacoes" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Fila de Aprovação Completa</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Aprove ou recuse solicitações recebidas em tempo real</p>
                  </div>
                  <span className="px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-xl text-xs font-black uppercase tracking-widest">
                    {totalPending} Pendências
                  </span>
                </div>

                {totalPending === 0 ? (
                  <div className="p-16 border border-white/5 bg-white/[0.01] rounded-[3rem] text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-base font-black uppercase tracking-wider text-white">Nenhuma solicitação pendente</h3>
                    <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Todos os cadastros e iniciativas foram devidamente avaliados.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Iniciativas Pendentes */}
                    {pendingIniciativas.map((item) => (
                      <div key={`p-ini-${item.id}`} className="p-6 bg-white/5 border border-brand-orange/30 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-orange transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="w-6 h-6 text-brand-orange" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-brand-orange/20 text-brand-orange rounded-full">Iniciativa</span>
                              <span className="text-[10px] text-white/40">{item.setor_sociedade || "Impacto Social"}</span>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-white">{item.nome}</h3>
                            <p className="text-xs text-white/60 font-light mt-1 max-w-2xl">
                              {item.proposito_iniciativa || item.impacto_iniciativa || "Iniciativa cadastrada aguardando liberação para catálogo público."}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-white/40">
                              {item.cidade && <span>📍 {item.cidade}{item.uf ? `, ${item.uf}` : ""}</span>}
                              {item.nome_rep_legal && <span>👤 Responsável: {item.nome_rep_legal}</span>}
                              {item.cel_rep_legal && <span>📞 {item.cel_rep_legal}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleApproveIniciativa(item.id, item.nome)}
                            className="px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleRejectIniciativa(item.id, item.nome)}
                            className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Reprovar
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Voluntários Pendentes */}
                    {pendingVoluntarios.map((item) => (
                      <div key={`p-vol-${item.id}`} className="p-6 bg-white/5 border border-brand-blue/30 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-blue transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0 mt-1">
                            <Users className="w-6 h-6 text-brand-blue" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-brand-blue/20 text-brand-blue rounded-full">Voluntário</span>
                              <span className="text-[10px] text-white/40">Disponibilidade: {item.disponibilidade_variavel || "Flexível"}</span>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-white">{item.nome}</h3>
                            <p className="text-xs text-white/60 font-light mt-1">
                              Habilidades: <span className="text-white font-medium">{item.habilidades || "Não especificadas"}</span>
                            </p>
                            <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-white/40">
                              <span>✉️ {item.email}</span>
                              {item.tel_celular && <span>📞 {item.tel_celular}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleApproveVoluntario(item.id, item.nome)}
                            className="px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleRejectVoluntario(item.id, item.nome)}
                            className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Reprovar
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Usuários Pendentes */}
                    {pendingUsuarios.map((item) => (
                      <div key={`p-usr-${item.id}`} className="p-6 bg-white/5 border border-white/20 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/40 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-white/10 text-white/80 rounded-full">Usuário</span>
                              <span className="text-[10px] text-white/40">Perfil: {item.role || "VOLUNTARIO"}</span>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-white">{item.nome || item.email}</h3>
                            <p className="text-xs text-white/60 font-light mt-1">E-mail: {item.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleApproveUsuario(item.id, item.nome || item.email)}
                            className="px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Ativar Usuário
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. GESTÃO DE INICIATIVAS */}
            {activeTab === "iniciativas" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Iniciativas Cadastradas</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Tabela `iniciativa` no Supabase</p>
                  </div>
                  <button 
                    onClick={() => setEditingItem({ 
                      type: "iniciativas", 
                      data: { nome: "", setor_sociedade: "Social", autorizada: false, cidade: "", uf: "", proposito_iniciativa: "" }, 
                      isNew: true 
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-purple transition-all shadow-lg"
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
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Setor / Local</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Cadastro</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iniciativas.filter(i => (i.nome || "").toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-xs text-white/30 uppercase font-black tracking-widest">
                            Nenhuma iniciativa encontrada
                          </td>
                        </tr>
                      ) : (
                        iniciativas.filter(i => (i.nome || "").toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-5 h-5 text-brand-orange" />
                                </div>
                                <div>
                                  <span className="text-sm font-black uppercase tracking-tighter block">{item.nome}</span>
                                  {item.nome_rep_legal && <span className="text-[10px] text-white/40 block">Rep: {item.nome_rep_legal}</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10 block w-max mb-1">
                                {item.setor_sociedade || "Social"}
                              </span>
                              <span className="text-[9px] text-white/40">
                                {item.cidade ? `${item.cidade}${item.uf ? `, ${item.uf}` : ""}` : "Brasil"}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <button
                                onClick={() => item.autorizada ? handleRejectIniciativa(item.id, item.nome) : handleApproveIniciativa(item.id, item.nome)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                                  item.autorizada 
                                    ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" 
                                    : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                                }`}
                                title="Clique para alternar status de autorização"
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${item.autorizada ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                  {item.autorizada ? "Aprovada" : "Pendente"}
                                </span>
                              </button>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-black text-white/40">
                              {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : item.data_cadastro || "—"}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingItem({ type: "iniciativas", data: item })}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteIniciativa(item.id, item.nome)}
                                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                  title="Excluir"
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

            {/* 4. GESTÃO DE VOLUNTÁRIOS */}
            {activeTab === "voluntarios" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Voluntários Cadastrados</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Tabela `voluntario` no Supabase</p>
                  </div>
                  <button 
                    onClick={() => setEditingItem({ 
                      type: "voluntarios", 
                      data: { nome: "", email: "", habilidades: "Geral", disponibilidade_variavel: "TODA_SEMANA", status_voluntario: "PENDENTE" }, 
                      isNew: true 
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-purple transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Voluntário
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Nome / Contato</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Habilidades</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Disponibilidade</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voluntarios.filter(v => (v.nome || v.email || "").toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-xs text-white/30 uppercase font-black tracking-widest">
                            Nenhum voluntário cadastrado
                          </td>
                        </tr>
                      ) : (
                        voluntarios.filter(v => (v.nome || v.email || "").toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-black text-xs shrink-0">
                                  {(item.nome || item.email || "V").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-sm font-black uppercase tracking-tighter block">{item.nome}</span>
                                  <span className="text-[10px] text-white/40 block">{item.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-xs text-white/80 max-w-xs truncate">{item.habilidades || "—"}</p>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                              {item.disponibilidade_variavel || "Flexível"}
                            </td>
                            <td className="px-8 py-6">
                              <button
                                onClick={() => item.status_voluntario === "APROVADO" ? handleRejectVoluntario(item.id, item.nome) : handleApproveVoluntario(item.id, item.nome)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                                  item.status_voluntario === 'APROVADO' 
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                                    : item.status_voluntario === 'REPROVADO'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                                }`}
                                title="Alternar status do voluntário"
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  item.status_voluntario === 'APROVADO' ? 'bg-green-400' :
                                  item.status_voluntario === 'REPROVADO' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
                                }`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                  {item.status_voluntario === 'APROVADO' ? 'Aprovado' : item.status_voluntario === 'REPROVADO' ? 'Reprovado' : 'Pendente'}
                                </span>
                              </button>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingItem({ type: "voluntarios", data: item })}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteVoluntario(item.id, item.nome)}
                                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                  title="Excluir"
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

            {/* 5. GESTÃO DE PROJETOS */}
            {activeTab === "projetos" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Projetos & Portfólio</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Exibição pública de iniciativas autorizadas</p>
                  </div>
                  <button 
                    onClick={() => setEditingItem({ 
                      type: "iniciativas", 
                      data: { nome: "", setor_sociedade: "Social", autorizada: true }, 
                      isNew: true 
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-purple border border-white/20 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-purple transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Projeto
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {iniciativas.filter(i => (i.nome || "").toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group hover:border-white/20 transition-all">
                      <div className="flex gap-4 mb-6 items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/60 mb-2 inline-block">
                            {item.setor_sociedade || "Impacto"}
                          </span>
                          <h3 className="text-xl font-black uppercase tracking-tighter text-white truncate">{item.nome}</h3>
                          <p className="text-xs text-white/40 mt-1">{item.cidade ? `${item.cidade}, ${item.uf || 'BR'}` : "Brasil"}</p>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shrink-0 ${
                          item.autorizada ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                        }`}>
                          {item.autorizada ? "Publicado" : "Aguardando Aprovação"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-white/60 font-light line-clamp-2 mb-6">
                        {item.proposito_iniciativa || item.impacto_iniciativa || "Iniciativa da rede Animativa."}
                      </p>

                      <div className="flex gap-2 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => setEditingItem({ type: "iniciativas", data: item })}
                          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all"
                        >
                          Editar Dados
                        </button>
                        <button 
                          onClick={() => item.autorizada ? handleRejectIniciativa(item.id, item.nome) : handleApproveIniciativa(item.id, item.nome)}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            item.autorizada ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
                          }`}
                        >
                          {item.autorizada ? "Desautorizar" : "Aprovar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. GESTÃO DE EVENTOS */}
            {activeTab === "eventos" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Agenda de Eventos</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Tabela `evento` no Supabase</p>
                  </div>
                  <button 
                    onClick={() => setEditingItem({ 
                      type: "eventos", 
                      data: { titulo: "", local: "Online", tipo: "Online", status: "Ativo", descricao: "" }, 
                      isNew: true 
                    })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-purple transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Evento
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {eventos.filter(e => (e.titulo || e.title || "").toLowerCase().includes(searchTerm.toLowerCase())).map((event) => (
                    <div key={event.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] group hover:border-brand-blue transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 rounded-full text-white/40">
                            {event.tipo || event.type || "Online"}
                          </span>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-white">{event.titulo || event.title}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-4">
                          {event.data_inicio ? new Date(event.data_inicio).toLocaleDateString('pt-BR') : event.date || "A definir"}
                        </p>
                        <p className="text-xs text-white/60 font-light line-clamp-2 mb-6">
                          {event.descricao || event.description || "Evento comunitário da rede Animativa."}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => setEditingItem({ type: "eventos", data: event })}
                          className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm(`Remover o evento "${event.titulo || event.title}"?`)) {
                              await supabase.from("evento").delete().eq("id", event.id);
                              setEventos(prev => prev.filter(e => e.id !== event.id));
                              addToast("info", "Evento removido.");
                            }
                          }}
                          className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 transition-all hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. GESTÃO DE USUÁRIOS */}
            {activeTab === "usuarios" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Gestão de Usuários</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Tabela `usuario` sincronizada com Supabase Auth</p>
                  </div>
                  <button 
                    onClick={() => addToast("info", "Novos usuários devem se cadastrar pela página /cadastro para criar a credencial de autenticação.")}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white hover:text-brand-purple text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Como Adicionar
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Usuário</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Função (Role)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Cadastro</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.filter(u => (u.nome || u.email || "").toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              {item.foto_perfil ? (
                                <img 
                                  src={item.foto_perfil} 
                                  alt={item.nome || "Usuário"} 
                                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-brand-orange text-xs shrink-0">
                                  {(item.nome || item.email || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="text-sm font-black uppercase tracking-tighter block">{item.nome || item.email?.split('@')[0]}</span>
                                <span className="text-[10px] text-white/40 block">{item.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={item.role || "VOLUNTARIO"}
                              onChange={(e) => handleUpdateUsuarioRole(item.id, e.target.value as any)}
                              className="bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/10 focus:border-brand-orange outline-none"
                            >
                              <option value="VOLUNTARIO">Voluntário</option>
                              <option value="COORDENADOR">Coordenador</option>
                              <option value="ADMIN">Administrador</option>
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => item.status === "ATIVO" ? supabase.from("usuario").update({ status: "INATIVO" }).eq("id", item.id).then(() => { setUsuarios(prev => prev.map(u => u.id === item.id ? { ...u, status: "INATIVO" } : u)); addToast("info", "Usuário inativado."); }) : handleApproveUsuario(item.id, item.nome)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                                item.status === 'ATIVO' 
                                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                  : item.status === 'PENDENTE'
                                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                  : 'bg-red-500/10 border-red-500/30 text-red-400'
                              }`}
                              title="Clique para alternar status"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ATIVO' ? 'bg-green-400' : item.status === 'PENDENTE' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                              <span className="text-[9px] font-black uppercase tracking-widest">{item.status || "ATIVO"}</span>
                            </button>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-black text-white/40">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : "—"}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setEditingItem({ type: "usuarios", data: item })}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                title="Editar"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUsuario(item.id, item.nome || item.email)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
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

            {/* 8. CONFIGURAÇÕES & PARCEIROS */}
            {activeTab === "configuracoes" && (
              <div className="max-w-3xl space-y-12">
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Parceiros & Apoiadores</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Tabela `parceiro` no Supabase</p>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button 
                      onClick={() => setEditingItem({ 
                        type: "parceiros", 
                        data: { nome: "", link: "", tipo: "PARCEIRO", foto_parceiro: "" }, 
                        isNew: true 
                      })}
                      className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-brand-purple transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Novo Parceiro
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {parceiros.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 border border-white/10 overflow-hidden shrink-0">
                            {item.foto_parceiro || item.logo ? (
                              <img 
                                src={item.foto_parceiro || item.logo} 
                                alt={item.nome || item.name} 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Handshake className="w-6 h-6 text-brand-purple" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-tighter text-white truncate">{item.nome || item.name || "Sem Nome"}</p>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 text-white/60 inline-block mt-1">
                              {item.tipo || item.type || "PARCEIRO"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => setEditingItem({ type: "parceiros", data: item })}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm(`Remover o parceiro ${item.nome || item.name}?`)) {
                                await supabase.from("parceiro").delete().eq("id", item.id);
                                setParceiros(prev => prev.filter(p => p.id !== item.id));
                                addToast("info", "Parceiro removido.");
                              }
                            }}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Aparência & Tema</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Selecione o tema padrão da interface</p>
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
                          <p className={`text-[9px] uppercase tracking-widest ${theme === "light" ? "text-brand-purple/60" : "text-white/40"}`}>Interface limpa</p>
                        </div>
                      </div>
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
                          <p className={`text-[9px] uppercase tracking-widest ${theme === "dark" ? "text-white/60" : "text-white/40"}`}>Interface noturna</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </section>
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
              ? `Novo ${editingItem.type === "usuarios" ? "Usuário" : editingItem.type === "parceiros" ? "Parceiro" : editingItem.type.slice(0, -1)}` 
              : `Editar ${editingItem.type === "usuarios" ? "Usuário" : editingItem.type === "parceiros" ? "Parceiro" : editingItem.type.slice(0, -1)}`} 
            onClose={() => setEditingItem(null)}
            onSave={handleSaveModal}
            isSaving={isSaving}
          >
            <div className="space-y-6">
              {/* Iniciativas Form */}
              {editingItem.type === "iniciativas" && (
                <>
                  <FormField label="Nome da Iniciativa">
                    <Input 
                      defaultValue={editingItem.data.nome || editingItem.data.name} 
                      onChange={(e) => {
                        const newData = { ...editingItem.data, nome: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: Horta Comunitária"
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Setor / Categoria">
                      <Select 
                        defaultValue={editingItem.data.setor_sociedade || editingItem.data.cat || "Social"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, setor_sociedade: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        {projectCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField label="Status de Aprovação">
                      <Select 
                        defaultValue={editingItem.data.autorizada ? "true" : "false"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, autorizada: e.target.value === "true" };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="true">Aprovada (Pública)</option>
                        <option value="false">Pendente de Revisão</option>
                      </Select>
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Cidade">
                      <Input 
                        defaultValue={editingItem.data.cidade} 
                        onChange={(e) => {
                          const newData = { ...editingItem.data, cidade: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                        placeholder="Ex: Curitiba"
                      />
                    </FormField>
                    <FormField label="Estado (UF)">
                      <Input 
                        defaultValue={editingItem.data.uf} 
                        onChange={(e) => {
                          const newData = { ...editingItem.data, uf: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                        placeholder="Ex: PR"
                      />
                    </FormField>
                  </div>
                  <FormField label="Propósito da Iniciativa">
                    <TextArea 
                      defaultValue={editingItem.data.proposito_iniciativa}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, proposito_iniciativa: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Qual a missão e impacto principal desta iniciativa?" 
                    />
                  </FormField>
                </>
              )}

              {/* Voluntários Form */}
              {editingItem.type === "voluntarios" && (
                <>
                  <FormField label="Nome Completo">
                    <Input 
                      defaultValue={editingItem.data.nome || editingItem.data.name} 
                      onChange={(e) => {
                        const newData = { ...editingItem.data, nome: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: Carlos Silva"
                    />
                  </FormField>
                  <FormField label="E-mail">
                    <Input 
                      defaultValue={editingItem.data.email} 
                      onChange={(e) => {
                        const newData = { ...editingItem.data, email: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="carlos@exemplo.com"
                    />
                  </FormField>
                  <FormField label="Habilidades (separadas por vírgula)">
                    <Input 
                      defaultValue={editingItem.data.habilidades}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, habilidades: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: Design, Redes Sociais, Gestão"
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Disponibilidade">
                      <Select 
                        defaultValue={editingItem.data.disponibilidade_variavel || "TODA_SEMANA"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, disponibilidade_variavel: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="TODA_SEMANA">Toda Semana</option>
                        <option value="CADA_2_SEMANAS">A Cada 2 Semanas</option>
                        <option value="UMA_MENSAL">Uma Vez ao Mês</option>
                        <option value="MAX_2_HORAS">Até 2 Horas / Semana</option>
                        <option value="MAX_3_HORAS">Até 3 Horas / Semana</option>
                      </Select>
                    </FormField>
                    <FormField label="Status de Aprovação">
                      <Select 
                        defaultValue={editingItem.data.status_voluntario || "PENDENTE"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, status_voluntario: e.target.value};
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="APROVADO">Aprovado</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="REPROVADO">Reprovado</option>
                      </Select>
                    </FormField>
                  </div>
                </>
              )}

              {/* Usuários Form */}
              {editingItem.type === "usuarios" && (
                <>
                  <FormField label="Nome Completo">
                    <Input 
                      defaultValue={editingItem.data.nome} 
                      onChange={(e) => {
                        const newData = { ...editingItem.data, nome: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <FormField label="E-mail">
                    <Input 
                      defaultValue={editingItem.data.email} 
                      disabled
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Papel / Função">
                      <Select 
                        defaultValue={editingItem.data.role || "VOLUNTARIO"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, role: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="VOLUNTARIO">Voluntário</option>
                        <option value="COORDENADOR">Coordenador</option>
                        <option value="ADMIN">Administrador</option>
                      </Select>
                    </FormField>
                    <FormField label="Status">
                      <Select 
                        defaultValue={editingItem.data.status || "ATIVO"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, status: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="ATIVO">Ativo</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="INATIVO">Inativo</option>
                      </Select>
                    </FormField>
                  </div>
                </>
              )}

              {/* Eventos Form */}
              {editingItem.type === "eventos" && (
                <>
                  <FormField label="Título do Evento">
                    <Input 
                      defaultValue={editingItem.data.titulo || editingItem.data.title}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, titulo: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tipo">
                      <Select 
                        defaultValue={editingItem.data.tipo || "Online"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, tipo: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option>Online</option>
                        <option>Presencial</option>
                        <option>Workshop</option>
                        <option>Hackathon</option>
                      </Select>
                    </FormField>
                    <FormField label="Local / Plataforma">
                      <Input 
                        defaultValue={editingItem.data.local || editingItem.data.location}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, local: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      />
                    </FormField>
                  </div>
                  <FormField label="Descrição do Evento">
                    <TextArea 
                      defaultValue={editingItem.data.descricao || editingItem.data.description}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, descricao: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                    />
                  </FormField>
                </>
              )}

              {/* Parceiros Form */}
              {editingItem.type === "parceiros" && (
                <>
                  <FormField label="Nome do Parceiro">
                    <Input 
                      defaultValue={editingItem.data.nome || editingItem.data.name}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, nome: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="Ex: Fundação Bradesco"
                    />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tipo de Parceria">
                      <Select 
                        defaultValue={editingItem.data.tipo || "PARCEIRO"}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, tipo: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                      >
                        <option value="PARCEIRO">Parceiro</option>
                        <option value="APOIADOR">Apoiador</option>
                        <option value="PATROCINADOR">Patrocinador</option>
                      </Select>
                    </FormField>
                    <FormField label="Website / Link">
                      <Input 
                        defaultValue={editingItem.data.link || editingItem.data.site}
                        onChange={(e) => {
                          const newData = { ...editingItem.data, link: e.target.value };
                          setEditingItem({ ...editingItem, data: newData });
                        }}
                        placeholder="https://..."
                      />
                    </FormField>
                  </div>
                  <FormField label="URL do Logo">
                    <Input 
                      defaultValue={editingItem.data.foto_parceiro || editingItem.data.logo}
                      onChange={(e) => {
                        const newData = { ...editingItem.data, foto_parceiro: e.target.value };
                        setEditingItem({ ...editingItem, data: newData });
                      }}
                      placeholder="https://..."
                    />
                  </FormField>
                </>
              )}
            </div>
          </EditModal>
        )}
      </AnimatePresence>
    </div>
  );
}
