import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  User, 
  Globe, 
  Instagram, 
  Lock,
  PlusCircle,
  FileText
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Iniciativas() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [initiativesList, setInitiativesList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form Data
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    setor_sociedade: "Educação",
    data_criacao_iniciativa: new Date().toISOString().split("T")[0],
    cidade: "",
    uf: "SP",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    tel_celular: "",
    tel_fixo: "",
    site: "",
    instagram: "",
    whatsapp: "",
    nome_rep_legal: "",
    cel_rep_legal: "",
    proposito_iniciativa: "",
    impacto_iniciativa: "",
    habilidades_exigidas: "",
    formalizacao: false,
    sede_fisica: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        nome_rep_legal: profile?.nome || user.user_metadata?.nome || prev.nome_rep_legal,
      }));
    }
    loadInitiatives();
  }, [user, profile]);

  const loadInitiatives = async () => {
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from("iniciativa")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0 && !error) {
        setInitiativesList(data);
      } else {
        // Fallback default list
        setInitiativesList([
          { id: 1, nome: "Vozes da Periferia", setor_sociedade: "Cultura", cidade: "São Paulo", uf: "SP", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400" },
          { id: 2, nome: "Sementes do Amanhã", setor_sociedade: "Educação", cidade: "Curitiba", uf: "PR", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" },
          { id: 3, nome: "Eco-Ação", setor_sociedade: "Meio Ambiente", cidade: "Salvador", uf: "BA", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400" },
          { id: 4, nome: "Saúde em Movimento", setor_sociedade: "Saúde", cidade: "Belo Horizonte", uf: "MG", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" },
          { id: 5, nome: "Tecnologia Social", setor_sociedade: "Educação", cidade: "Recife", uf: "PE", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
          { id: 6, nome: "Arte Solidária", setor_sociedade: "Cultura", cidade: "Porto Alegre", uf: "RS", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=400" },
          { id: 7, nome: "Recicla Já", setor_sociedade: "Meio Ambiente", cidade: "Rio de Janeiro", uf: "RJ", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400" },
          { id: 8, nome: "Sorriso de Criança", setor_sociedade: "Saúde", cidade: "Manaus", uf: "AM", image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=400" },
        ]);
      }
    } catch (err) {
      console.warn("Erro ao buscar mural de iniciativas:", err);
    } finally {
      setLoadingList(false);
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
      setErrorMessage("Você precisa estar logado para cadastrar uma iniciativa.");
      return;
    }

    if (!formData.nome.trim() || !formData.email.trim() || !formData.nome_rep_legal.trim() || !formData.cel_rep_legal.trim()) {
      setErrorMessage("Preencha todos os campos obrigatórios (Nome, E-mail de contato, Representante Legal e Celular do Representante).");
      return;
    }

    setLoading(true);

    try {
      // 1. Obter ID do usuário no banco
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

      // 2. Montar payload conforme tabela 'iniciativa'
      const payload: any = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        setor_sociedade: formData.setor_sociedade,
        data_criacao_iniciativa: formData.data_criacao_iniciativa || new Date().toISOString().split("T")[0],
        cep: formData.cep.trim().replace(/\D/g, "") || null,
        rua: formData.rua.trim() || null,
        numero: formData.numero.trim() || null,
        complemento: formData.complemento.trim() || null,
        cidade: formData.cidade.trim() || null,
        uf: formData.uf.trim() || null,
        tel_fixo: formData.tel_fixo.trim() || null,
        tel_celular: formData.tel_celular.trim() || null,
        formalizacao: formData.formalizacao,
        sede_fisica: formData.sede_fisica,
        site: formData.site.trim() || null,
        instagram: formData.instagram.trim() || null,
        whatsapp: formData.whatsapp.trim() || null,
        nome_rep_legal: formData.nome_rep_legal.trim(),
        cel_rep_legal: formData.cel_rep_legal.trim(),
        proposito_iniciativa: formData.proposito_iniciativa.trim() || null,
        impacto_iniciativa: formData.impacto_iniciativa.trim() || null,
        habilidades_exigidas: formData.habilidades_exigidas.trim() || null,
        autorizada: true,
        data_cadastro: new Date().toISOString().split("T")[0],
      };

      if (usuarioId) {
        payload.id_usuario = usuarioId;
      }

      const { data, error } = await supabase
        .from("iniciativa")
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (error.message.includes("unique constraint") || error.message.includes("iniciativa_nome_key")) {
          throw new Error("Já existe uma iniciativa cadastrada com este nome. Escolha um nome diferente.");
        }
        throw error;
      }

      setSuccessMessage("Iniciativa cadastrada com sucesso no banco de dados!");
      
      // Limpa campos
      setFormData((prev) => ({
        ...prev,
        nome: "",
        cidade: "",
        rua: "",
        numero: "",
        proposito_iniciativa: "",
        impacto_iniciativa: "",
        habilidades_exigidas: "",
      }));

      // Atualiza lista
      loadInitiatives();
    } catch (err: any) {
      console.error("Erro ao cadastrar iniciativa:", err);
      setErrorMessage(err?.message || "Ocorreu um erro ao cadastrar a iniciativa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-brand-orange/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Hero */}
        <div className="relative h-[400px] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/60 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner"
            >
              <Sparkles className="w-10 h-10 text-brand-orange" />
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
              Iniciativas
            </h1>
            <p className="text-lg md:text-2xl font-light text-white/80 max-w-2xl">
              Dê vida ao seu projeto social. Conectamos sua visão aos voluntários e recursos certos.
            </p>
          </div>
        </div>

        {/* Login Gate Banner */}
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
                  Faça login para cadastrar sua iniciativa
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  É necessário ter uma conta autenticada na Animativa para associar e gerenciar sua causa com segurança.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <Link 
                to="/cadastro?mode=login&redirect=iniciativas"
                className="flex-1 md:flex-initial text-center px-6 py-3.5 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg text-white"
              >
                Fazer Login
              </Link>
              <Link 
                to="/cadastro?mode=cadastro&redirect=iniciativas"
                className="flex-1 md:flex-initial text-center px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black uppercase tracking-widest text-xs transition-all text-white"
              >
                Criar Conta
              </Link>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-start">
          
          {/* Benefits Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Por que cadastrar?</h2>
              
              <div className="space-y-6">
                {[
                  { title: "Visibilidade Nacional", desc: "Sua causa exposta para milhares de voluntários e apoiadores de todo o Brasil." },
                  { title: "Gestão Integrada", desc: "Receba adesões de voluntários capacitados para suprir as necessidades do seu projeto." },
                  { title: "Rede & Parcerias", desc: "Acesso ao ecossistema de conexões e capacitações da Animativa." },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-xs mb-1 text-white">{item.title}</h3>
                      <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
            
            <div className="mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                <Building className="w-6 h-6 text-brand-orange" />
                Formulário de Cadastro de Iniciativa
              </h2>
              <p className="text-xs text-white/60 mt-1">Preencha as informações do projeto para disponibilizá-lo na plataforma.</p>
            </div>

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
              
              {/* Seção 1: Dados Principais */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 1. Identificação da Iniciativa
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Nome da Iniciativa *
                    </label>
                    <input 
                      type="text" 
                      name="nome"
                      required
                      disabled={!user}
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Ex: Projeto Re-Verde Urbano" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Setor / Categoria *
                    </label>
                    <select 
                      name="setor_sociedade"
                      disabled={!user}
                      value={formData.setor_sociedade}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50 appearance-none"
                    >
                      <option value="Educação" className="bg-brand-purple text-white">Educação</option>
                      <option value="Meio Ambiente" className="bg-brand-purple text-white">Meio Ambiente</option>
                      <option value="Saúde" className="bg-brand-purple text-white">Saúde</option>
                      <option value="Cultura" className="bg-brand-purple text-white">Cultura</option>
                      <option value="Inovação Social" className="bg-brand-purple text-white">Inovação Social</option>
                      <option value="Assistência Social" className="bg-brand-purple text-white">Assistência Social</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Data de Criação da Iniciativa *
                    </label>
                    <input 
                      type="date" 
                      name="data_criacao_iniciativa"
                      required
                      disabled={!user}
                      value={formData.data_criacao_iniciativa}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50" 
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      E-mail Institucional da Iniciativa *
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      disabled={!user}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="contato@projeto.org" 
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Representante Legal */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> 2. Representante Legal / Interlocutor
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Nome do Representante *
                    </label>
                    <input 
                      type="text" 
                      name="nome_rep_legal"
                      required
                      disabled={!user}
                      value={formData.nome_rep_legal}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Nome completo do responsável" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Celular / WhatsApp do Representante *
                    </label>
                    <input 
                      type="tel" 
                      name="cel_rep_legal"
                      required
                      disabled={!user}
                      value={formData.cel_rep_legal}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="(11) 98765-4321" 
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Localização & Endereço */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-orange mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> 3. Localização
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Cidade</label>
                    <input 
                      type="text" 
                      name="cidade"
                      disabled={!user}
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Ex: São Paulo" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">UF (Estado)</label>
                    <input 
                      type="text" 
                      name="uf"
                      maxLength={2}
                      disabled={!user}
                      value={formData.uf}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white disabled:opacity-50 uppercase" 
                      placeholder="SP" 
                    />
                  </div>
                </div>
              </div>

              {/* Seção 4: Propósito & Habilidades */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 4. Propósito, Impacto e Voluntários
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Descrição do Impacto e Atuação
                    </label>
                    <textarea 
                      name="impacto_iniciativa"
                      rows={3}
                      disabled={!user}
                      value={formData.impacto_iniciativa}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Conte como seu projeto transforma a comunidade ou o ecossistema..." 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
                      Habilidades Exigidas / Desejadas dos Voluntários
                    </label>
                    <input 
                      type="text" 
                      name="habilidades_exigidas"
                      disabled={!user}
                      value={formData.habilidades_exigidas}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors text-sm text-white disabled:opacity-50" 
                      placeholder="Ex: Gestão de projetos, contabilidade, redes sociais, educadores..." 
                    />
                  </div>
                </div>
              </div>

              {/* Botão de Envio */}
              {user ? (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Cadastrando Iniciativa no Banco...
                    </>
                  ) : (
                    <>
                      Cadastrar Iniciativa
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <Link 
                  to="/cadastro?mode=login&redirect=iniciativas"
                  className="w-full py-6 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-center block hover:bg-white hover:text-brand-purple transition-all shadow-xl text-xs"
                >
                  Entrar com Minha Conta para Cadastrar
                </Link>
              )}

            </form>
          </div>
        </div>

        {/* Mural de Iniciativas */}
        <section className="space-y-12">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-3">Mural de Impacto</h2>
              <p className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Iniciativas Cadastradas</p>
            </div>
            <Link 
              to="/projetos"
              className="text-xs font-black uppercase tracking-widest text-brand-blue hover:text-white flex items-center gap-2 transition-colors"
            >
              Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiativesList.slice(0, 8).map((initiative, i) => (
              <Link key={initiative.id || i} to={`/projetos/${initiative.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative h-72 rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer"
                >
                  <img 
                    src={initiative.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"} 
                    alt={initiative.nome} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-purple via-brand-purple/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">
                      {initiative.setor_sociedade || "Impacto Social"}
                    </span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-brand-orange transition-colors">
                      {initiative.nome}
                    </h3>
                    {initiative.cidade && (
                      <p className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                        {initiative.cidade}{initiative.uf ? ` - ${initiative.uf}` : ""}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-white/40 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <span className="text-[10px] font-black uppercase tracking-widest">Ver Detalhes</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
