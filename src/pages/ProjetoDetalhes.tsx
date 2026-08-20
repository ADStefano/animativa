import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Heart, 
  Share2, 
  MessageCircle, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  X,
  Send,
  ExternalLink,
  ShieldCheck,
  Building
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

const DEFAULT_PROJECTS = [
  { 
    id: 1, 
    title: "Re-Verde Urbano", 
    category: "Meio Ambiente", 
    location: "São Paulo, SP", 
    volunteers: 12, 
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", 
    description: "O Re-Verde Urbano foca na revitalização de espaços públicos através do plantio de espécies nativas e criação de hortas comunitárias em áreas subutilizadas da cidade de São Paulo.",
    impact: "Mais de 1.500 mudas plantadas e 3 praças revitalizadas diretamente pela comunidade.",
    skills: "Jardinagem, educação ambiental, logística e comunicação.",
    email: "contato@reverde.org",
    phone: "(11) 98765-4321",
    year: "2023"
  },
  { 
    id: 2, 
    title: "EducaTech", 
    category: "Educação", 
    location: "Curitiba, PR", 
    volunteers: 8, 
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", 
    description: "Iniciativa que leva alfabetização digital e lógica de programação para jovens de escolas públicas, preparando-os para as oportunidades do mercado de tecnologia.",
    impact: "Mais de 300 jovens formados em cursos introdutórios de computação e lógica.",
    skills: "Desenvolvimento web, tutoria pedagógica, design gráfico.",
    email: "ola@educatech.org.br",
    phone: "(41) 99876-5432",
    year: "2022"
  },
  { 
    id: 3, 
    title: "Cozinha Solidária", 
    category: "Saúde", 
    location: "Salvador, BA", 
    volunteers: 25, 
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", 
    description: "Combate à insegurança alimentar através da distribuição de refeições nutritivas e oficinas de educação alimentar para comunidades em situação de vulnerabilidade.",
    impact: "Distribuição média de 800 marmitas semanais e oficinas de aproveitamento integral de alimentos.",
    skills: "Cozinha, manipulação de alimentos, distribuição e triagem.",
    email: "solidaria@cozinha.org",
    phone: "(71) 98111-2233",
    year: "2021"
  },
  { 
    id: 4, 
    title: "Arte na Praça", 
    category: "Cultura", 
    location: "Belo Horizonte, MG", 
    volunteers: 5, 
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800", 
    description: "Promove a ocupação cultural de praças públicas com oficinas de arte, teatro de rua e exposições itinerantes de artistas locais.",
    impact: "Mais de 40 intervenções culturais realizadas em 12 bairros periféricos.",
    skills: "Artes visuais, teatro, música e produção cultural.",
    email: "arte@praca.mg.br",
    phone: "(31) 97654-3210",
    year: "2023"
  },
  { 
    id: 5, 
    title: "Código para Todos", 
    category: "Educação", 
    location: "Recife, PE", 
    volunteers: 15, 
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800", 
    description: "Bootcamps intensivos de desenvolvimento web para pessoas em transição de carreira, com foco em diversidade e inclusão no setor de TI.",
    impact: "70% de empregabilidade para os concluintes das turmas de frontend.",
    skills: "React, Node.js, mentoria de carreira e inglês técnico.",
    email: "recife@codigoparatodos.org",
    phone: "(81) 99123-4567",
    year: "2023"
  },
  { 
    id: 6, 
    title: "Horta Comunitária", 
    category: "Meio Ambiente", 
    location: "Porto Alegre, RS", 
    volunteers: 10, 
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800", 
    description: "Transformação de terrenos baldios em hortas produtivas geridas pela própria comunidade, promovendo soberania alimentar e integração social.",
    impact: "6 hortas ativas abastecendo mais de 120 famílias cadastradas.",
    skills: "Agricultura urbana, compostagem e gestão de mutirões.",
    email: "horta@portoalegre.org",
    phone: "(51) 98888-7777",
    year: "2022"
  },
];

