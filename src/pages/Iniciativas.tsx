import { motion } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Iniciativas() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative h-[400px] rounded-[3.5rem] overflow-hidden mb-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/60 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/20"
            >
              <Sparkles className="w-10 h-10 text-brand-orange" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Iniciativas</h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl">
              Dê vida ao seu projeto social. Conectamos sua visão aos recursos e pessoas certas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Por que cadastrar?</h2>
            <div className="space-y-6">
              {[
                { title: "Visibilidade", desc: "Sua causa exposta para milhares de potenciais voluntários." },
                { title: "Gestão", desc: "Ferramentas simples para organizar suas necessidades e equipe." },
                { title: "Rede", desc: "Acesso a workshops e mentorias exclusivas para projetos." },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0" />
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Nome da Iniciativa</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors" placeholder="Ex: Projeto Re-Verde" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Categoria</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors appearance-none">
                    <option>Educação</option>
                    <option>Meio Ambiente</option>
                    <option>Saúde</option>
                    <option>Cultura</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Descrição do Impacto</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors" placeholder="Conte-nos como seu projeto transforma a realidade..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Localização</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors" placeholder="Cidade / Estado" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">E-mail de Contato</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-orange transition-colors" placeholder="contato@projeto.org" />
                </div>
              </div>

              <button className="w-full py-6 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-3">
                Enviar para Curadoria
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Mural de Iniciativas */}
        <section className="space-y-12">
          <div className="text-center md:text-left">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-4">Mural de Impacto</h2>
            <p className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Iniciativas Cadastradas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Vozes da Periferia", category: "Cultura", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400" },
              { name: "Sementes do Amanhã", category: "Educação", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" },
              { name: "Eco-Ação", category: "Meio Ambiente", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400" },
              { name: "Saúde em Movimento", category: "Saúde", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" },
              { name: "Tecnologia Social", category: "Educação", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
              { name: "Arte Solidária", category: "Cultura", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=400" },
              { name: "Recicla Já", category: "Meio Ambiente", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400" },
              { name: "Sorriso de Criança", category: "Saúde", image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=400" },
            ].map((initiative, i) => (
              <Link key={i} to="/projetos">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative h-72 rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer"
                >
                  <img 
                    src={initiative.image} 
                    alt={initiative.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-purple via-brand-purple/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">{initiative.category}</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-brand-orange transition-colors">
                      {initiative.name}
                    </h3>
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
