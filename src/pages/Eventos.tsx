import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  CalendarPlus,
  Users,
  Award,
  BookOpen,
  Loader2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface EventItem {
  id: number;
  title: string;
  date: string;
  fullDate: string;
  time: string;
  location: string;
  type: "Workshop" | "Presencial" | "Webinar" | "Hackathon" | string;
  image: string;
  description: string;
  even3Url: string;
  speakers?: string;
  spotsLeft: number;
  certificateHours: number;
}

const EVENTS: EventItem[] = [
  { 
    id: 1, 
    title: "Hackathon Social 2026", 
    date: "12 Mai", 
    fullDate: "12 de Maio de 2026",
    time: "09:00 - 18:00", 
    location: "São Paulo, SP (Hub de Inovação)", 
    type: "Hackathon", 
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description: "48 horas de inovação colaborativa para desenhar e prototipar soluções tecnológicas e de gestão para desafios reais de ONGs brasileiras.",
    even3Url: "https://www.even3.com.br/hackathon-social-animativa-2026",
    speakers: "Mentores de TI, Especialistas em Terceiro Setor e Lideranças Comunitárias",
    spotsLeft: 34,
    certificateHours: 20
  },
  { 
    id: 2, 
    title: "Workshop: Design de Impacto Social", 
    date: "15 Abr", 
    fullDate: "15 de Abril de 2026",
    time: "19:00 - 21:30", 
    location: "Online (Transmissão Even3 / Zoom)", 
    type: "Workshop", 
    image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=800",
    description: "Aprenda a aplicar metodologias ágeis e Design Thinking para estruturar projetos comunitários com foco em métricas de transformação sustentável.",
    even3Url: "https://www.even3.com.br/workshop-design-impacto-animativa",
    speakers: "Ana Paula Ribeiro (Consultora de Inovação Social)",
    spotsLeft: 18,
    certificateHours: 4
  },
  { 
    id: 3, 
    title: "Encontro Regional Sul de Voluntariado", 
    date: "22 Abr", 
    fullDate: "22 de Abril de 2026",
    time: "14:00 - 18:00", 
    location: "Curitiba, PR (Auditório Central)", 
    type: "Presencial", 
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    description: "Networking, troca de experiências e painéis sobre o futuro do voluntariado no Sul do país. Venha conhecer outros agentes de transformação.",
    even3Url: "https://www.even3.com.br/encontro-sul-animativa",
    speakers: "Painelistas de 6 iniciativas regionais",
    spotsLeft: 50,
    certificateHours: 6
  },
  { 
    id: 4, 
    title: "Webinar: Captação de Recursos e Leis de Incentivo", 
    date: "05 Mai", 
    fullDate: "05 de Maio de 2026",
    time: "18:30 - 20:30", 
    location: "Online (YouTube Ao Vivo + Even3)", 
    type: "Webinar", 
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
    description: "Desmistificando os editais públicos, doações corporativas com benefício fiscal (Fumcad, Rouanet, Esporte) e campanhas de financiamento coletivo.",
    even3Url: "https://www.even3.com.br/captacao-recursos-animativa",
    speakers: "Carlos Alberto Mendes (Especialista Jurídico do 3º Setor)",
    spotsLeft: 120,
    certificateHours: 3
  },
  { 
    id: 5, 
    title: "Oficina: Comunicação e Redes Sociais para ONGs", 
    date: "28 Mai", 
    fullDate: "28 de Maio de 2026",
    time: "19:00 - 21:00", 
    location: "Online (Even3 Live)", 
    type: "Workshop", 
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    description: "Como construir narrativas que engajam doadores e atraem voluntários qualificados usando estratégias orgânicas de conteúdo.",
    even3Url: "https://www.even3.com.br/comunicacao-ongs-animativa",
    speakers: "Mariana Souza (Estrategista de Marca e Conteúdo)",
    spotsLeft: 42,
    certificateHours: 3
  },
];

