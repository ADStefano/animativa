import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Mail, Lock, User, Chrome, Facebook, Check, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signUp, signIn, signInWithOAuth, isConfigured } = useAuth();
  
  // Tab control: "cadastro" or "login"
  const [mode, setMode] = useState<"cadastro" | "login">("cadastro");
  const [step, setStep] = useState(1); // 1: Form, 3: Success
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    if (user && step !== 3) {
      // Se já está logado e não está exibindo tela de sucesso, pode ir para perfil
      const params = new URLSearchParams(location.search);
      if (params.get("redirect") === "voluntarios") {
        navigate("/voluntarios");
      } else if (params.get("redirect") === "iniciativas") {
        navigate("/iniciativas");
      }
    }
  }, [user, navigate, location, step]);

  // Detect mode from URL query parameter (?mode=login ou ?mode=cadastro)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");
    if (modeParam === "login") {
      setMode("login");
    } else {
      setMode("cadastro");
    }
    setError("");
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!formData.email || !formData.password) {
          setError("Por favor, preencha seu e-mail e senha.");
          setLoading(false);
          return;
        }

        const { error: signInError } = await signIn(formData.email.trim(), formData.password);
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("E-mail ou senha inválidos. Verifique seus dados.");
          } else {
            setError(signInError.message || "Erro ao efetuar login.");
          }
          setLoading(false);
          return;
        }

        setStep(3); // Success
      } else {
        // Cadastro
        if (!formData.name || !formData.email || !formData.password) {
          setError("Por favor, preencha todos os campos obrigatórios.");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("A senha deve conter no mínimo 6 caracteres.");
          setLoading(false);
          return;
        }

        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
          setError("As senhas informadas não coincidem.");
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(
          formData.email.trim(),
          formData.password,
          formData.name.trim()
        );

        if (signUpError) {
          if (signUpError.message.includes("already registered") || signUpError.message.includes("unique constraint")) {
            setError("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
          } else {
            setError(signUpError.message || "Erro ao criar conta.");
          }
          setLoading(false);
          return;
        }

        setStep(3); // Registration success
      }
    } catch (err: any) {
      setError(err?.message || "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setError("");
    try {
      const { error: oauthError } = await signInWithOAuth(provider);
      if (oauthError) {
        setError(`Erro ao autenticar com ${provider === "google" ? "Google" : "Meta"}: ${oauthError.message}`);
      }
    } catch (err: any) {
      setError(err?.message || `Não foi possível iniciar o login com ${provider}.`);
    }
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
                type="button"
                onClick={() => { setMode("cadastro"); setError(""); }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                  mode === "cadastro" ? "bg-brand-orange text-white shadow-lg" : "text-white/40 hover:text-white"
                }`}
              >
                Criar Conta
              </button>
              <button
                type="button"
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
            {step === 3 && "Bem-vindo!"}
          </h1>
          
          <p className="text-xs text-white/60 mt-2">
            {step === 1 && (mode === "cadastro" ? "Junte-se à rede de impacto social do país" : "Acesse sua conta para gerenciar seu perfil e iniciativas")}
            {step === 3 && "Sua autenticação foi realizada com sucesso"}
          </p>

          {!isConfigured && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-[11px] text-amber-200">
              ℹ️ <strong>Supabase em Modo Local:</strong> Configure suas variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no seu arquivo <code>.env</code> para conectar ao seu projeto PostgreSQL do Supabase.
            </div>
          )}
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white" 
                        placeholder="Ex: Maria Santos" 
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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white" 
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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white" 
                      placeholder="Mínimo de 6 caracteres" 
                    />
                  </div>
                </div>

                {mode === "cadastro" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Confirmar Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      <input 
                        type="password" 
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white" 
                        placeholder="Repita sua senha" 
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      {mode === "cadastro" ? "Criar Conta" : "Entrar na Conta"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-8 text-center">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10" />
                <span className="relative bg-brand-purple px-4 text-[10px] font-black uppercase tracking-widest text-white/40">Ou acesse com</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-red-400" />
                  Google
                </button>
                <button 
                  type="button"
                  onClick={() => handleOAuthLogin("facebook")}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-brand-blue" />
                  Meta
                </button>
              </div>
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
                  {mode === "cadastro" ? "Conta Criada!" : "Login Efetuado!"}
                </h2>
                <p className="text-xs text-white/60">
                  Olá, <strong className="text-white">{formData.name || formData.email || "Usuário"}</strong>. Você está autenticado na Animativa.
                </p>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/perfil" 
                  className="block w-full py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl text-center"
                >
                  Acessar Meu Perfil
                </Link>
                <Link 
                  to="/" 
                  className="block w-full text-center text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors py-2"
                >
                  Ir para a Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
