import { motion } from "motion/react";
import { Zap, Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";

const events = [
  { id: 1, title: "Workshop: Design de Impacto", date: "15 Abr", time: "19:00", location: "Online (Zoom)", type: "Workshop", image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Encontro Regional Sul", date: "22 Abr", time: "14:00", location: "Curitiba, PR", type: "Presencial", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Webinar: Captação de Recursos", date: "05 Mai", time: "18:30", location: "Online (YouTube)", type: "Webinar", image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Hackathon Social 2026", date: "12 Mai", time: "09:00", location: "São Paulo, SP", type: "Hackathon", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" },
];

export default function Eventos() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative h-[400px] rounded-[3.5rem] overflow-hidden mb-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-brand-purple/90 to-brand-purple" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 border border-white/20"
            >
              <Zap className="w-10 h-10 text-brand-orange" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Eventos & Workshops</h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-2xl">
              Conecte-se com a comunidade, aprenda novas ferramentas e fortaleça sua rede de impacto.
            </p>
          </div>
        </div>

        {/* Featured Event */}
        <div className="mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-orange mb-8">Próximo Grande Evento</h2>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="group relative h-[450px] rounded-[3.5rem] overflow-hidden bg-brand-purple border border-white/10 cursor-pointer shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-purple/80 to-transparent transition-all duration-500" />
            
            <div className="relative h-full p-14 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="px-4 py-2 bg-brand-orange text-white rounded-full text-[10px] font-black uppercase tracking-widest">Destaque</span>
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">12 de Maio, 2026</span>
                </div>
                <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Hackathon Social 2026</h3>
                <p className="text-2xl text-white/70 leading-tight font-light">
                  48 horas de <span className="text-white font-medium">inovação</span> colaborativa para resolver desafios reais de ONGs brasileiras.
                </p>
              </div>
              <button className="px-12 py-6 bg-brand-orange text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brand-purple transition-all shadow-2xl whitespace-nowrap flex items-center gap-3">
                Garantir Vaga
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-8">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-blue mb-4">Agenda Completa</h2>
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand-blue/50 transition-all p-8 md:p-12 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="w-full md:w-64 h-48 rounded-[2rem] overflow-hidden shrink-0">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-brand-orange">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{event.location}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-brand-blue transition-colors">{event.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">{event.type}</span>
                </div>
              </div>
              <button className="px-10 py-5 border border-white/10 rounded-full font-black uppercase tracking-widest text-xs group-hover:bg-brand-blue group-hover:text-white transition-all whitespace-nowrap">
                Inscrição Gratuita
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
