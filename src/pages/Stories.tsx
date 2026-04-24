import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, BookOpen, PenTool, Calendar, ArrowRight, X, Clock, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import CollaborationModal from '../components/CollaborationModal';

interface Story {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  publishDate: string;
}

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [collabType, setCollabType] = useState('HISTORIA');

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar histórias:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const renderStoryContent = (content: string) => {
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((para, index) => {
      if (index === 0) {
        return (
          <p key={index} className="mb-8 text-xl leading-relaxed font-noto-serif text-on-surface-variant first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary first-letter:leading-none">
            {para}
          </p>
        );
      }

      if (index === 2 && paragraphs.length > 3) {
        return (
          <div key={index} className="my-16 py-12 border-y border-outline-variant/20 relative bg-surface-container-lowest rounded-[40px] px-8 md:px-16 shadow-inner">
             <Quote className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary opacity-20" size={64} />
             <p className="text-2xl md:text-3xl font-noto-serif italic text-primary leading-relaxed text-center font-medium">
               {para}
             </p>
          </div>
        );
      }

      return (
        <p key={index} className="mb-8 text-lg leading-relaxed font-noto-serif text-on-surface-variant opacity-90">
          {para}
        </p>
      );
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24 max-w-7xl mx-auto"
    >
      <header className="mt-16 mb-24 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="hanko-seal mb-8 scale-150 border-primary/20"
        >説</motion.div>
        <h1 className="text-5xl md:text-8xl font-noto-serif mb-8 font-bold tracking-tight">
          Histórias <span className="text-primary italic">&</span> Memórias
        </h1>
        <p className="text-secondary max-w-2xl font-noto-serif text-xl leading-relaxed italic opacity-70">
          "A preservação do passado é o alicerce do nosso futuro. Cada relato é um fio na tapeçaria da família Imoto."
        </p>
      </header>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-noto-serif italic text-primary animate-pulse">Consultando os arquivos...</p>
          </div>
        ) : (
          stories.map((story, index) => (
            <motion.article 
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col bg-surface-container-lowest rounded-[48px] overflow-hidden border border-outline/5 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div 
                className="aspect-[16/10] overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <img 
                  src={story.coverImage} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110" 
                  alt={story.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                  {story.tag}
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-6">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary">
                      <Clock size={12} className="text-primary" />
                      {formatDate(story.publishDate)}
                   </div>
                   <div className="h-px w-8 bg-outline/20"></div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary">
                      <PenTool size={12} className="text-primary" />
                      {story.author}
                   </div>
                </div>

                <h2 className="text-3xl font-noto-serif mb-6 leading-tight font-bold group-hover:text-primary transition-colors">
                  {story.title}
                </h2>
                
                <p className="text-on-surface-variant text-lg font-noto-serif leading-relaxed mb-10 italic opacity-80 line-clamp-3">
                  "{story.excerpt}"
                </p>
                
                <button 
                  onClick={() => setSelectedStory(story)}
                  className="mt-auto flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] group/btn transition-all"
                >
                  Abrir Relato Completo 
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-all">
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white w-full h-full max-w-6xl md:h-[90vh] overflow-y-auto shadow-2xl md:rounded-[60px] border border-outline/10 relative z-10 flex flex-col scrollbar-hide"
            >
              {/* Header Image */}
              <div className="w-full aspect-[21/9] relative shrink-0">
                <img 
                  src={selectedStory.coverImage} 
                  className="w-full h-full object-cover grayscale brightness-[0.4]" 
                  alt={selectedStory.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-8 right-8 bg-white/20 hover:bg-white/40 backdrop-blur-xl text-white p-4 rounded-full transition-all z-20 group"
                >
                  <X size={28} className="group-hover:rotate-90 transition-transform" />
                </button>

                <div className="absolute bottom-0 left-0 w-full px-8 md:px-24">
                   <div className="bg-primary/20 backdrop-blur px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg inline-block mb-6">
                      {selectedStory.tag}
                   </div>
                   <h2 className="text-4xl md:text-7xl font-noto-serif mb-8 leading-[1.1] font-bold text-on-background">
                    {selectedStory.title}
                  </h2>
                </div>
              </div>
              
              <div className="px-8 md:px-24 py-12">
                <div className="flex flex-wrap items-center gap-10 text-xs text-secondary font-black uppercase tracking-widest pb-12 border-b border-outline-variant/10 mb-16">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                       <PenTool size={18} className="text-primary" />
                    </div>
                    <div>
                       <span className="opacity-40 block mb-1">Autor</span>
                       {selectedStory.author}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                       <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                       <span className="opacity-40 block mb-1">Publicado em</span>
                       {formatDate(selectedStory.publishDate)}
                    </div>
                  </div>
                </div>
                
                <div className="max-w-4xl mx-auto pb-32">
                  {renderStoryContent(selectedStory.content)}
                  
                  <div className="mt-32 pt-20 border-t border-outline-variant/10 flex flex-col items-center text-center">
                    {/* Disclaimer and Correction Button */}
                    <div className="max-w-2xl mb-16 p-8 rounded-[32px] bg-surface-container-low border border-outline/10 flex flex-col items-center">
                      <div className="flex items-center gap-3 text-primary mb-4">
                        <AlertCircle size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nota de Preservação Histórica</span>
                      </div>
                      <p className="text-secondary text-sm font-noto-serif italic leading-relaxed mb-8 opacity-80">
                        "As histórias foram escritas com base em tradições orais e análise de documentos, podendo conter imprecisões ou erros de datação."
                      </p>
                      <button 
                        onClick={() => {
                          setCollabType('CORRECAO');
                          setIsCorrectionOpen(true);
                        }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all group"
                      >
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        Sugerir Correção
                      </button>
                    </div>

                    <div className="hanko-seal mb-10 scale-150 border-primary/10 opacity-30">完</div>
                    <p className="font-noto-serif italic text-secondary text-xl opacity-50 mb-12">Fim do Relato</p>
                    <button 
                      onClick={() => setSelectedStory(null)}
                      className="bg-primary text-on-primary px-16 py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-primary-container hover:shadow-2xl transition-all shadow-xl"
                    >
                      Voltar para o Sumário
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CollaborationModal 
        isOpen={isCorrectionOpen} 
        onClose={() => setIsCorrectionOpen(false)} 
        initialType={collabType}
      />

      {/* Contribute CTA */}
      <section className="mt-48 rounded-[60px] p-16 md:p-24 bg-[#1b1c1a] text-inverse-on-surface text-center relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-10 border border-primary/30">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-noto-serif text-4xl md:text-6xl mb-8 font-bold leading-tight">Guardamos o Futuro nas Nossas Lembranças</h2>
          <p className="text-stone-400 text-xl mb-12 font-noto-serif italic opacity-70 leading-relaxed">
            "A história de uma família não se faz apenas de grandes eventos, mas das pequenas memórias guardadas no coração de cada um."
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => {
                setCollabType('HISTORIA');
                setIsCorrectionOpen(true);
              }}
              className="w-full md:w-auto bg-primary text-on-primary px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-primary-container transition-all shadow-xl hover:-translate-y-1"
            >
              Contribuir com o Arquivo
            </button>
            <div className="flex items-center gap-4 px-6 text-stone-500 italic font-noto-serif">
               <MapPin size={18} className="text-primary/50" />
               Preservando o Legado Imoto
            </div>
          </div>
        </div>
        
        {/* Decorative Background Text */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center overflow-hidden">
           <div className="text-[20vw] font-black uppercase tracking-tighter whitespace-nowrap rotate-[-5deg]">
              LEGADO · MEMÓRIA · HISTÓRIA · IMOTO
           </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Stories;
