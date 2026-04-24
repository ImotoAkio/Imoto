import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Ship, MapPin, GraduationCap, Building2, Loader2, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  iconName: string;
  location: string;
}

const IconMap: { [key: string]: React.ReactNode } = {
  Building2: <Building2 className="text-primary" />,
  Ship: <Ship className="text-primary" />,
  MapPin: <MapPin className="text-primary" />,
  GraduationCap: <GraduationCap className="text-primary" />,
  Anchor: <Anchor className="text-primary" />,
};

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Falha ao carregar eventos');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Erro ao carregar linha do tempo:', error);
      }
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24 max-w-5xl mx-auto"
    >
      <header className="mt-16 mb-24 text-center">
        <div className="hanko-seal mb-6 mx-auto">紀</div>
        <h1 className="text-4xl md:text-6xl font-noto-serif mb-6">Linha do Tempo</h1>
        <p className="text-secondary max-w-xl mx-auto font-body leading-relaxed">
          Nossa jornada através de dois continentes e um século de história, gravada na memória e no trabalho.
        </p>
      </header>

      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : events.length > 0 ? (
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-outline-variant/30"></div>

          <div className="space-y-24">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Year Marker */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-sm md:text-base bg-background z-10 border-2 border-primary/20 font-noto-serif text-primary font-bold">
                  {event.year.toString().slice(-2)}
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-1/2 px-2 md:px-12 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="flex flex-col gap-2">
                    <span className="text-primary font-noto-serif text-3xl italic">{event.year}</span>
                    <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="p-2 bg-surface-container rounded-full">
                        {IconMap[event.iconName] || <Clock className="text-primary" />}
                      </div>
                      <h3 className="font-noto-serif text-2xl font-bold">{event.title}</h3>
                    </div>
                    <p className="text-on-surface-variant font-body leading-relaxed text-sm">
                      {event.description}
                    </p>
                    <div className={`flex items-center gap-2 mt-4 text-[10px] uppercase tracking-widest text-secondary font-bold ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                       <MapPin size={12} className="text-primary/50" />
                       {event.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant bg-surface-container-lowest/30 p-12 text-center">
          <Clock size={48} className="text-outline mb-6" />
          <h3 className="text-2xl font-noto-serif mb-2">Aguardando Eventos</h3>
          <p className="text-secondary mb-8 text-center max-w-sm">
            Nenhum evento histórico foi encontrado no banco de dados.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Timeline;