export default function Eventos() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>(EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("evento")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0 && !error) {
        const formatted: EventItem[] = data.map((item) => {
          const dateObj = item.data_inicio ? new Date(item.data_inicio) : new Date();
          const day = dateObj.getDate();
          const month = dateObj.toLocaleDateString("pt-BR", { month: "short" });
          const fullDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
          const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

          return {
            id: item.id,
            title: item.titulo || item.title || "Evento Animativa",
            date: `${day} ${month}`,
            fullDate: fullDate,
            time: `${time} - ${(Number(time.split(":")[0] || 19) + 2).toString().padStart(2, '0')}:00`,
            location: item.local || "Online (Even3 Live)",
            type: item.tipo || "Workshop",
            image: item.imagem_path || item.image || (item.tipo === "Presencial" 
              ? "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
              : "https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=800"),
            description: item.descricao || "Capacitação e encontro da rede Animativa.",
            even3Url: item.link_even3 || `https://www.even3.com.br/evento-${item.id}`,
            speakers: item.palestrantes || "Equipe e Parceiros Animativa",
            spotsLeft: item.vagas || 40,
            certificateHours: item.horas_certificado || 4
          };
        });

        // Merge DB events first, then defaults if unique
        const dbTitles = new Set(formatted.map(f => f.title.toLowerCase()));
        const remainingDefaults = EVENTS.filter(e => !dbTitles.has(e.title.toLowerCase()));
        setEventsList([...formatted, ...remainingDefaults]);
      } else {
        setEventsList(EVENTS);
      }
    } catch (err) {
      console.warn("Erro ao buscar eventos do Supabase:", err);
      setEventsList(EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const types = useMemo(() => {
    const setTypes = new Set<string>();
    eventsList.forEach(e => {
      if (e.type) setTypes.add(e.type);
    });
    return ["TODOS", ...Array.from(setTypes)];
  }, [eventsList]);

  const filteredEvents = useMemo(() => {
    return eventsList.filter((e) => {
      const matchesSearch = 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "TODOS" || e.type.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [eventsList, searchTerm, selectedType]);

  const handleRegisterEven3 = (event: EventItem) => {
    // Abre a página oficial Even3 do evento
    window.open(event.even3Url, "_blank", "noopener,noreferrer");
    setRegisteredEvents((prev) => [...new Set([...prev, event.id])]);
  };

  const handleAddToCalendar = (event: EventItem) => {
    const title = encodeURIComponent(`Animativa: ${event.title}`);
    const details = encodeURIComponent(`${event.description}\n\nInscrição & Link: ${event.even3Url}`);
    const location = encodeURIComponent(event.location);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-orange/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Hero */}
        <div className="relative h-[420px] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner"
            >
              <Zap className="w-10 h-10 text-brand-orange" />
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
              Eventos & Even3
            </h1>
            <p className="text-lg md:text-2xl font-light text-white/80 max-w-2xl">
              Capacitações, workshops e encontros com emissão oficial de certificados via plataforma Even3.
            </p>
          </div>
        </div>

        {/* Featured Big Event */}
        <div className="mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Grande Destaque da Temporada
          </h2>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="group relative rounded-[3.5rem] overflow-hidden bg-brand-purple border border-white/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-purple/85 to-transparent transition-all duration-500" />
            
            <div className="relative p-10 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 z-10">
              <div className="max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-brand-orange text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    Inscrições Abertas
                  </span>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-brand-orange" /> 12 de Maio de 2026
                  </span>
                  <span className="text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> 20h Certificado Even3
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  Hackathon Social Animativa 2026
                </h3>

                <p className="text-base md:text-lg text-white/80 leading-relaxed font-light">
                  48 horas de inovação colaborativa para resolver desafios de gestão, captação e tecnologia de ONGs brasileiras.
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-white/60 pt-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-blue" /> São Paulo, SP + Transmissão Online
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-orange" /> 34 Vagas Restantes
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button 
                  onClick={() => handleRegisterEven3(EVENTS[0])}
                  className="px-8 py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-purple transition-all shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Garantir Vaga no Even3
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleAddToCalendar(EVENTS[0])}
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4 text-brand-blue" />
                  Adicionar à Agenda
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar evento por título, local ou tema..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 focus:outline-none focus:border-brand-orange transition-colors text-sm text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Even3 Badge Info */}
            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white/70 shrink-0">
              <Award className="w-4 h-4 text-brand-orange" />
              <span>Certificados emitidos via <strong>Even3</strong></span>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Formato:
            </span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedType.toLowerCase() === type.toLowerCase()
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 gap-6 mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-blue mb-2">
            Agenda Completa de Eventos ({filteredEvents.length})
          </h2>

          {filteredEvents.map((event, i) => {
            const isRegistered = registeredEvents.includes(event.id);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand-blue/50 transition-all p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl"
              >
                <div className="w-full md:w-60 h-44 rounded-2xl overflow-hidden shrink-0 relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-3 left-3 bg-brand-purple/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange">
                    {event.type}
                  </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-brand-orange font-bold">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{event.fullDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white group-hover:text-brand-blue transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/40 uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1 text-green-400">
                      <Award className="w-3.5 h-3.5" /> Certificado de {event.certificateHours}h
                    </span>
                    <span>• {event.spotsLeft} vagas restantes</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                  <button 
                    onClick={() => handleRegisterEven3(event)}
                    className="px-6 py-3.5 bg-brand-orange hover:bg-white hover:text-brand-purple text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Inscrição Acessada
                      </>
                    ) : (
                      <>
                        Inscrever via Even3
                        <ExternalLink className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAddToCalendar(event)}
                    title="Adicionar ao Google Calendar"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-brand-blue" />
                    Salvar na Agenda
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Informative Even3 Banner */}
        <div className="bg-gradient-to-r from-brand-blue/20 via-brand-purple to-brand-orange/20 border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">
              Quer organizar um evento ou workshop na Animativa?
            </h3>
            <p className="text-xs text-white/70 max-w-xl leading-relaxed">
              Disponibilizamos nossa plataforma, gestão de ingressos pelo Even3 e rede de voluntários para viabilizar encontros de impacto.
            </p>
          </div>
          <a
            href="mailto:eventos@animativa.org.br?subject=Proposta%20de%20Evento%20ou%20Workshop"
            className="px-8 py-4 bg-white text-brand-purple hover:bg-brand-orange hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shrink-0"
          >
            Submeter Proposta de Evento
          </a>
        </div>

      </div>
    </div>
  );
}
