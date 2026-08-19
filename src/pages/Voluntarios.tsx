import { motion } from "motion/react";
import { Heart, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Voluntarios() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative h-[400px] rounded-[3.5rem] overflow-hidden mb-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd2673555052?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/60 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/20"
            >
              <Heart className="w-10 h-10 text-brand-blue" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Voluntários</h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl">
              Seu talento é a ferramenta mais poderosa para a mudança. Encontre sua causa agora.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Como funciona?</h2>
            <div className="space-y-6">
              {[
                { title: "Perfil", desc: "Cadastre suas habilidades e áreas de interesse." },
                { title: "Match", desc: "Receba recomendações de projetos que precisam de você." },
                { title: "Impacto", desc: "Acompanhe suas horas de voluntariado e impacto gerado." },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-brand-blue shrink-0" />
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm mb-1">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[3.5rem] border border-white/10">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Seu Nome Completo</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ex: Maria Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Sua Principal Habilidade</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ex: Design, Ensino, Cozinha..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Áreas de Interesse</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Educação", "Saúde", "Ambiente", "Cultura"].map((area) => (
                    <label key={area} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-brand-blue transition-colors">
                      <input type="checkbox" className="w-4 h-4 accent-brand-blue" />
                      <span className="text-xs font-bold uppercase tracking-widest">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Disponibilidade</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors appearance-none">
                    <option>Finais de Semana</option>
                    <option>Dias de Semana (Noite)</option>
                    <option>Dias de Semana (Comercial)</option>
                    <option>Eventual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">E-mail de Contato</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="seuemail@exemplo.com" />
                </div>
              </div>

              <button className="w-full py-6 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-3">
                Quero me Cadastrar
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
