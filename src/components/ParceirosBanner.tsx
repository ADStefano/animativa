import React, { useState, useEffect } from "react";
import { Users, Globe, Shield, Heart, Handshake, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";

interface PartnerItem {
  id: number;
  nome: string;
  link?: string;
  tipo?: "PARCEIRO" | "APOIADOR" | "PATROCINADOR" | string;
  foto_parceiro?: string;
}

const DEFAULT_PARTNERS: PartnerItem[] = [
  { id: 1, nome: "SocioImpacto", tipo: "PARCEIRO", link: "https://socioimpacto.org" },
  { id: 2, nome: "INSTITUTO REGENERA", tipo: "APOIADOR", link: "https://institutoregenera.org" },
  { id: 3, nome: "Coletivo Vivo", tipo: "PARCEIRO", link: "https://coletivovivo.org" },
  { id: 4, nome: "Rede Ativa", tipo: "APOIADOR", link: "https://redeativa.org" },
  { id: 5, nome: "MudaMundo", tipo: "PATROCINADOR", link: "https://mudamundo.org" },
];

export default function ParceirosBanner() {
  const [partners, setPartners] = useState<PartnerItem[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("parceiro")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0 && !error) {
        setPartners(data);
      }
    } catch (err) {
      console.warn("Usando parceiros padrão:", err);
    }
  };

  return (
    <section className="bg-white py-12 border-t border-gray-100 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-brand-purple/40 mb-8">
          Parceiros & Apoiadores Coletivos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {partners.map((partner) => {
            const hasLogo = Boolean(partner.foto_parceiro && partner.foto_parceiro.trim().length > 0);
            
            const content = (
              <div 
                key={partner.id}
                className="flex items-center gap-2 group transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer"
                title={`${partner.nome} (${partner.tipo || 'Parceiro'})`}
              >
                {hasLogo ? (
                  <img 
                    src={partner.foto_parceiro} 
                    alt={partner.nome} 
                    className="h-8 max-w-[140px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex items-center gap-2 select-none">
                    <Handshake className="w-5 h-5 text-brand-purple group-hover:text-brand-orange transition-colors" />
                    <span className="font-black text-brand-purple tracking-tight text-base md:text-lg group-hover:text-brand-orange transition-colors">
                      {partner.nome}
                    </span>
                    {partner.tipo && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-brand-purple/40 group-hover:text-brand-blue transition-colors">
                        • {partner.tipo}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );

            if (partner.link && partner.link !== "#") {
              return (
                <a 
                  key={partner.id} 
                  href={partner.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform"
                >
                  {content}
                </a>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
}
