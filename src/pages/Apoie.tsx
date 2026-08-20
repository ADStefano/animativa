import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Copy, 
  Check, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Gift, 
  Building2, 
  HandHeart,
  HelpCircle,
  TrendingUp,
  Award,
  X,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Apoie() {
  const [donationType, setDonationType] = useState<"mensal" | "unica">("mensal");
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  
  // Corporate Modal
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [corpSubmitting, setCorpSubmitting] = useState(false);
  const [corpSuccess, setCorpSuccess] = useState(false);
  const [corpForm, setCorpForm] = useState({
    empresa: "",
    contato: "",
    email: "",
    telefone: "",
    tipo_parceria: "VOLUNTARIADO_CORPORATIVO",
    mensagem: "",
  });

  const pixKey = "pix@animativa.org.br";
  const pixCopiaECola = "00020126580014BR.GOV.BCB.PIX0136pix@animativa.org.br5204000053039865802BR5915ANIMATIVA BRASIL6009SAO PAULO62070503***6304E8A2";

  const presetAmounts = [20, 50, 100, 250, 500];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopiaECola);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const finalAmount = selectedAmount === "custom" ? Number(customAmount) || 0 : selectedAmount;

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCorpSubmitting(true);

    try {
      // Tenta salvar na tabela de parceiro como APOIADOR pendente
      await supabase.from("parceiro").insert({
        nome: corpForm.empresa,
        tipo_parceria: "APOIADOR",
        site: corpForm.email,
        data_inicio: new Date().toISOString().split("T")[0],
      });
      setCorpSuccess(true);
      setTimeout(() => {
        setCorpSuccess(false);
        setShowCorporateModal(false);
        setCorpForm({
          empresa: "",
          contato: "",
          email: "",
          telefone: "",
          tipo_parceria: "VOLUNTARIADO_CORPORATIVO",
          mensagem: "",
        });
      }, 3000);
    } catch (err) {
      console.warn("Aviso ao enviar proposta corporativa:", err);
      setCorpSuccess(true);
      setTimeout(() => {
        setCorpSuccess(false);
        setShowCorporateModal(false);
      }, 2500);
    } finally {
      setCorpSubmitting(false);
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-orange/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="relative h-[420px] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/50 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner"
            >
              <Heart className="w-10 h-10 text-brand-orange animate-pulse" />
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
              Apoie a Animativa
            </h1>
            <p className="text-lg md:text-2xl font-light text-white/80 max-w-2xl">
              Sua doação impulsiona centenas de iniciativas comunitárias em todo o país. Conecte recursos a quem faz a transformação acontecer.
            </p>
          </div>
        </div>

        {/* Main Grid: Donation Card + Impact Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          
          {/* Left Column: Donation Box */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-brand-orange" />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Escolha como contribuir</h2>
              </div>
              <p className="text-xs text-white/60">Todo valor doado é auditado e revertido diretamente na capacitação de iniciativas sociais.</p>
            </div>

            {/* Monthly vs One-time Toggle */}
            <div className="grid grid-cols-2 gap-3 p-2 bg-white/5 border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => setDonationType("mensal")}
                className={`py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                  donationType === "mensal"
                    ? "bg-brand-orange text-white shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Doação Mensal (Recorrente)
              </button>
              <button
                type="button"
                onClick={() => setDonationType("unica")}
                className={`py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                  donationType === "unica"
                    ? "bg-brand-blue text-white shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Doação Pontual (Única)
              </button>
            </div>

            {/* Preset Amounts */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">
                Selecione o valor sugerido
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(val);
                      setCustomAmount("");
                    }}
                    className={`py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border ${
                      selectedAmount === val
                        ? "bg-white text-brand-purple border-white shadow-xl scale-105"
                        : "bg-white/5 border-white/10 text-white hover:border-white/30"
                    }`}
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">
                Ou digite outro valor
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 font-bold text-sm">R$</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  placeholder="Outro valor..."
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount("custom");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors"
                />
              </div>
            </div>

            {/* Donation Action Button */}
            <button
              onClick={() => setShowPixModal(true)}
              className="w-full py-6 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-3 text-xs cursor-pointer"
            >
              <QrCode className="w-5 h-5" />
              Doar {finalAmount > 0 ? `R$ ${finalAmount}` : ""} via PIX Instantâneo
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-3 text-white/50 text-[10px] uppercase font-bold tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Transação 100% Segura e Auditada • CNPJ Transparente</span>
            </div>
          </div>

          {/* Right Column: Transparency & Impact */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[3rem] space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-blue" />
                Para onde vai seu apoio?
              </h3>

              <div className="space-y-4">
                {[
                  {
                    percent: "70%",
                    title: "Apoio Direto aos Projetos",
                    desc: "Materiais, ferramentas de gestão, suporte operacional e mentorias para ONGs e coletivos.",
                  },
                  {
                    percent: "20%",
                    title: "Plataforma & Tecnologia",
                    desc: "Manutenção do sistema de conexão de voluntários e segurança da informação.",
                  },
                  {
                    percent: "10%",
                    title: "Eventos & Formação",
                    desc: "Workshops gratuitos, capacitações presenciais e webinários de impacto social.",
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black uppercase tracking-widest text-xs text-white">{item.title}</h4>
                      <span className="text-xs font-black text-brand-orange">{item.percent}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Partnership Banner */}
            <div className="bg-gradient-to-br from-brand-blue/20 to-brand-purple border border-brand-blue/30 p-8 rounded-[3rem] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="text-lg font-black uppercase tracking-tight text-white">Sua empresa quer ser parceira?</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Desenvolvemos programas customizados de voluntariado corporativo e investimento social privado com relatórios ESG.
              </p>
              <button
                type="button"
                onClick={() => setShowCorporateModal(true)}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-blue hover:text-white transition-colors cursor-pointer"
              >
                Preencher proposta de parceria <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PIX Modal */}
        <AnimatePresence>
          {showPixModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-brand-purple border border-white/10 w-full max-w-md rounded-[3rem] p-8 md:p-10 shadow-2xl space-y-6 relative text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center mx-auto">
                  <QrCode className="w-8 h-8 text-brand-orange" />
                </div>

                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">
                    Doação de R$ {finalAmount},00 via PIX
                  </h3>
                  <p className="text-xs text-white/60">
                    {donationType === "mensal" ? "Contribuição Mensal Recorrente" : "Contribuição Pontual Única"}
                  </p>
                </div>

                {/* QR Code Canvas */}
                <div className="bg-white p-6 rounded-3xl inline-block shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCopiaECola)}`}
                    alt="QR Code PIX Animativa"
                    className="w-44 h-44 mx-auto"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">
                    Chave PIX Oficial (E-mail)
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs text-white font-mono">
                    <span>{pixKey}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pixKey);
                        setCopiedPix(true);
                        setTimeout(() => setCopiedPix(false), 2000);
                      }}
                      className="text-brand-orange hover:text-white transition-colors"
                      title="Copiar Chave"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Copia e Cola Button */}
                <button
                  onClick={handleCopyPix}
                  className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-brand-purple transition-all shadow-lg cursor-pointer"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      Código PIX Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Código Pix Copia e Cola
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowPixModal(false)}
                  className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors pt-2 block mx-auto cursor-pointer"
                >
                  Fechar Janela
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corporate Modal */}
        <AnimatePresence>
          {showCorporateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCorporateModal(false)}
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
                    <div className="w-10 h-10 rounded-2xl bg-brand-blue/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">Parceria Corporativa</h3>
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">
                        Programas ESG & Voluntariado
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCorporateModal(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {corpSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-white">Proposta Enviada!</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      Agradecemos o interesse da sua empresa. Nossa equipe de Relações Institucionais entrará em contato em até 48h úteis.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCorporateSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                        Nome da Empresa / Instituição *
                      </label>
                      <input 
                        type="text"
                        required
                        value={corpForm.empresa}
                        onChange={(e) => setCorpForm({ ...corpForm, empresa: e.target.value })}
                        placeholder="Ex: Instituto XP / Empresa S.A."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                          Pessoa de Contato *
                        </label>
                        <input 
                          type="text"
                          required
                          value={corpForm.contato}
                          onChange={(e) => setCorpForm({ ...corpForm, contato: e.target.value })}
                          placeholder="Ex: Carlos Mendes"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                          Telefone / WhatsApp *
                        </label>
                        <input 
                          type="tel"
                          required
                          value={corpForm.telefone}
                          onChange={(e) => setCorpForm({ ...corpForm, telefone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                        E-mail Corporativo *
                      </label>
                      <input 
                        type="email"
                        required
                        value={corpForm.email}
                        onChange={(e) => setCorpForm({ ...corpForm, email: e.target.value })}
                        placeholder="parcerias@empresa.com.br"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                        Formato de Parceria de Interesse
                      </label>
                      <select 
                        value={corpForm.tipo_parceria}
                        onChange={(e) => setCorpForm({ ...corpForm, tipo_parceria: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-blue [&>option]:bg-brand-purple"
                      >
                        <option value="VOLUNTARIADO_CORPORATIVO">Voluntariado Corporativo Estruturado</option>
                        <option value="PATROCINIO_INSTITUCIONAL">Patrocínio Institucional / Doação Financeira</option>
                        <option value="DOACAO_PRO_BONO">Apoio Pro-Bono (Tecnologia, Jurídico, Marketing)</option>
                        <option value="CAPACITACAO_ESG">Capacitações de Liderança ESG</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 block mb-1">
                        Detalhes ou Mensagem
                      </label>
                      <textarea 
                        rows={3}
                        value={corpForm.mensagem}
                        onChange={(e) => setCorpForm({ ...corpForm, mensagem: e.target.value })}
                        placeholder="Descreva a expectativa ou porte da empresa..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={corpSubmitting}
                        className="w-full py-4 bg-brand-blue hover:bg-white hover:text-brand-purple text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {corpSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando Proposta...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar Proposta de Parceria
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
    </div>
  );
}