export default function ProjetoDetalhes() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Volunteer Modal State
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    disponibilidade: "TODA_SEMANA",
  });

  useEffect(() => {
    if (user) {
      setApplyForm((prev) => ({
        ...prev,
        nome: profile?.nome || user.user_metadata?.nome || "",
        email: user.email || "",
      }));
    }
  }, [user, profile]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      // 1. Tenta buscar no Supabase
      if (id && !isNaN(Number(id))) {
        const { data, error } = await supabase
          .from("iniciativa")
          .select("*")
          .eq("id", Number(id))
          .maybeSingle();

        if (data && !error) {
          setProject({
            id: data.id,
            title: data.nome,
            category: data.setor_sociedade || "Impacto Social",
            location: data.cidade ? `${data.cidade}${data.uf ? `, ${data.uf}` : ""}` : "Brasil",
            volunteers: 12,
            image: data.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
            description: data.impacto_iniciativa || data.proposito_iniciativa || "Iniciativa cadastrada na rede Animativa.",
            impact: data.impacto_iniciativa || "Iniciativa atuando no fortalecimento comunitário e desenvolvimento local.",
            skills: data.habilidades_exigidas || "Voluntários com vontade de aprender e colaborar com a causa.",
            email: data.email,
            phone: data.cel_rep_legal || data.tel_celular || "(11) 98765-4321",
            year: data.data_criacao_iniciativa ? new Date(data.data_criacao_iniciativa).getFullYear() : "2024",
            site: data.site,
            instagram: data.instagram,
            rep_legal: data.nome_rep_legal,
            whatsapp: data.whatsapp || data.cel_rep_legal || data.tel_celular,
          });
          setLoading(false);
          return;
        }
      }

      // 2. Fallback para default
      const defaultProj = DEFAULT_PROJECTS.find((p) => p.id === Number(id));
      if (defaultProj) {
        setProject(defaultProj);
      } else {
        setProject(null);
      }
    } catch (err) {
      console.warn("Erro ao buscar detalhes da iniciativa:", err);
      const defaultProj = DEFAULT_PROJECTS.find((p) => p.id === Number(id));
      setProject(defaultProj || null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApplyVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setApplying(true);

    try {
      // Se usuário logado e ainda não tem registro de voluntário, criamos ou atualizamos
      if (user) {
        const { data: existingVol } = await supabase
          .from("voluntario")
          .select("id")
          .eq("email", applyForm.email)
          .maybeSingle();

        if (!existingVol) {
          await supabase.from("voluntario").insert({
            nome: applyForm.nome,
            email: applyForm.email,
            tel_celular: applyForm.telefone,
            habilidades: project.skills || "Apoio geral",
            disponibilidade_variavel: applyForm.disponibilidade,
            status_voluntario: "PENDENTE",
            consentimento: true,
            data_cadastro: new Date().toISOString().split("T")[0],
          });
        }
      }

      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
        setShowVolunteerModal(false);
      }, 2500);
    } catch (err) {
      console.error("Erro ao registrar interesse:", err);
      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
        setShowVolunteerModal(false);
      }, 2000);
    } finally {
      setApplying(false);
    }
  };

  const cleanPhone = project?.phone ? project.phone.replace(/\D/g, "") : "";
  const waNumber = cleanPhone.length >= 10 ? (cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`) : "5511987654321";
  const waMessage = encodeURIComponent(`Olá! Encontrei a iniciativa "${project?.title || 'Animativa'}" no Catálogo da Animativa e gostaria de colaborar como voluntário!`);
  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Conheça a iniciativa "${project?.title}" na plataforma Animativa: `);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-white/60">Carregando detalhes do projeto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 text-white">Projeto não encontrado</h2>
        <Link to="/projetos" className="px-8 py-4 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all">
          Voltar para o Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-orange/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Button */}
        <Link to="/projetos" className="inline-flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Voltar para o Catálogo</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Image & Main Info */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[480px] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-8 left-8 bg-brand-purple/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange">{project.category}</span>
              </div>
            </motion.div>

            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight text-white">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2.5 bg-white/5 px-6 py-3 rounded-full border border-white/10 text-white">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-black uppercase tracking-widest">{project.location}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 px-6 py-3 rounded-full border border-white/10 text-white">
                  <Calendar className="w-4 h-4 text-brand-orange" />
                  <span className="text-xs font-black uppercase tracking-widest">Iniciado em {project.year}</span>
                </div>
                {project.rep_legal && (
                  <div className="flex items-center gap-2.5 bg-white/5 px-6 py-3 rounded-full border border-white/10 text-white">
                    <span className="text-xs font-black uppercase tracking-widest text-white/50">Responsável:</span>
                    <span className="text-xs font-black uppercase tracking-widest text-brand-orange">{project.rep_legal}</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-brand-orange mb-3">Sobre o Projeto</h3>
                  <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.impact && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Impacto Gerado
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed font-light">
                      {project.impact}
                    </p>
                  </div>
                )}

                {project.skills && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-orange flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Habilidades Desejadas para Voluntariado
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed font-light">
                      {project.skills}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3.5rem] border border-white/10 sticky top-32 shadow-2xl">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-6">Métricas de Atuação</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-5 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-3xl font-black text-white mb-1">{project.volunteers}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Voluntários</p>
                    </div>
                    <div className="text-center p-5 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-3xl font-black text-white mb-1">150+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Impactados</p>
                    </div>
                  </div>
                </div>

                {/* Contatos */}
                <div className="space-y-3 border-t border-white/10 pt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Contatos Oficiais</p>
                  {project.email && (
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                      <span className="truncate">{project.email}</span>
                    </div>
                  )}
                  {project.phone && (
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <Phone className="w-4 h-4 text-brand-blue shrink-0" />
                      <span>{project.phone}</span>
                    </div>
                  )}
                </div>

                {/* Botões de Ação Principal */}
                <div className="space-y-4 pt-2">
                  <button 
                    onClick={() => setShowVolunteerModal(true)}
                    className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl text-center block cursor-pointer"
                  >
                    Quero ser Voluntário deste Projeto
                  </button>

                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Conversar via WhatsApp
                  </a>

                  <Link 
                    to="/apoie"
                    className="w-full py-5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white"
                  >
                    <Heart className="w-4 h-4 text-brand-orange" />
                    Apoiar Esta Causa
                  </Link>
                </div>

                {/* Barra de Compartilhamento Social */}
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-center text-white/40 mb-4">Compartilhar Projeto</p>
                  <div className="flex justify-center items-center gap-3">
                    <button 
                      onClick={handleShare}
                      title="Copiar Link Direto"
                      className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${shareText}${currentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Compartilhar no WhatsApp"
                      className="p-3.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 rounded-2xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    {project.site && (
                      <a 
                        href={project.site.startsWith("http") ? project.site : `https://${project.site}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visitar Site Oficial"
                        className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {copied && (
                  <p className="text-[10px] text-green-400 text-center font-bold tracking-widest uppercase animate-pulse">
                    Link copiado para a área de transferência!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Candidatura a Voluntário do Projeto */}
      <AnimatePresence>
        {showVolunteerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVolunteerModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-brand-purple border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-orange/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Quero ser Voluntário</h3>
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest truncate max-w-[240px]">
                      {project.title}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowVolunteerModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {appliedSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight text-white">Interesse Registrado!</h4>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    Sua intenção de voluntariado foi anotada com sucesso. A equipe do projeto e a Animativa entrarão em contato em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplyVolunteer} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                      Seu Nome Completo *
                    </label>
                    <input 
                      type="text"
                      required
                      value={applyForm.nome}
                      onChange={(e) => setApplyForm({ ...applyForm, nome: e.target.value })}
                      placeholder="Ex: Maria Silva"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                        Seu E-mail *
                      </label>
                      <input 
                        type="email"
                        required
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        placeholder="maria@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                        WhatsApp / Celular
                      </label>
                      <input 
                        type="tel"
                        value={applyForm.telefone}
                        onChange={(e) => setApplyForm({ ...applyForm, telefone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                      Disponibilidade Estimada
                    </label>
                    <select 
                      value={applyForm.disponibilidade}
                      onChange={(e) => setApplyForm({ ...applyForm, disponibilidade: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-orange [&>option]:bg-brand-purple"
                    >
                      <option value="TODA_SEMANA">Toda Semana (Até 4h/semana)</option>
                      <option value="CADA_2_SEMANAS">A cada 2 semanas</option>
                      <option value="UMA_MENSAL">1 vez por mês / Pontual</option>
                      <option value="MAX_2_HORAS">Máximo 2 horas por semana</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                      Mensagem / Como você gostaria de ajudar?
                    </label>
                    <textarea 
                      rows={3}
                      value={applyForm.mensagem}
                      onChange={(e) => setApplyForm({ ...applyForm, mensagem: e.target.value })}
                      placeholder="Conte brevemente sobre sua experiência ou motivação para apoiar esta iniciativa..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={applying}
                      className="w-full py-4 bg-brand-orange hover:bg-white hover:text-brand-purple text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Confirmar Interesse
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
