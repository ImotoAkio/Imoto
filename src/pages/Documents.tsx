import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, X, Calendar, Users, Loader2, FolderOpen, ExternalLink, Languages, Info, FileStack } from 'lucide-react';
import { formatDriveEmbedUrl, getDriveThumbnailUrl, formatDriveImageUrl } from '../utils/mediaUtils';

interface ArchiveDocument {
  id: string;
  title: string;
  date: string;
  type: string;
  thumbnail: string;
  pdfUrl: string;
  context: string;
  originalText: string;
  translation: string;
  citations: any[];
}

const DocumentReader: React.FC<{ doc: ArchiveDocument, onClose: () => void }> = ({ doc, onClose }) => {
  const [tab, setTab] = useState<'context' | 'translation'>('context');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/80 backdrop-blur-xl p-4 md:p-12 overflow-hidden"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="bg-background w-full h-full max-w-7xl flex flex-col md:flex-row shadow-2xl relative washi-texture overflow-hidden border border-outline-variant/10"
      >
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-background/50 rounded-full md:hidden"
        >
          <X size={20} />
        </button>

        {/* Left Panel: PDF Viewer / UI */}
        <div className="w-full md:w-2/3 h-1/2 md:h-auto bg-[#525659] relative flex flex-col group/viewer">
           <header className="bg-surface-container-high p-4 flex justify-between items-center text-on-surface border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <FileText size={18} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] truncate">{doc.title}</span>
              </div>
           </header>
           
           <div className="flex-grow relative overflow-hidden">
             {doc.pdfUrl ? (
               <iframe 
                 src={formatDriveEmbedUrl(doc.pdfUrl)} 
                 className="w-full h-full border-none bg-white"
                 title={doc.title}
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4 bg-black/80">
                 <FileText size={64} className="opacity-20" />
                 <p className="text-xs uppercase tracking-widest font-bold opacity-50">Visualização Indisponível</p>
               </div>
             )}
             
             {/* Open in New Tab Overlay */}
             <div className="absolute bottom-6 right-6 opacity-0 group-hover/viewer:opacity-100 transition-opacity">
                <a 
                  href={formatDriveImageUrl(doc.pdfUrl)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-xl"
                >
                   Abrir em Nova Aba <ExternalLink size={12} />
                </a>
             </div>
           </div>
        </div>

        {/* Right Panel: Metadata */}
        <div className="w-full md:w-1/3 h-1/2 md:h-auto overflow-y-auto bg-background p-8 md:p-12 relative flex flex-col z-10">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-surface-container-low transition-colors hidden md:block"
          >
            <X size={24} />
          </button>

          <header className="mb-12">
            <div className="hanko-seal scale-75 origin-top-left mb-6">録</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 block">{doc.type}</span>
            <h2 className="text-3xl font-noto-serif leading-tight italic">{doc.title}</h2>
            <div className="flex items-center gap-3 mt-6 text-secondary text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={14} className="text-primary" /> {doc.date}
            </div>
          </header>

          <div className="flex gap-6 mb-8 border-b border-outline-variant/10">
             <button 
               onClick={() => setTab('context')}
               className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${tab === 'context' ? 'text-primary' : 'text-secondary opacity-50'}`}
             >
               Contexto
               {tab === 'context' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
             </button>
             <button 
               onClick={() => setTab('translation')}
               className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${tab === 'translation' ? 'text-primary' : 'text-secondary opacity-50'}`}
             >
               Tradução
               {tab === 'translation' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
             </button>
          </div>

          <div className="flex-grow">
             <AnimatePresence mode="wait">
               {tab === 'context' ? (
                 <motion.div 
                   key="context"
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                   className="space-y-8"
                 >
                   <p className="text-on-surface-variant font-body leading-relaxed text-sm italic">
                      "{doc.context || 'Nenhuma descrição de contexto disponível.'}"
                   </p>
                   {doc.citations.length > 0 && (
                     <div className="pt-8 border-t border-outline-variant/5">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                          <Users size={14} /> Pessoas Citadas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {doc.citations.map((c: any) => (
                             <span key={c.id} className="bg-surface-container-high px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary border border-outline-variant/10">
                               {c.member.firstName} {c.member.lastName || ''}
                             </span>
                           ))}
                        </div>
                     </div>
                   )}
                 </motion.div>
               ) : (
                 <motion.div 
                    key="trans"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                 >
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                          <Languages size={12} /> Texto Original
                       </h4>
                       <p className="font-noto-serif text-sm leading-relaxed italic bg-surface-container-low p-4 border-l-2 border-primary/30">
                          {doc.originalText || 'Texto original não disponível'}
                       </p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                          <Info size={12} /> Tradução / Conteúdo
                       </h4>
                       <p className="font-body text-on-surface-variant leading-relaxed text-sm">
                          {doc.translation || 'Tradução não disponível para este documento.'}
                       </p>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <footer className="mt-12 pt-8 border-t border-outline-variant/10">
             <a 
               href={formatDriveImageUrl(doc.pdfUrl)} 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-full bg-primary text-on-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary-container transition-all text-center block shadow-2xl"
             >
                Download Documento
             </a>
          </footer>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DocumentCard: React.FC<{ doc: ArchiveDocument, idx: number, onClick: () => void }> = ({ doc, idx, onClick }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const thumbUrl = getDriveThumbnailUrl(doc.pdfUrl, 'w600');
  
  // Geração de variação visual baseada no ID para não ficarem todos iguais
  const rotation = (parseInt(doc.id.slice(-2), 16) % 6) - 3; // -3deg a 3deg
  const textureType = (parseInt(doc.id.slice(-1), 16) % 3); // 0, 1, 2 para tipos de papel

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -12, rotate: 0 }}
      onClick={onClick}
      style={{ rotate: `${rotation}deg` }}
      className="group cursor-pointer perspective-1000"
    >
      <div className={`relative aspect-[3/4] overflow-hidden mb-6 shadow-2xl border border-outline-variant/10 washi-texture transition-all duration-500 group-hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] ${
        textureType === 0 ? 'bg-[#f4f1ea]' : textureType === 1 ? 'bg-[#efebe0]' : 'bg-[#f9f7f0]'
      }`}>
         {/* Thumbnail Preview */}
         {thumbUrl && !hasError ? (
           <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <img 
                src={thumbUrl} 
                alt={doc.title}
                onError={() => setHasError(true)}
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity mix-blend-multiply"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
           </div>
         ) : null}

         {/* Fallback Icon (sempre renderizado se não deu erro ou se ainda está carregando/deu erro) */}
         {(!isLoaded || hasError || !thumbUrl) && (
           <div className="w-full h-full flex flex-col items-center justify-center p-8 text-secondary gap-4 group-hover:bg-primary/5 transition-colors absolute inset-0">
              <FileText size={64} className="text-primary/20 group-hover:text-primary/40 transition-colors" />
              <div className="text-center">
                 <span className="text-[8px] uppercase font-bold tracking-widest opacity-40">
                   {hasError ? 'Visualização Offline' : 'Registro Digital'}
                 </span>
              </div>
           </div>
         )}

         {/* Visual "Paper" Accents (Folds/Seals) */}
         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-black/5 to-transparent pointer-events-none" />
         <div className="absolute bottom-4 left-4 hanko-seal scale-[0.4] opacity-20 group-hover:opacity-40 transition-opacity">鑑</div>
         
         <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 shadow-lg rounded-sm opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
            <ExternalLink size={14} className="text-primary" />
         </div>

         {/* Quick Info Overlay */}
         <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-background/90 to-transparent">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">{doc.title}</p>
         </div>
      </div>

      <div className="space-y-2 px-2">
         <div className="flex justify-between items-start">
           <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">{doc.type}</span>
           {thumbUrl && !hasError && <FileStack size={12} className="text-primary/40" />}
         </div>
         <h3 className="font-noto-serif text-xl group-hover:text-primary transition-colors leading-tight italic truncate-2-lines">{doc.title}</h3>
         <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-widest">
            <Calendar size={12} className="text-primary/40" /> {doc.date}
         </div>
      </div>
    </motion.div>
  );
};

const Documents: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<ArchiveDocument | null>(null);
  const [items, setItems] = useState<ArchiveDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/artifacts');
        if (!response.ok) throw new Error('Falha ao buscar dados');
        const data = await response.json();
        
        if (data && data.length > 0) {
          const mappedItems: ArchiveDocument[] = data
            .filter((item: any) => item.type === 'DOCUMENT')
            .map((item: any) => ({
              id: item.id,
              title: item.title || 'Sem Título',
              date: item.year || 'S/D',
              type: item.category || 'Civil',
              thumbnail: item.mediaUrl, // Para documentos o thumbnail é opcional ou o próprio PDF se suportado
              pdfUrl: item.mediaUrl,
              context: item.contextDescription || '',
              originalText: item.originalText || '',
              translation: item.translationText || '',
              citations: item.citations || []
            }));
          setItems(mappedItems);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Erro ao carregar documentos:', err);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const filters = ['Todos', 'Civis e Pessoais', 'Família e Relações', 'Patrimônio e Negócios', 'Impostos e Burocracia'];

  const filteredItems = items
    .filter(i => activeFilter === 'Todos' || i.type === activeFilter)
    .filter(i => 
      (i.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (i.context || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 md:px-12 pb-24"
    >
      <header className="mt-16 mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="max-w-xl">
          <div className="hanko-seal mb-6">書類</div>
          <h1 className="text-4xl md:text-6xl font-noto-serif mb-6 italic">Arquivo de Documentos</h1>
          <p className="text-secondary text-lg font-body leading-relaxed italic opacity-70">
            "A prova tangível do nosso passado: civilidade, propriedade e a coragem de atravessar oceanos registrada em papel."
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Localizar registro..."
              className="pl-12 pr-6 py-4 bg-surface-container-low border-b border-primary/20 outline-none focus:border-primary transition-all font-noto-serif text-sm w-full md:w-72"
            />
          </div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="flex gap-6 md:gap-8 mb-16 border-b border-outline-variant/10 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {filters.map(filter => (
          <button 
            key={filter} 
            onClick={() => setActiveFilter(filter)}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative pb-4 ${activeFilter === filter ? 'text-primary' : 'text-secondary hover:text-primary'}`}
          >
            {filter}
            {activeFilter === filter && <motion.div layoutId="doc-filter-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Acessando Arquivos...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredItems.map((doc, idx) => (
            <DocumentCard 
              key={doc.id} 
              doc={doc} 
              idx={idx} 
              onClick={() => setSelectedDoc(doc)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/20 bg-surface-container-lowest/30 p-16 text-center">
          <FolderOpen size={48} className="text-outline mb-6 opacity-20" />
          <h3 className="text-2xl font-noto-serif mb-2 italic">Acervo Limpo</h3>
          <p className="text-secondary mb-8 text-center max-w-sm font-body">
            Este arquivo está pronto para receber os documentos digitais reais da família. Utilize o Painel Admin para fazer o upload.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedDoc && (
          <DocumentReader doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Documents;
