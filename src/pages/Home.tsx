import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Heart, 
  Globe, 
  Zap,
  Sparkles,
  Bird,
  MessageCircle,
  Network,
  Search,
  GraduationCap,
  HeartHandshake
} from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex flex-col items-center ${className} select-none`}>
        <div className="relative">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white lowercase flex items-baseline">
            an
            <span className="relative inline-flex flex-col items-center">
              <span className="absolute -top-[0.15em] w-[0.22em] h-[0.22em] bg-brand-orange rounded-full shadow-[0_0_40px_rgba(255,140,0,0.6)]" />
              ı
            </span>
            mat
            <span className="relative inline-flex flex-col items-center">
              <span className="absolute -top-[0.15em] w-[0.22em] h-[0.22em] bg-brand-blue rounded-full shadow-[0_0_40px_rgba(0,174,239,0.6)]" />
              ı
            </span>
            va
          </h1>
        </div>
        <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.8em] text-white/40 mt-4 md:mt-6">
          Conexões Vivas
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Logo Animativa" 
        className="h-20 md:h-32 w-auto object-contain" 
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Strings */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.05, 0.15, 0.05],
                rotate: [0, i % 2 === 0 ? 360 : -360],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 20 + i * 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/5 rounded-full"
              style={{
                width: `${(i + 1) * 100}px`,
                height: `${(i + 1) * 100}px`,
                borderColor: i % 2 === 0 ? '#FF8C00' : '#00AEEF',
                borderWidth: '1px',
                borderStyle: 'solid',
                filter: 'blur(1px)'
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple rounded-full blur-[150px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Logo className="mb-12" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl font-light text-white/80 max-w-3xl mx-auto leading-tight mb-12">
              Onde <span className="text-brand-orange font-medium italic">propósito</span> encontra <span className="text-brand-blue font-medium italic">ação</span> para transformar realidades.
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/cadastro" className="group relative px-10 py-5 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-sm overflow-hidden transition-all hover:pr-14">
                <span className="relative z-10">Começar Agora</span>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/projetos" className="px-10 py-5 border border-white/20 hover:border-white/60 rounded-full font-black uppercase tracking-widest text-sm transition-all">
                Ver Projetos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* YouTube Video Highlight Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
          <div className="absolute top-10 right-10 w-72 h-72 bg-brand-orange blur-[120px] rounded-full" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-blue blur-[150px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block">Vídeo em Destaque</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                O Poder das <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">Conexões Vivas</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed font-light">
                Descubra como a Animativa atua como um catalisador de inovação social, conectando projetos inspiradores a pessoas dispostas a fazer a diferença. Assista ao nosso vídeo institucional e entenda como pequenas ações coletivas regeneram realidades inteiras.
              </p>
              <div className="pt-4">
                <Link to="/cadastro" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-orange hover:text-white transition-colors group">
                  Fazer Parte Deste Movimento
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-brand-purple/50 bg-black group"
              >
                <iframe 
                  className="w-full h-full object-cover"
                  src="https://www.youtube.com/embed/g7kRsr8ISLw" 
                  title="Animativa Vídeo Destaque"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Areas */}
      <section id="acesso" className="py-32 bg-white/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-blue mb-4">Como você quer impactar?</h2>
            <p className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Escolha seu caminho</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Initiatives */}
            <Link to="/iniciativas">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="group relative h-[500px] rounded-[3.5rem] overflow-hidden bg-brand-purple border border-white/10 cursor-pointer shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-brand-purple/80 to-brand-purple transition-all duration-500" />
                
                <div className="relative h-full p-14 flex flex-col justify-between z-10">
                  <div>
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-10 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-10 h-10 text-brand-orange" />
                    </div>
                    <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Iniciativas</h3>
                    <p className="text-2xl text-white/70 max-w-md leading-tight font-light">
                      Transforme sua <span className="text-white font-medium">ideia</span> em um movimento real de mudança.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="px-10 py-5 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-sm group-hover:bg-brand-orange group-hover:text-white transition-all shadow-xl">
                      Cadastrar Projeto
                    </span>
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all">
                      <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Volunteers */}
            <Link to="/voluntarios">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="group relative h-[500px] rounded-[3.5rem] overflow-hidden bg-brand-purple border border-white/10 cursor-pointer shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd2673555052?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/40 via-brand-purple/80 to-brand-purple transition-all duration-500" />
                
                <div className="relative h-full p-14 flex flex-col justify-between z-10">
                  <div>
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-10 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      <Heart className="w-10 h-10 text-brand-blue" />
                    </div>
                    <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Voluntários</h3>
                    <p className="text-2xl text-white/70 max-w-md leading-tight font-light">
                      Doe seu <span className="text-white font-medium">talento</span> para quem mais precisa de você hoje.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="px-10 py-5 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-sm group-hover:bg-brand-blue group-hover:text-white transition-all shadow-xl">
                      Quero Ajudar
                    </span>
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all">
                      <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Catalog */}
            <Link to="/projetos" className="lg:col-span-2">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="group relative h-[400px] rounded-[3.5rem] overflow-hidden bg-brand-purple border border-white/10 cursor-pointer shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-purple/80 to-transparent transition-all duration-500" />
                
                <div className="relative h-full p-14 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
                  <div className="max-w-2xl">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-10 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Catálogo de Projetos</h3>
                    <p className="text-2xl text-white/70 leading-tight font-light">
                      Explore <span className="text-white font-medium">centenas</span> de iniciativas ativas prontas para receber seu apoio.
                    </p>
                  </div>
                  <span className="px-12 py-6 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-sm group-hover:bg-brand-orange group-hover:text-white transition-all shadow-2xl whitespace-nowrap">
                    Explorar Catálogo
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Events */}
            <Link to="/eventos" className="lg:col-span-2">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="group relative h-[400px] rounded-[3.5rem] overflow-hidden bg-brand-purple border border-white/10 cursor-pointer shadow-2xl"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-brand-purple/80 to-brand-purple transition-all duration-500" />
                
                <div className="relative h-full p-14 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
                  <div className="max-w-2xl">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-10 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-10 h-10 text-brand-orange" />
                    </div>
                    <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Eventos & Workshops</h3>
                    <p className="text-2xl text-white/70 leading-tight font-light">
                      Conecte-se com a <span className="text-white font-medium">comunidade</span> em encontros presenciais e digitais.
                    </p>
                  </div>
                  <span className="px-12 py-6 border-2 border-brand-orange text-brand-orange rounded-full font-black uppercase tracking-widest text-sm group-hover:bg-brand-orange group-hover:text-white transition-all shadow-2xl whitespace-nowrap">
                    Ver Agenda Completa
                  </span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Essence Section (History, Mission) */}
      <section className="py-32 bg-brand-purple relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start mb-24">
            {/* History - Oversized Typographic (Recipe 9) */}
            <div className="lg:col-span-6 space-y-12">
              <div className="relative">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-8">Nossa Jornada</h2>
                <div className="space-y-20">
                  <div className="relative pl-20">
                    <span className="absolute left-0 top-0 text-7xl md:text-8xl font-black text-white/5 leading-none select-none">2020</span>
                    <div className="relative z-10">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">O Início</h3>
                      <p className="text-sm text-white/60 font-light leading-relaxed">
                        Nascemos em meio a um desafio global, com a missão de conectar pessoas que queriam ajudar a projetos que precisavam de braços. Começamos com 5 voluntários e um sonho.
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-20">
                    <span className="absolute left-0 top-0 text-7xl md:text-8xl font-black text-white/5 leading-none select-none">2023</span>
                    <div className="relative z-10">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Expansão</h3>
                      <p className="text-sm text-white/60 font-light leading-relaxed">
                        Alcançamos a marca de 100 projetos ativos em 10 estados brasileiros. A Animativa deixou de ser uma ponte para se tornar um ecossistema de transformação social.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission - Clean Utility (Recipe 8) */}
            <div className="lg:col-span-6 h-full flex flex-col justify-center">
              <div className="bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-[3.5rem] border border-white/10 h-full flex flex-col justify-center">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-blue mb-6">Nossa Missão</h2>
                <p className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                  Potencializar o <span className="text-brand-orange">impacto social</span> através de conexões inteligentes e <span className="text-brand-blue">humanas</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal Distribution of Values Section */}
          <div className="border-t border-white/5 pt-20">
            <div className="mb-12">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-blue mb-4">Metodologias & Valores</h2>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Pilares de Nossa Atuação</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-2">Tecnologias sociais integradas para fomento de redes colaborativas</p>
            </div>

            {/* Reorganized horizontally as 3 columns on desktop, horizontal scroll on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Cultura da Paz", desc: "Promover a harmonia e a resolução pacífica de conflitos em todas as instâncias.", icon: Bird, color: "brand-orange" },
                { title: "Círculos de Diálogo", desc: "Espaços seguros de escuta profunda e compartilhamento autêntico.", icon: MessageCircle, color: "brand-blue" },
                { title: "Pensamento Sistêmico", desc: "Compreender a interconexão de todos os elementos e o impacto das ações no todo.", icon: Network, color: "white" },
                { title: "Investigação Apreciativa", desc: "Focar no que funciona e potencializar as forças positivas de cada sistema.", icon: Search, color: "brand-orange" },
                { title: "Educação em Valores", desc: "Formação integral baseada em princípios éticos e humanos universais.", icon: GraduationCap, color: "brand-blue" },
                { title: "Comunicação Não-Violenta", desc: "Linguagem que fortalece a conexão e a compaixão mútua.", icon: HeartHandshake, color: "white" },
              ].map((value) => (
                <div key={value.title} className="group p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-white/20 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center justify-between mb-6">
                    <value.icon className={`w-8 h-8 text-${value.color} group-hover:scale-110 transition-transform`} />
                    <div className={`w-2 h-2 rounded-full bg-${value.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-3 leading-none">{value.title}</h3>
                    <p className="text-sm text-white/50 font-light leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-orange to-brand-purple p-16 md:p-24 rounded-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none uppercase tracking-tighter">
                  Pronto para transformar?
                </h2>
                <p className="text-2xl text-white/90 mb-12 leading-relaxed font-light">
                  Nossa rede já conectou mais de 500 projetos com milhares de voluntários apaixonados. Seja a próxima conexão viva.
                </p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20">
                    <Globe className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-xs">Impacto Global</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20">
                    <Heart className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-xs">Causas Reais</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Projetos", value: "500+" },
                  { label: "Voluntários", value: "10k+" },
                  { label: "Cidades", value: "50+" },
                  { label: "Vidas", value: "1M+" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
                    <p className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</p>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
