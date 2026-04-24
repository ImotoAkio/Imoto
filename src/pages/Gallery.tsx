import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Camera, 
  Info, 
  FolderOpen, 
  Loader2, 
  X, 
  Download, 
  Maximize2, 
  Calendar, 
  MapPin, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Languages,
  Users,
  ExternalLink
} from 'lucide-react';
import { formatDriveEmbedUrl, getDriveThumbnailUrl, formatDriveImageUrl } from '../utils/mediaUtils';

interface GalleryItem {
  id: string;
  type: 'PHOTO' | 'DOCUMENT';
  title: string;
  meta: string;
  image: string;
  category: string;
  span: string;
  context: string;
  year: string;
  location: string;
  originalText?: string;
  translationText?: string;
  citations: any[];
}

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/artifacts');
        if (!response.ok) throw new Error('Falha ao buscar dados do banco');
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Filter to only include PHOTO type and exclude PDF files
          const mappedItems: GalleryItem[] = data
            .filter((item: any) => item.type === 'PHOTO' && !item.mediaUrl?.toLowerCase().endsWith('.pdf'))
            .map((item: any, index: number) => {
            return {
              id: item.id,
              type: item.type,
              title: item.title || 'Sem Título',
              meta: `${item.location || 'Desconhecido'}, ${item.year || 'S/D'}`,
              image: item.mediaUrl,
              category: item.category || 'Família',
              year: item.year || 'S/D',
              location: item.location || 'Desconhecido',
              context: item.contextDescription || '',
              originalText: item.originalText,
              translationText: item.translationText,
              citations: item.citations || [],
              span: index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
            };
          });
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const filters = ['Todos', 'Civis e Pessoais', 'Família e Relações', 'Patrimônio e Negócios', 'Impostos e Burocracia'];

  const filteredItems = items
    .filter(i => {
      if (activeFilter === 'Todos') return true;
      return (i.category || '').toLowerCase() === activeFilter.toLowerCase();
    })
    .filter(i => 
      (i.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (i.meta || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, filteredItems]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24"
    >
      <header className="mt-16 mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-noto-serif mb-4 italic">Galeria Digital</h1>
          <p className="text-secondary max-w-md font-body leading-relaxed">
            Explorar o acervo vivo de fotografias, cartas e documentos históricos que sustentam a memória da família Imoto.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar registro..."
              className="pl-10 pr-4 py-2 bg-surface-container-low border-b border-outline-variant/30 outline-none focus:border-primary transition-colors text-sm font-noto-serif"
            />
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex gap-4 md:flex-wrap mb-16 pb-4 border-b border-surface-container-low overflow-x-auto whitespace-nowrap scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-3 transition-all duration-300 relative ${
              activeFilter === filter 
                ? 'text-primary' 
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            {filter}
            {activeFilter === filter && (
               <motion.div layoutId="filter-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Acessando Arquivos...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(item)}
                className={`relative overflow-hidden group washi-texture bg-surface-container-low cursor-pointer border border-outline-variant/10 ${item.span}`}
              >
                <img 
                  src={getDriveThumbnailUrl(item.image, 'w600') || item.image} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
                  alt={item.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Maximize2 size={32} className="text-on-primary scale-50 group-hover:scale-100 transition-transform duration-500" />
                </div>
                
                {/* Indicators */}
                <div className="absolute bottom-4 left-4 p-2 bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-3">
                      {item.citations.length > 0 && <Users size={12} className="text-primary" />}
                      {(item.originalText || item.translationText) && <Languages size={12} className="text-primary" />}
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <FolderOpen size={48} className="text-outline mb-6 opacity-30" />
          <h3 className="text-2xl font-noto-serif mb-2 italic">Nenhum registro encontrado</h3>
          <p className="text-secondary max-w-sm mb-8 font-body">
            Não encontramos arquivos para os critérios buscados. Tente outro filtro ou termo de pesquisa.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-on-background/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-background w-full h-full max-w-7xl flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] relative washi-texture overflow-hidden"
            >
              {/* Media Area */}
              <div className="w-full md:w-3/5 lg:w-2/3 h-1/2 md:h-full bg-surface-container-lowest flex items-center justify-center p-4 md:p-12 relative overflow-hidden group/viewer">
                {/* Navigation Buttons */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-primary opacity-0 group-hover/viewer:opacity-100 transition-all hover:bg-surface-container rounded-full"
                >
                  <ChevronLeft size={48} strokeWidth={1} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-primary opacity-0 group-hover/viewer:opacity-100 transition-all hover:bg-surface-container rounded-full"
                >
                  <ChevronRight size={48} strokeWidth={1} />
                </button>

                <div className="relative max-w-full max-h-full group/image">
                  <img 
                    key={selectedItem.id}
                    src={formatDriveImageUrl(selectedItem.image)} 
                    className="max-w-full max-h-[80vh] object-contain shadow-2xl transition-all duration-1000" 
                    alt={selectedItem.title} 
                  />
                  
                  {/* Face Tagging Overlays */}
                  {selectedItem.citations.filter((c: any) => c.x !== null).map((tag: any, i: number) => (
                    <motion.div
                      key={tag.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      style={{ 
                        left: `${tag.x}%`, 
                        top: `${tag.y}%`, 
                        width: `${tag.width}%`, 
                        height: `${tag.height}%` 
                      }}
                      className="absolute border border-primary/40 bg-primary/5 hover:bg-primary/20 hover:border-primary transition-all group/tag cursor-help z-20"
                    >
                       <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full opacity-0 group-hover/tag:opacity-100 transition-all whitespace-nowrap shadow-xl pointer-events-none">
                          {tag.member.firstName} {tag.member.lastName}
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Info Area */}
              <div className="w-full md:w-2/5 lg:w-1/3 h-1/2 md:h-full bg-background p-8 md:p-16 flex flex-col overflow-y-auto border-l border-outline-variant/10 relative z-10">
                <div className="flex justify-between items-start mb-12">
                   <div className="hanko-seal">鑑</div>
                   <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-3 hover:bg-surface-container-low transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-12">
                  <header>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 block">{selectedItem.category}</span>
                    <h2 className="text-3xl md:text-4xl font-noto-serif leading-tight italic">{selectedItem.title}</h2>
                  </header>

                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-outline-variant/10">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">Ano de Origem</span>
                       <div className="flex items-center gap-2 text-sm font-noto-serif">
                          <Calendar size={14} className="text-primary" /> {selectedItem.year}
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">Localização</span>
                       <div className="flex items-center gap-2 text-sm font-noto-serif">
                          <MapPin size={14} className="text-primary" /> {selectedItem.location}
                       </div>
                    </div>
                  </div>

                  {/* Translations & Content */}
                  {(selectedItem.originalText || selectedItem.translationText) ? (
                    <div className="space-y-8">
                       {selectedItem.originalText && (
                          <div>
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                                <Languages size={12} /> Texto Original
                             </h4>
                             <p className="text-sm font-noto-serif leading-relaxed italic bg-surface-container-low p-4 border-l-2 border-primary/30">
                                {selectedItem.originalText}
                             </p>
                          </div>
                       )}
                       {selectedItem.translationText && (
                          <div>
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                                <Languages size={12} /> Tradução / Conteúdo
                             </h4>
                             <p className="text-sm font-body leading-relaxed text-secondary">
                                {selectedItem.translationText}
                             </p>
                          </div>
                       )}
                    </div>
                  ) : (
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                          <Info size={12} /> Contexto do Arquivo
                       </h4>
                       <p className="text-on-surface-variant font-body leading-relaxed text-sm italic">
                          "{selectedItem.context || 'Nenhuma descrição detalhada disponível para este registro.'}"
                       </p>
                    </div>
                  )}

                  {/* Citations */}
                  {selectedItem.citations.length > 0 && (
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                           <Users size={12} /> Pessoas Citadas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {selectedItem.citations.map((c: any) => (
                              <div key={c.id} className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-secondary border border-outline-variant/10">
                                 {c.member.firstName} {c.member.lastName || ''}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
                </div>

                <footer className="mt-auto pt-12">
                   <a 
                     href={formatDriveImageUrl(selectedItem.image)}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full bg-primary text-on-primary py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary-container transition-all flex items-center justify-center gap-3 shadow-2xl"
                   >
                      <Download size={14} /> Abrir em Alta Resolução
                   </a>
                </footer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
