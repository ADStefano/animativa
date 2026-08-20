import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Lock,
  Clock,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Voluntarios() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(false);
  const [isAlreadyVolunteer, setIsAlreadyVolunteer] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    data_nascimento: "",
    cep: "",
    tel_celular: "",
    habilidades: "",
    exp_profissional: "",
    exp_voluntariado: "",
    interessado: "",
    atividades_interesse: "",
    soube_iniciativa: "",
    disponibilidade_variavel: "TODA_SEMANA" as "UMA_MENSAL" | "TODA_SEMANA" | "CADA_2_SEMANAS" | "MAX_2_HORAS" | "MAX_3_HORAS",
    consentimento: true,
  });

  // Carrega dados iniciais quando logado
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nome: profile?.nome || user.user_metadata?.nome || user.user_metadata?.full_name || prev.nome,
        email: user.email || prev.email,
      }));

      loadExistingVolunteer();
    }
  }, [user, profile]);

  const loadExistingVolunteer = async () => {
    if (!user?.email) return;
    setFetchingExisting(true);
    try {
      const { data, error } = await supabase
        .from("voluntario")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (data && !error) {
        setIsAlreadyVolunteer(true);
        setVolunteerStatus(data.status_voluntario || data.status_aprovacao_voluntario || 'PENDENTE');
        setFormData({
          nome: data.nome || "",
          email: data.email || user.email,
          data_nascimento: data.data_nascimento || "",
          cep: data.cep || "",
          tel_celular: data.tel_celular || "",
          habilidades: data.habilidades || "",
          exp_profissional: data.exp_profissional || "",
          exp_voluntariado: data.exp_voluntariado || "",
          interessado: data.interessado || "",
          atividades_interesse: data.atividades_interesse || "",
          soube_iniciativa: data.soube_iniciativa || "",
          disponibilidade_variavel: data.disponibilidade_variavel || "TODA_SEMANA",
          consentimento: data.consentimento ?? true,
        });
      }
    } catch (err) {
      console.warn("Erro ao buscar voluntário existente:", err);
    } finally {
      setFetchingExisting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!user) {
      setErrorMessage("Você precisa estar logado para se cadastrar como voluntário.");
      return;
    }

    if (!formData.nome.trim() || !formData.email.trim()) {
      setErrorMessage("Nome e e-mail são obrigatórios.");
      return;
    }

    if (!formData.habilidades.trim()) {
      setErrorMessage("Por favor, descreva suas principais habilidades.");
      return;
    }

    if (!formData.consentimento) {
      setErrorMessage("É necessário aceitar os termos de consentimento para contato.");
      return;
    }

    setLoading(true);

    try {
      // 1. Obter o ID do usuário na tabela usuario do PostgreSQL
      let usuarioId = profile?.id;
      if (!usuarioId) {
        const { data: usuarioRecord } = await supabase
          .from("usuario")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (usuarioRecord) {
          usuarioId = usuarioRecord.id;
        }
      }

      // 2. Preparar payload conforme tabela 'voluntario'
      const payload: any = {
        email: formData.email.trim().toLowerCase(),
        nome: formData.nome.trim(),
        data_nascimento: formData.data_nascimento || null,
        cep: formData.cep.trim().replace(/\D/g, "") || null,
        tel_celular: formData.tel_celular.trim() || null,
        habilidades: formData.habilidades.trim(),
        exp_profissional: formData.exp_profissional.trim() || null,
        exp_voluntariado: formData.exp_voluntariado.trim() || null,
        interessado: formData.interessado.trim() || null,
        atividades_interesse: formData.atividades_interesse.trim() || null,
        soube_iniciativa: formData.soube_iniciativa.trim() || null,
        consentimento: formData.consentimento,
        disponibilidade_variavel: formData.disponibilidade_variavel,
        status_voluntario: volunteerStatus || 'PENDENTE',
        status_aprovacao_voluntario: volunteerStatus || 'PENDENTE',
        updated_at: new Date().toISOString(),
      };

      if (usuarioId) {
        payload.id_usuario = usuarioId;
      }

      // 3. Upsert no Supabase
      const { data, error } = await supabase
        .from("voluntario")
        .upsert(payload, { onConflict: "email" })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setIsAlreadyVolunteer(true);
      setVolunteerStatus(data.status_voluntario || 'PENDENTE');
      setSuccessMessage(
        data.status_voluntario === 'APROVADO'
          ? "Cadastro de voluntário atualizado com sucesso!"
          : "Cadastro enviado com sucesso! Seus dados estão em análise pela coordenação da Animativa."
      );
    } catch (err: any) {
      console.error("Erro ao salvar cadastro de voluntário:", err);
      setErrorMessage(
        err?.message || "Ocorreu um erro ao salvar seu cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-orange/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Hero */}
        <div className="relative h-[380px] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd2673555052?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/60 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner"
            >
              <Heart className="w-10 h-10 text-brand-blue" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
              Voluntários
            </h1>
            <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl">
              Seu talento é a ferramenta mais poderosa para a mudança. Junte-se à nossa rede ativa de impacto.
            </p>
          </div>
        </div>

        {/* Informative Banner / Login Gate */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-brand-orange/15 border border-brand-orange/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-white text-base md:text-lg">
                  Faça login para se cadastrar como voluntário
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  É necessário ter uma conta autenticada na Animativa para vincular seu perfil de voluntariado com segurança.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <Link 
                to="/cadastro?mode=login&redirect=voluntarios"
                className="flex-1 md:flex-initial text-center px-6 py-3.5 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg text-white"
              >
                Fazer Login
              </Link>
              <Link 
                to="/cadastro?mode=cadastro&redirect=voluntarios"
                className="flex-1 md:flex-initial text-center px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black uppercase tracking-widest text-xs transition-all text-white"
              >
                Criar Conta
              </Link>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Benefits & Instructions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Como funciona?</h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: "1. Cadastro de Habilidades",
                    desc: "Informe suas competências profissionais, disponibilidades e áreas de afinidade.",
                  },
                  {
                    title: "2. Conexão Direta",
                    desc: "Projetos e iniciativas que demandam seu perfil entram em contato com você.",
                  },
                  {
                    title: "3. Execução & Impacto",
                    desc: "Participe de ações sociais reais e acompanhe sua trajetória de colaboração.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-xs mb-1 text-white">{item.title}</h3>
                      <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isAlreadyVolunteer && (
                <div className={`p-5 rounded-2xl flex items-center gap-3 border ${
                  volunteerStatus === 'APROVADO'
                    ? 'bg-green-500/10 border-green-500/20 text-green-300'
                    : volunteerStatus === 'REPROVADO'
                    ? 'bg-red-500/10 border-red-500/20 text-red-300'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                }`}>
                  {volunteerStatus === 'APROVADO' ? (
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                  ) : volunteerStatus === 'REPROVADO' ? (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-75">
                      Status: {volunteerStatus === 'APROVADO' ? 'Aprovado' : volunteerStatus === 'REPROVADO' ? 'Reprovado' : 'Em Análise (Pendente)'}
                    </p>
                    <p className="text-xs font-bold mt-0.5">
                      {volunteerStatus === 'APROVADO'
                        ? 'Você é um voluntário aprovado! Seus dados podem ser atualizados a qualquer momento.'
                        : volunteerStatus === 'REPROVADO'
                        ? 'Seu cadastro não foi aprovado. Você pode atualizar seus dados e habilidades para reavaliação.'
                        : 'Seu cadastro foi recebido e aguarda aprovação da coordenação.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Registration / Update Form */}
          <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
            
            {/* Notifications */}
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-green-500/15 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-300 text-sm font-bold"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 text-sm font-bold"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Seção 1: Dados Pessoais */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> 1. Dados Pessoais do Voluntário
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="text" 
                        name="nome"
                        required
                        disabled={!user}
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                        placeholder="Ex: Maria Silva" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      E-mail de Contato *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="email" 
                        name="email"
                        required
                        disabled={true}
                        value={formData.email}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white/50 cursor-not-allowed" 
                        placeholder="seuemail@exemplo.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="date" 
                        name="data_nascimento"
                        disabled={!user}
                        value={formData.data_nascimento}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Telefone / WhatsApp (DDD + Número)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="tel" 
                        name="tel_celular"
                        disabled={!user}
                        value={formData.tel_celular}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                        placeholder="(11) 98765-4321" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      CEP da sua Residência
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="text" 
                        name="cep"
                        maxLength={8}
                        disabled={!user}
                        value={formData.cep}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                        placeholder="Ex: 01310100 (apenas dígitos)" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Disponibilidade e Habilidades */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 2. Competências e Disponibilidade
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Disponibilidade Pretendida (Frequência) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <select 
                        name="disponibilidade_variavel"
                        disabled={!user}
                        value={formData.disponibilidade_variavel}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50 appearance-none"
                      >
                        <option value="TODA_SEMANA" className="bg-brand-purple text-white">Toda semana</option>
                        <option value="CADA_2_SEMANAS" className="bg-brand-purple text-white">A cada 2 semanas</option>
                        <option value="UMA_MENSAL" className="bg-brand-purple text-white">Uma vez por mês</option>
                        <option value="MAX_2_HORAS" className="bg-brand-purple text-white">Até 2 horas semanais</option>
                        <option value="MAX_3_HORAS" className="bg-brand-purple text-white">Até 3 horas semanais</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Habilidades Principais (Técnicas, Manuais ou Sociais) *
                    </label>
                    <textarea 
                      name="habilidades"
                      required
                      rows={3}
                      disabled={!user}
                      value={formData.habilidades}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Ex: Design gráfico, redação, gestão financeira, contação de histórias, desenvolvimento web, captação de recursos..." 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Atividades de Interesse
                    </label>
                    <input 
                      type="text"
                      name="atividades_interesse"
                      disabled={!user}
                      value={formData.atividades_interesse}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Ex: Educação infantil, meio ambiente, suporte a idosos, eventos..." 
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Experiência e Motivação */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> 3. Experiência e Motivação
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                        Experiência Profissional
                      </label>
                      <textarea 
                        name="exp_profissional"
                        rows={3}
                        disabled={!user}
                        value={formData.exp_profissional}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                        placeholder="Breve resumo da sua área de atuação profissional atual ou passada." 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                        Experiência Prévia em Voluntariado
                      </label>
                      <textarea 
                        name="exp_voluntariado"
                        rows={3}
                        disabled={!user}
                        value={formData.exp_voluntariado}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                        placeholder="Já participou de outras ONGs ou projetos? Conte-nos brevemente." 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Por que você deseja ser voluntário na Animativa?
                    </label>
                    <textarea 
                      name="interessado"
                      rows={2}
                      disabled={!user}
                      value={formData.interessado}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Sua motivação pessoal para gerar impacto." 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Como conheceu a Animativa?
                    </label>
                    <input 
                      type="text"
                      name="soube_iniciativa"
                      disabled={!user}
                      value={formData.soube_iniciativa}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Ex: Redes sociais, indicação de amigos, eventos..." 
                    />
                  </div>
                </div>
              </div>

              {/* Termo de Consentimento */}
              <div className="border-t border-white/10 pt-8">
                <label className="flex items-start gap-3 bg-white/5 border border-white/10 p-5 rounded-2xl cursor-pointer hover:border-brand-blue transition-colors">
                  <input 
                    type="checkbox"
                    name="consentimento"
                    checked={formData.consentimento}
                    onChange={handleInputChange}
                    disabled={!user}
                    className="w-5 h-5 mt-0.5 accent-brand-blue shrink-0 rounded" 
                  />
                  <span className="text-xs text-white/80 leading-relaxed">
                    Autorizo a Animativa a registrar meus dados e a entrar em contato comigo por e-mail ou WhatsApp para oportunidades de impacto social.
                  </span>
                </label>
              </div>

              {/* Botão de Envio */}
              {user ? (
                <button 
                  type="submit"
                  disabled={loading || fetchingExisting}
                  className="w-full py-6 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Salvando Cadastro...
                    </>
                  ) : (
                    <>
                      {isAlreadyVolunteer ? "Atualizar Meu Cadastro de Voluntário" : "Salvar e Confirmar Cadastro"}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <Link 
                  to="/cadastro?mode=login&redirect=voluntarios"
                  className="w-full py-6 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-center block hover:bg-white hover:text-brand-purple transition-all shadow-xl text-xs"
                >
                  Entrar com Minha Conta para Salvar
                </Link>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
