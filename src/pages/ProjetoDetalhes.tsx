import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, Users, Calendar, Globe, Heart, Share2, MessageCircle } from "lucide-react";

// This would normally come from an API or shared state
const projects = [
  { id: 1, title: "Re-Verde Urbano", category: "Meio Ambiente", location: "São Paulo, SP", volunteers: 12, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", description: "O Re-Verde Urbano foca na revitalização de espaços públicos através do plantio de espécies nativas e criação de hortas comunitárias em áreas subutilizadas da cidade de São Paulo." },
  { id: 2, title: "EducaTech", category: "Educação", location: "Curitiba, PR", volunteers: 8, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", description: "Iniciativa que leva alfabetização digital e lógica de programação para jovens de escolas públicas, preparando-os para as oportunidades do mercado de tecnologia." },
  { id: 3, title: "Cozinha Solidária", category: "Saúde", location: "Salvador, BA", volunteers: 25, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", description: "Combate à insegurança alimentar através da distribuição de refeições nutritivas e oficinas de educação alimentar para comunidades em situação de vulnerabilidade." },
  { id: 4, title: "Arte na Praça", category: "Cultura", location: "Belo Horizonte, MG", volunteers: 5, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800", description: "Promove a ocupação cultural de praças públicas com oficinas de arte, teatro de rua e exposições itinerantes de artistas locais." },
  { id: 5, title: "Código para Todos", category: "Educação", location: "Recife, PE", volunteers: 15, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800", description: "Bootcamps intensivos de desenvolvimento web para pessoas em transição de carreira, com foco em diversidade e inclusão no setor de TI." },
  { id: 6, title: "Horta Comunitária", category: "Meio Ambiente", location: "Porto Alegre, RS", volunteers: 10, image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800", description: "Transformação de terrenos baldios em hortas produtivas geridas pela própria comunidade, promovendo soberania alimentar e integração social." },
];

export default function ProjetoDetalhes() {
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Projeto não encontrado</h2>
        <Link to="/projetos" className="px-8 py-4 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-xs">
          Voltar para o Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/projetos" className="inline-flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Voltar para Projetos</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Image & Main Info */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[500px] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-10 left-10 bg-brand-purple/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <span className="text-xs font-black uppercase tracking-widest text-brand-orange">{project.category}</span>
              </div>
            </motion.div>

            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                  <MapPin className="w-5 h-5 text-brand-blue" />
                  <span className="text-xs font-black uppercase tracking-widest">{project.location}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                  <Calendar className="w-5 h-5 text-brand-orange" />
                  <span className="text-xs font-black uppercase tracking-widest">Iniciado em 2023</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-2xl text-white/70 font-light leading-relaxed">
                  {project.description}
                </p>
                <p className="text-lg text-white/50 font-light leading-relaxed mt-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 sticky top-32">
              <div className="space-y-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-6">Impacto Atual</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-3xl font-black text-white mb-1">{project.volunteers}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Voluntários</p>
                    </div>
                    <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-3xl font-black text-white mb-1">150+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Impactados</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full py-6 bg-white text-brand-purple rounded-full font-black uppercase tracking-widest text-sm hover:bg-brand-orange hover:text-white transition-all shadow-xl">
                    Quero ser Voluntário
                  </button>
                  <button className="w-full py-6 border border-white/10 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Heart className="w-5 h-5" />
                    Apoiar Projeto
                  </button>
                </div>

                <div className="pt-10 border-t border-white/5 flex justify-center gap-8">
                  <button className="text-white/40 hover:text-white transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button className="text-white/40 hover:text-white transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="text-white/40 hover:text-white transition-colors">
                    <Globe className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
