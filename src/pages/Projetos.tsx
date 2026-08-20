import React, { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Globe, Search, Filter, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const DEFAULT_PROJECTS = [
  { id: 1, title: "Re-Verde Urbano", category: "Meio Ambiente", location: "São Paulo, SP", volunteers: 12, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", description: "O Re-Verde Urbano foca na revitalização de espaços públicos através do plantio de espécies nativas." },
  { id: 2, title: "EducaTech", category: "Educação", location: "Curitiba, PR", volunteers: 8, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", description: "Iniciativa que leva alfabetização digital e lógica de programação para jovens de escolas públicas." },
  { id: 3, title: "Cozinha Solidária", category: "Saúde", location: "Salvador, BA", volunteers: 25, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", description: "Combate à insegurança alimentar através da distribuição de refeições nutritivas." },
  { id: 4, title: "Arte na Praça", category: "Cultura", location: "Belo Horizonte, MG", volunteers: 5, image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800", description: "Promove a ocupação cultural de praças públicas com oficinas de arte e teatro de rua." },
  { id: 5, title: "Código para Todos", category: "Educação", location: "Recife, PE", volunteers: 15, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800", description: "Bootcamps intensivos de desenvolvimento web para pessoas em transição de carreira." },
  { id: 6, title: "Horta Comunitária", category: "Meio Ambiente", location: "Porto Alegre, RS", volunteers: 10, image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800", description: "Transformação de terrenos baldios em hortas produtivas geridas pela comunidade." },
  { id: 7, title: "Música no Parque", category: "Cultura", location: "Rio de Janeiro, RJ", volunteers: 20, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800", description: "Aulas de iniciação musical e concertos abertos em parques urbanos." },
  { id: 8, title: "Saúde Itinerante", category: "Saúde", location: "Manaus, AM", volunteers: 30, image: "https://images.unsplash.com/photo-1505751172107-573957a243b0?auto=format&fit=crop&q=80&w=800", description: "Atendimento preventivo e orientações de saúde para comunidades ribeirinhas." },
  { id: 9, title: "Tecnologia Social", category: "Inovação", location: "Florianópolis, SC", volunteers: 18, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", description: "Criação de soluções tecnológicas abertas para desafios de ONGs locais." },
  { id: 10, title: "Esporte para Vida", category: "Esporte", location: "Fortaleza, CE", volunteers: 14, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800", description: "Escolinhas de futebol e atletismo no contraturno escolar." },
  { id: 11, title: "Alfabetização Já", category: "Educação", location: "Belém, PA", volunteers: 22, image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800", description: "Apoio pedagógico individualizado e incentivo à leitura infantil." },
  { id: 12, title: "Oceano Limpo", category: "Meio Ambiente", location: "Natal, RN", volunteers: 40, image: "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?auto=format&fit=crop&q=80&w=800", description: "Mutirões de limpeza costeira e conscientização marinha." },
];

const ITEMS_PER_PAGE = 6;

export default function Projetos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [currentPage, setCurrentPage] = useState(1);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("iniciativa")
        .select("*")
        .eq("autorizada", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0 && !error) {
        // Formata os registros autorizados do banco
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.nome,
          category: item.setor_sociedade || "Impacto Social",
          location: item.cidade ? `${item.cidade}${item.uf ? `, ${item.uf}` : ""}` : "Brasil",
          volunteers: Math.floor(Math.random() * 15) + 5, // Estimativa dinâmica
          image: item.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
          description: item.impacto_iniciativa || item.proposito_iniciativa || "Iniciativa cadastrada na rede Animativa.",
          isFromDb: true,
        }));

        // Junta os do banco primeiro, depois os defaults
        setDbProjects(formatted);
      } else {
        setDbProjects([]);
      }
    } catch (err) {
      console.warn("Erro ao buscar projetos:", err);
      setDbProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const allProjects = useMemo(() => {
    // Combina dados do banco com defaults evitando duplicidade de títulos
    const dbTitles = new Set(dbProjects.map((p) => p.title.toLowerCase()));
    const remainingDefaults = DEFAULT_PROJECTS.filter(
      (p) => !dbTitles.has(p.title.toLowerCase())
    );
    return [...dbProjects, ...remainingDefaults];
  }, [dbProjects]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allProjects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["TODAS", ...Array.from(cats)];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === "TODAS" || project.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [allProjects, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Hero */}
        <div className="relative h-[320px] rounded-[3.5rem] overflow-hidden mb-12 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-purple/90 to-transparent" />
          <div className="relative h-full flex flex-col items-start justify-center p-10 md:p-14">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner">
              <Globe className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 text-white">
              Catálogo de Projetos
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-xl font-light">
              Descubra iniciativas que estão gerando transformação real e encontre sua próxima missão de impacto.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por nome, categoria ou cidade..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <Link 
              to="/iniciativas"
              className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-white hover:text-brand-purple text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Cadastrar Minha Iniciativa
            </Link>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Categorias:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3 text-white/60">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
            <span className="text-xs font-black uppercase tracking-widest">Carregando projetos...</span>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentProjects.map((project, i) => (
            <Link key={project.id} to={`/projetos/${project.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % ITEMS_PER_PAGE) * 0.08 }}
                whileHover={{ y: -8 }}
                className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand-orange/50 transition-all h-full flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute top-6 left-6 bg-brand-purple/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 pb-4">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 text-white group-hover:text-brand-orange transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-white/60">
                        <MapPin className="w-4 h-4 text-brand-blue" />
                        <span className="text-xs font-bold uppercase tracking-wider">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/60">
                        <Users className="w-4 h-4 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-wider">{project.volunteers} Voluntários Ativos</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <div className="w-full py-4 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs group-hover:bg-white group-hover:text-brand-purple transition-all flex items-center justify-center gap-2 text-white">
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[3rem] p-8 mb-16">
            <Globe className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
              Não encontramos projetos com os termos ou categorias selecionados. Tente ajustar os filtros.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("TODAS");
              }}
              className="px-6 py-3 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-xs"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed hover:border-brand-orange transition-colors text-white"
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
                      : "bg-white/5 border border-white/10 hover:border-white/30 text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed hover:border-brand-orange transition-colors text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
