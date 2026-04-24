import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, BookOpen, PenTool, Calendar, ArrowRight, X } from 'lucide-react';

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
      // Drop cap for the first paragraph
      if (index === 0) {
        return (
          <p key={index} className="mb-8 text-xl leading-relaxed font-body text-on-surface-variant first-letter:text-7xl first-letter:font-noto-serif first-letter:mr-3 first-letter:float-left first-letter:text-primary first-letter:leading-none">
            {para}
          </p>
        );
      }

      // Every 4th paragraph, make it a pull quote or add a decorative break
      if (index % 4 === 0) {
        return (
          <div key={index} className="my-12 py-8 border-y border-outline-variant/30 relative">
             <Quote className="absolute -top-4 left-4 text-primary opacity-20" size={48} />
             <p className="text-2xl font-noto-serif italic text-primary leading-relaxed text-center px-8">
               {para}
             </p>
          </div>
        );
      }

      // Add a small divider every 6 paragraphs
      if (index % 6 === 0) {
        return (
          <React.Fragment key={index}>
            <div className="flex justify-center my-12 opacity-30">
              <div className="h-px w-24 bg-primary mx-2" />
              <div className="h-1 w-1 rounded-full bg-primary mx-1" />
              <div className="h-1 w-1 rounded-full bg-primary mx-1" />
              <div className="h-1 w-1 rounded-full bg-primary mx-1" />
              <div className="h-px w-24 bg-primary mx-2" />
            </div>
            <p className="mb-8 text-lg leading-relaxed font-body text-on-surface-variant">
              {para}
            </p>
          </React.Fragment>
        );
      }

      return (
        <p key={index} className="mb-8 text-lg leading-relaxed font-body text-on-surface-variant">
          {para}
        </p>
      );
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24 max-w-6xl mx-auto"
    >
      <header className="mt-16 mb-24 flex flex-col items-center text-center">
        <div className="hanko-seal mb-6">説</div>
        <h1 className="text-4xl md:text-6xl font-noto-serif mb-6 italic">Histórias & Memórias</h1>
        <p className="text-secondary max-w-2xl font-body text-lg leading-relaxed">
          "A história não é o que aconteceu, mas o que lembramos e como lembramos para contar aos outros."
        </p>
      </header>

      {/* Featured Stories */}
      <div className="space-y-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          stories.map((story, index) => (
            <article key={story.id} className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2 relative group">
                <div className="aspect-[4/3] overflow-hidden washi-texture relative bg-surface-container-low shadow-xl">
                  <img 
                    src={story.coverImage} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 cursor-pointer" 
                    alt={story.title}
                    onClick={() => setSelectedStory(story)}
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <div className="absolute -bottom-8 -right-8 md:-right-12 bg-primary text-on-primary p-6 shadow-2xl z-10">
                   <Quote size={32} className="opacity-50" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">
                  {story.tag}
                </span>
                <h2 className="text-3xl md:text-5xl font-noto-serif mb-6 leading-tight">
                  {story.title}
                </h2>
                <p className="text-on-surface-variant text-lg font-body leading-relaxed mb-8 italic border-l-2 border-primary/20 pl-6 py-2">
                  "{story.excerpt}"
                </p>
                <div className="flex items-center gap-6 mb-10 text-xs text-secondary font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <PenTool size={14} className="text-primary" />
                    {story.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    {formatDate(story.publishDate)}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStory(story)}
                  className="flex items-center gap-3 text-primary text-sm font-bold uppercase tracking-widest border-b border-primary pb-2 hover:gap-5 transition-all"
                >
                  Ler História Completa <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-surface/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-high w-full h-full max-w-5xl md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant relative washi-texture"
            >
              <div className="sticky top-0 right-0 w-full flex justify-end p-4 md:p-6 z-20 pointer-events-none">
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="bg-primary text-on-primary p-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all shadow-xl pointer-events-auto hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="px-8 md:px-24 pb-24 -mt-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                    {selectedStory.tag}
                  </span>
                  <h2 className="text-4xl md:text-7xl font-noto-serif mb-10 leading-tight">
                    {selectedStory.title}
                  </h2>
                  <div className="flex items-center gap-8 text-xs text-secondary font-bold uppercase tracking-widest pb-12 border-b border-outline-variant/30 w-full justify-center">
                    <div className="flex items-center gap-3">
                      <PenTool size={16} className="text-primary" />
                      {selectedStory.author}
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-primary" />
                      {formatDate(selectedStory.publishDate)}
                    </div>
                  </div>
                </div>
                
                <div className="w-full aspect-[21/9] mb-20 overflow-hidden shadow-2xl">
                   <img src={selectedStory.coverImage} className="w-full h-full object-cover grayscale brightness-75" alt={selectedStory.title} />
                </div>
                
                <div className="max-w-3xl mx-auto">
                  {renderStoryContent(selectedStory.content)}
                </div>
                
                <div className="mt-24 pt-12 border-t border-outline-variant/30 flex flex-col items-center text-center">
                  <div className="hanko-seal mb-8 opacity-40">完</div>
                  <p className="font-noto-serif italic text-secondary">Fim do Capítulo</p>
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="mt-12 bg-surface text-primary border border-primary px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                  >
                    Voltar para o Sumário
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contribute CTA */}
      <section className="mt-48 p-12 bg-[#1b1c1a] text-inverse-on-surface text-center relative overflow-hidden">
        <div className="relative z-10">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-8" />
          <h2 className="font-noto-serif text-3xl md:text-4xl mb-6">Guardamos o Futuro nas Nossas Lembranças</h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-10 font-body leading-relaxed">
            Você possui um relato, uma carta ou uma história oral que gostaria de digitalizar e compartilhar com a família?
          </p>
          <button className="bg-primary text-on-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-container transition-colors">
            Enviar Relato ao Arquivo
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="[writing-mode:vertical-rl] text-6xl md:text-8xl font-noto-serif flex h-full items-center justify-around w-full">
            <span>記憶</span>
            <span>家族</span>
            <span>歴史</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Stories;
