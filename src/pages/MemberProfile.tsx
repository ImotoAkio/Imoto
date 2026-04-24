import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Share2, Link as LinkIcon, Calendar, MapPin, Loader2 } from 'lucide-react';
import { fetchMemberById } from '../lib/api';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      if (!id) return;
      const data = await fetchMemberById(id);
      if (!data) {
        navigate('/profiles');
        return;
      }
      setMember(data);
      setIsLoading(false);
    };
    loadMember();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24"
    >
      <Link to="/profiles" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mt-12 mb-8 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Voltar para Galeria
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column: Portrait & Stats */}
        <div className="lg:col-span-4 max-w-sm mx-auto lg:max-w-none w-full">
          <div className="sticky top-24">
            <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-8 relative border border-outline-variant/10 shadow-2xl">
              {member.profileImage ? (
                <img 
                  src={member.profileImage} 
                  className="w-full h-full object-cover grayscale" 
                  alt={`${member.firstName} ${member.lastName}`} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary/20">
                  <User size={80} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-4 right-4 hanko-seal">井</div>
              {member.isDeceased && (
                <div className="absolute bottom-6 left-6 bg-background/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary shadow-lg">
                  In Memoriam
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-l-2 border-primary pl-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Tempo de Vida</span>
                <p className="font-noto-serif text-lg">
                  {member.birthYear || '?'} — {member.deathYear ? member.deathYear : (member.isDeceased ? 'Falecido' : 'Presente')}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-primary pl-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Linhagem</span>
                <p className="font-noto-serif text-lg">{member.generation || 'Não informada'}</p>
              </div>
              {member.occupation && (
                <div className="flex flex-col gap-1 border-l-2 border-primary pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Ocupação / Papel</span>
                  <p className="font-noto-serif text-lg">{member.occupation}</p>
                </div>
              )}
            </div>

            <div className="mt-12 flex gap-4">
               <button className="flex-grow bg-primary text-on-primary py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container transition-colors">
                 Citar no Arquivo
               </button>
               <button className="p-4 bg-surface-container-low text-secondary hover:text-primary transition-colors border border-outline-variant/10">
                 <Share2 size={18} />
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Biography & Narrative */}
        <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-16 mt-8 lg:mt-0">
          <header>
            <h1 className="text-5xl md:text-8xl font-noto-serif mb-6 leading-tight tracking-tighter">
              {member.firstName} <span className="block italic text-primary">{member.lastName}</span>
            </h1>
            {member.shortQuote && (
              <p className="text-xl md:text-3xl text-on-surface-variant font-body leading-relaxed max-w-2xl italic opacity-80">
                "{member.shortQuote}"
              </p>
            )}
          </header>

          <section className="prose prose-stone max-w-none">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="font-noto-serif text-2xl m-0">Crônica Familiar</h3>
              <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            </div>
            
            <div className="text-on-surface-variant font-body text-xl leading-loose space-y-12 whitespace-pre-wrap">
              {member.biography ? (
                member.biography
              ) : (
                <p className="italic text-secondary/50">Esta biografia ainda está sendo transcrita dos arquivos da família.</p>
              )}
            </div>
          </section>

          {/* Lineage Info */}
          {(member.parents?.length > 0 || member.spouse || member.children?.length > 0) && (
            <section className="py-12 border-t border-outline-variant/20 mt-12">
              <h3 className="font-noto-serif text-2xl mb-8">Relações Diretas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {member.parents?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-4">Progenitores</span>
                    <ul className="space-y-4">
                      {member.parents.map((p: any) => (
                        <li key={p.id}>
                          <Link to={`/profile/${p.id}`} className="font-noto-serif text-lg hover:text-primary transition-colors flex items-baseline gap-2">
                            {p.firstName} {p.lastName} <ArrowLeft size={12} className="rotate-180 opacity-30" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {member.spouse && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-4">Cônjuge</span>
                    <Link to={`/profile/${member.spouse.id}`} className="font-noto-serif text-lg hover:text-primary transition-colors flex items-baseline gap-2">
                      {member.spouse.firstName} {member.spouse.lastName} <ArrowLeft size={12} className="rotate-180 opacity-30" />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MemberProfile;
