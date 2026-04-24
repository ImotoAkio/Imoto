import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Filter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMembers } from '../lib/api';

const Profiles: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      const data = await fetchMembers();
      setMembers(data);
      setIsLoading(false);
    };
    loadMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24"
    >
      <header className="py-16 md:py-24 border-b border-outline-variant/10 mb-16">
        <h1 className="text-5xl md:text-8xl font-noto-serif mb-8 tracking-tighter">
          Galeria de <span className="text-primary italic">Ancestrais</span>
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <p className="text-secondary max-w-xl text-lg leading-relaxed font-body">
            Um acervo biográfico dedicado a preservar as jornadas individuais que compõem o legado da família Imoto. Explore as histórias, conquistas e memórias de cada geração.
          </p>
          
          <div className="w-full md:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border-b-2 border-outline-variant/20 px-12 py-4 outline-none focus:border-primary transition-all font-noto-serif text-lg"
            />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/profile/${member.id}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-6 relative">
                  {member.profileImage ? (
                    <img 
                      src={member.profileImage} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                      alt={member.firstName} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary/20">
                      <User size={64} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-4 right-4 hanko-seal-small opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">井</div>
                  {member.isDeceased && (
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-secondary">
                      In Memoriam
                    </div>
                  )}
                </div>
                
                <h3 className="font-noto-serif text-2xl mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
                  {member.firstName} {member.lastName}
                  <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{member.generation}</span>
                  <span className="text-secondary/40 text-[10px]">•</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                    {member.birthYear || '?'} — {member.deathYear ? member.deathYear : (member.isDeceased ? 'Falecido' : 'Presente')}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      
      {!isLoading && filteredMembers.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed border-outline-variant/30">
          <p className="font-noto-serif text-xl text-secondary">Nenhum membro encontrado com este nome.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Profiles;
