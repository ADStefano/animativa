import { motion } from "motion/react";
import { Globe, Search, Filter, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const projects = [
  { id: 1, title: "Re-Verde Urbano", category: "Meio Ambiente", location: "São Paulo, SP", volunteers: 12, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "EducaTech", category: "Educação", location: "Curitiba, PR", volunteers: 8, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Cozinha Solidária", category: "Saúde", location: "Salvador, BA", volunteers: 25, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Arte na Praça", category: "Cultura", location: "Belo Horizonte, MG", volunteers: 5, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "Código para Todos", category: "Educação", location: "Recife, PE", volunteers: 15, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Horta Comunitária", category: "Meio Ambiente", location: "Porto Alegre, RS", volunteers: 10, image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800" },
  { id: 7, title: "Música no Parque", category: "Cultura", location: "Rio de Janeiro, RJ", volunteers: 20, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" },
  { id: 8, title: "Saúde Itinerante", category: "Saúde", location: "Manaus, AM", volunteers: 30, image: "https://images.unsplash.com/photo-1505751172107-573957a243b0?auto=format&fit=crop&q=80&w=800" },
  { id: 9, title: "Tecnologia Social", category: "Inovação", location: "Florianópolis, SC", volunteers: 18, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" },
  { id: 10, title: "Esporte para Vida", category: "Esporte", location: "Fortaleza, CE", volunteers: 14, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800" },
  { id: 11, title: "Alfabetização Já", category: "Educação", location: "Belém, PA", volunteers: 22, image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800" },
  { id: 12, title: "Oceano Limpo", category: "Meio Ambiente", location: "Natal, RN", volunteers: 40, image: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?auto=format&fit=crop&q=80&w=800" },
  { id: 13, title: "Teatro na Escola", category: "Cultura", location: "Vitória, ES", volunteers: 7, image: "https://images.unsplash.com/photo-1503095396549-807a8bc36675?auto=format&fit=crop&q=80&w=800" },
  { id: 14, title: "Inclusão Digital", category: "Educação", location: "Goiânia, GO", volunteers: 11, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800" },
  { id: 15, title: "Sustentabilidade Rural", category: "Meio Ambiente", location: "Campo Grande, MS", volunteers: 9, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" },
];

const ITEMS_PER_PAGE = 6;

export default function Projetos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative h-[300px] rounded-[3.5rem] overflow-hidden mb-12">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-purple/90 to-transparent" />
          <div className="relative h-full flex flex-col items-start justify-center p-12">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">Catálogo de Projetos</h1>
            <p className="text-lg text-white/60 max-w-xl">
              Descubra iniciativas que estão mudando o mundo e encontre a sua próxima missão.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-brand-orange transition-colors"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 hover:border-brand-blue transition-colors">
            <Filter className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Filtros</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentProjects.map((project, i) => (
            <Link key={project.id} to={`/projetos/${project.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % ITEMS_PER_PAGE) * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand-orange/50 transition-all h-full"
              >
                <div className="relative h-60 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6 bg-brand-purple/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">{project.category}</span>
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-brand-orange transition-colors">{project.title}</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-white/50">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/50">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">{project.volunteers} Voluntários Ativos</span>
                    </div>
                  </div>
                  <div className="w-full py-4 border border-white/10 rounded-xl font-black uppercase tracking-widest text-xs group-hover:bg-white group-hover:text-brand-purple transition-all flex items-center justify-center gap-2">
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed hover:border-brand-orange transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
                    currentPage === page 
                      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                      : "bg-white/5 border border-white/10 hover:border-white/30"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed hover:border-brand-orange transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
