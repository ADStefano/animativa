import React from "react";
import { motion } from "motion/react";
import { 
  History, 
  Users, 
  PlayCircle, 
  BookOpen, 
  Image as ImageIcon,
  ArrowRight,
  Quote,
  Heart,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  Sparkles,
  Smile,
  ShieldCheck,
  Zap
} from "lucide-react";

interface TeamMemberProps {
  key?: React.Key;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TeamMember = ({ name, role, bio, image }: TeamMemberProps) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl -mr-16 -mt-16 group-hover:bg-brand-orange/20 transition-all" />
    <div className="relative z-10">
      <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 border-2 border-brand-orange/30">
        <img src={image} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{name}</h3>
      <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">{role}</p>
      <p className="text-sm text-white/60 leading-relaxed">{bio}</p>
    </div>
  </motion.div>
);

export default function QuemSomos() {
  const team = [
    {
      name: "Ana Oliveira",
      role: "Fundadora & Diretora Criativa",
      bio: "Apaixonada por impacto social e design, Ana fundou a Animativa com o sonho de conectar talentos a causas urgentes.",
      image: "https://picsum.photos/seed/ana/400/400"
    },
    {
      name: "Carlos Mendes",
      role: "Coordenador de Projetos",
      bio: "Especialista em gestão do terceiro setor, Carlos garante que cada iniciativa alcance seu potencial máximo de transformação.",
      image: "https://picsum.photos/seed/carlos/400/400"
    },
    {
      name: "Marina Souza",
      role: "Líder de Comunidade",
      bio: "Marina é a ponte entre nossos voluntários e as necessidades reais das comunidades que atendemos.",
      image: "https://picsum.photos/seed/marina/400/400"
    }
  ];

  const photos = [
    "https://picsum.photos/seed/animativa1/800/600",
    "https://picsum.photos/seed/animativa2/800/600",
    "https://picsum.photos/seed/animativa3/800/600",
    "https://picsum.photos/seed/animativa4/800/600",
    "https://picsum.photos/seed/animativa5/800/600",
    "https://picsum.photos/seed/animativa6/800/600"
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-orange/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/20 blur-[150px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-8">
              Nossa Essência
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Quem <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">Somos</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/60 font-medium leading-relaxed">
              A Animativa é um ecossistema de transformação social que utiliza a criatividade e a colaboração para regenerar comunidades e potencializar iniciativas de impacto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Histórico Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 flex items-center justify-center">
                  <History className="w-6 h-6 text-brand-orange" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Nossa História</h2>
              </div>
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Nascemos em 2018 com a convicção de que a mudança real acontece quando unimos propósito e ação. O que começou como um pequeno coletivo de designers e ativistas em São Paulo, rapidamente se transformou em uma rede nacional.
                </p>
                <p>
                  Ao longo dos anos, desenvolvemos metodologias próprias de intervenção urbana e facilitação comunitária, sempre colocando as pessoas no centro de cada decisão.
                </p>
                <p>
                  Hoje, a Animativa é referência em inovação social, tendo impactado diretamente mais de 50 comunidades e mobilizado milhares de voluntários em todo o Brasil.
                </p>
              </div>
            </motion.div>
            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/10">
                <img src="https://picsum.photos/seed/history/800/800" alt="Histórico Animativa" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-brand-orange p-10 rounded-[3rem] hidden md:block">
                <p className="text-5xl font-black tracking-tighter leading-none">08</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2">Anos de Impacto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-purple blur-[150px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-blue blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-4 block">O que nos guia</span>
            <h2 className="text-5xl font-black uppercase tracking-tighter">Nossos Valores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Colaboração",
                desc: "Valorizar a colaboração como uma força motriz para a criação de soluções significativas e a transformação social.",
                icon: Users,
                color: "text-brand-orange",
                bg: "bg-brand-orange/10"
              },
              {
                title: "Amor e Compaixão",
                desc: "Promover o amor e a compaixão como guias para as ações e relações, visando criar um ambiente mais amoroso e solidário.",
                icon: Heart,
                color: "text-brand-orange",
                bg: "bg-brand-orange/10"
              },
              {
                title: "Empatia",
                desc: "Cultivar a empatia como um princípio fundamental para compreender as necessidades e perspectivas dos outros e promover a compreensão mútua.",
                icon: Smile,
                color: "text-brand-blue",
                bg: "bg-brand-blue/10"
              },
              {
                title: "Aprendizado Contínuo",
                desc: "Valorizar a aprendizagem contínua, a criatividade e a busca constante por conhecimento, inovação e aprimoramento.",
                icon: Lightbulb,
                color: "text-brand-blue",
                bg: "bg-brand-blue/10"
              },
              {
                title: "Diálogo e Respeito",
                desc: "Promover um ambiente de diálogo e respeito mútuo, reconhecendo, acolhendo e valorizando as perspectivas e diferenças individuais.",
                icon: MessageCircle,
                color: "text-brand-orange",
                bg: "bg-brand-orange/10"
              },
              {
                title: "Paz",
                desc: "Buscar ativamente a construção de uma cultura de paz, resolvendo conflitos de maneira pacífica e promovendo a comunicação compassiva.",
                icon: ShieldCheck,
                color: "text-brand-blue",
                bg: "bg-brand-blue/10"
              },
              {
                title: "Desenvolvimento Pessoal",
                desc: "Apoiar o crescimento e o desenvolvimento pessoal de cada membro do grupo, incentivando a autorreflexão e a autodescoberta.",
                icon: TrendingUp,
                color: "text-brand-orange",
                bg: "bg-brand-orange/10"
              },
              {
                title: "Espiritualidade",
                desc: "Abraçar a busca pela espiritualidade como uma jornada pessoal de conexão com o significado mais profundo da vida e o reconhecimento da interconexão de todas as coisas.",
                icon: Sparkles,
                color: "text-brand-blue",
                bg: "bg-brand-blue/10"
              }
            ].map((valor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${valor.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <valor.icon className={`w-7 h-7 ${valor.color}`} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{valor.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{valor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Vídeo Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Manifesto Animativa</h2>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black">Assista ao nosso chamado para a ação</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video max-w-5xl mx-auto rounded-[3.5rem] overflow-hidden group cursor-pointer border border-white/10"
          >
            <img src="https://picsum.photos/seed/animativa-manifesto-cover/1280/720" alt="Manifesto Animativa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-500">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bios Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-blue" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Nosso Time</h2>
              </div>
              <p className="text-white/40 text-sm font-medium">As mentes e corações por trás da Animativa.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <TeamMember 
                key={i} 
                name={member.name} 
                role={member.role} 
                bio={member.bio} 
                image={member.image} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Revista Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-orange to-brand-purple rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <BookOpen className="w-8 h-8 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Publicação Semestral</span>
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                  Revista <br />
                  Animativa #01
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-md">
                  Edição 1 | Dezembro 2025: O Poder da Cooperação, Expansão de Rede e Novos Horizontes, Mente Saudável, Empresa Forte.
                </p>
                <button className="flex items-center gap-3 bg-white text-brand-purple px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-brand-blue hover:text-white transition-all transform hover:scale-105">
                  Ler Revista Digital
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <div className="aspect-[3/4] bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/seed/animativa-magazine-01/600/800" alt="Revista Animativa Edição 1" className="w-full h-full object-cover rounded-2xl shadow-2xl" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Álbum de Fotos Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white/40" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Álbum de Fotos</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {photos.map((photo, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-3xl overflow-hidden border border-white/10 aspect-square ${
                  i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto" : ""
                }`}
              >
                <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Quote className="w-12 h-12 text-brand-orange mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-8">
            "Não estamos apenas construindo projetos, estamos tecendo o futuro de comunidades inteiras através da empatia e do design."
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Manifesto Animativa</p>
        </div>
      </section>
    </div>
  );
}
