import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Shield, ShieldCheck, Mail, Lock, User, Chrome, Facebook, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginSimulated } from "../utils/auth";

export default function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tab control: "cadastro" or "login"
  const [mode, setMode] = useState<"cadastro" | "login">("cadastro");
  const [step, setStep] = useState(1); // 1: Form, 2: 2FA Setup, 3: Success
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    twoFactorCode: "",
  });
  const [error, setError] = useState("");

  // Detect mode from URL query parameter (?mode=login)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");
    if (modeParam === "login") {
      setMode("login");
    } else {
      setMode("cadastro");
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!formData.email || !formData.password) {
        setError("Por favor, preencha todos os campos.");
        return;
      }
      // Log in immediately for simulated auth
      loginSimulated(formData.name || "Gus Silva", formData.email);
      setStep(3); // Success
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      // Proceed to 2-step verification for signup
      setStep(2);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.twoFactorCode || formData.twoFactorCode.length < 6) {
      setError("Por favor, insira o código de 6 dígitos.");
      return;
    }
    // Set simulated logged in status
    loginSimulated(formData.name, formData.email);
    setStep(3); // Registration success
  };

  return (
    <div className="min-h-screen bg-brand-purple flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-orange/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-10 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex flex-col items-center select-none">
              <div className="flex items-baseline font-black tracking-tighter text-white lowercase text-3xl">
                <span>an</span>
                <span className="relative inline-flex flex-col items-center">
                  <span className="absolute rounded-full bg-brand-orange w-2 h-2 -top-1.5" />
                  <span>ı</span>
                </span>
                <span>mat</span>
                <span className="relative inline-flex flex-col items-center">
                  <span className="absolute rounded-full bg-brand-blue w-2 h-2 -top-1.5" />
                  <span>ı</span>
                </span>
                <span>va</span>
              </div>
              <p className="font-black uppercase text-white/40 text-[8px] tracking-[0.5em] mt-1">
                Conexões Vivas
              </p>
            </div>
          </Link>

          {step === 1 && (
            <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8">
              <button
                onClick={() => { setMode("cadastro"); setError(""); }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  mode === "cadastro" ? "bg-brand-orange text-white shadow-lg" : "text-white/40 hover:text-white"
                }`}
              >
                Criar Conta
              </button>
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  mode === "login" ? "bg-brand-orange text-white shadow-lg" : "text-white/40 hover:text-white"
                }`}
              >
                Entrar / Login
              </button>
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            {step === 1 && (mode === "cadastro" ? "Criar Conta" : "Entrar no Sistema")}
            {step === 2 && "Segurança em 2 Etapas"}
            {step === 3 && "Bem-vindo!"}
          </h1>
          
          <p className="text-xs text-white/60 mt-2">
            {step === 1 && (mode === "cadastro" ? "Junte-se à maior rede de impacto social do país" : "Acesse sua conta para gerenciar seu impacto")}
            {step === 2 && "Configure o segundo fator de segurança para sua conta"}
            {step === 3 && "Sua conta foi conectada com segurança de nível máximo"}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-xs text-red-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "cadastro" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm" 
                        placeholder="Ex: João Silva" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm" 
                      placeholder="seuemail@exemplo.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input 
                      type="password" 
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
                >
                  {mode === "cadastro" ? "Criar Conta" : "Entrar na Conta"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-8 text-center">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10" />
                <span className="relative bg-brand-purple px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Ou entre diretamente</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    loginSimulated("Gus Silva (Google)", "gus.google@exemplo.com");
                    setStep(3);
                  }}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-colors"
                >
                  <Chrome className="w-4 h-4 text-red-400" />
                  Google
                </button>
                <button 
                  onClick={() => {
                    loginSimulated("Gus Silva (FB)", "gus.fb@exemplo.com");
                    setStep(3);
                  }}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-colors"
                >
                  <Facebook className="w-4 h-4 text-brand-blue" />
                  Facebook
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleVerify2FA} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-brand-orange" />
                  </div>
                  <p className="text-xs text-white/70">
                    Enviamos um código de segurança de 6 dígitos para o e-mail <strong className="text-white">{formData.email}</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Código de Verificação</label>
                  <input 
                    type="text" 
                    name="twoFactorCode"
                    maxLength={6}
                    required
                    value={formData.twoFactorCode}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-brand-orange transition-colors text-center font-bold tracking-[0.5em] text-lg" 
                    placeholder="000000" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
                >
                  Verificar e Ativar
                  <ShieldCheck className="w-4 h-4" />
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors py-2"
                >
                  Voltar ao Formulário
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase tracking-tighter">
                  {mode === "cadastro" ? "Cadastro Concluído!" : "Login Concluído!"}
                </h2>
                <p className="text-xs text-white/60">
                  Olá, <strong className="text-white">{formData.name || "Voluntário"}</strong>. Você foi autenticado com sucesso.
                </p>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/perfil" 
                  className="block w-full py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl text-center"
                >
                  Ir para Meu Perfil
                </Link>
                <Link 
                  to="/" 
                  className="block w-full text-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors py-2"
                >
                  Ir para a Home Page
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
