import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Search, 
  Filter, 
  UserPlus, 
  Clock, 
  MapPin, 
  Tag,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  History,
  X,
  ScanEye,
  Trash2,
  Users,
  Target
} from 'lucide-react';
import { getDriveThumbnailUrl } from '../utils/mediaUtils';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface Citation {
  memberId: string;
  member?: Member;
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
}

interface Artifact {
  id: string;
  type: string;
  title: string;
  mediaUrl: string;
  year: string | null;
  location: string | null;
  category: string | null;
  contextDescription: string | null;
  originalText: string | null;
  translationText: string | null;
  citations: Citation[];
}

const CATEGORIES = [
  'Família e Relações',
  'Civis e Pessoais',
  'Patrimônio e Negócios',
  'Impostos e Burocracia',
  'Histórico',
  'Outro'
];

const Cataloging: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Tagging State
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [currentTag, setCurrentTag] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [showMemberPicker, setShowMemberPicker] = useState<{ x: number, y: number } | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Unified Citation State
  const [citations, setCitations] = useState<Citation[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Artifact>>({});

  const fetchInitialData = useCallback(async () => {
    try {
      const [artRes, memRes] = await Promise.all([
        fetch('http://localhost:3000/api/artifacts'),
        fetch('http://localhost:3000/api/members')
      ]);
      const artData = await artRes.json();
      const memData = await memRes.json();
      
      setArtifacts(artData);
      setMembers(memData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const currentArtifact = artifacts[currentIndex];

  // Update form when artifact changes
  useEffect(() => {
    if (currentArtifact) {
      setFormData({
        title: currentArtifact.title,
        year: currentArtifact.year || '',
        location: currentArtifact.location || '',
        category: currentArtifact.category || 'Família e Relações',
        contextDescription: currentArtifact.contextDescription || '',
        originalText: currentArtifact.originalText || '',
        translationText: currentArtifact.translationText || ''
      });
      
      setCitations(currentArtifact.citations);
    }
  }, [currentArtifact]);

  const handleSave = async (andNext = true) => {
    if (!currentArtifact) return;
    setSaving(true);
    
    try {
      const response = await fetch(`http://localhost:3000/api/artifacts/${currentArtifact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          citations: citations.map(c => ({
            memberId: c.memberId,
            x: c.x,
            y: c.y,
            width: c.width,
            height: c.height
          }))
        })
      });

      if (!response.ok) throw new Error('Falha ao salvar');

      const updated = await response.json();
      
      const newArtifacts = [...artifacts];
      newArtifacts[currentIndex] = updated;
      setArtifacts(newArtifacts);

      setFeedback({ type: 'success', message: 'Salvo com sucesso!' });
      
      if (andNext && currentIndex < artifacts.length - 1) {
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setFeedback(null);
          setIsTaggingMode(false);
        }, 300);
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao salvar alterações.' });
    } finally {
      setSaving(false);
    }
  };

  // Tagging Interactions
  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (!isTaggingMode || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCurrentTag({ x, y, w: 0, h: 0 });
    setShowMemberPicker(null);
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isTaggingMode || !currentTag || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCurrentTag({
      ...currentTag,
      w: Math.abs(currentX - currentTag.x),
      h: Math.abs(currentY - currentTag.y),
      x: Math.min(currentX, currentTag.x),
      y: Math.min(currentY, currentTag.y)
    });
  };

  const handleImageMouseUp = (e: React.MouseEvent) => {
    if (!isTaggingMode || !currentTag) return;
    
    if (currentTag.w < 1 || currentTag.h < 1) {
      setCurrentTag(null);
      return;
    }

    // Show Picker at mouse position
    setShowMemberPicker({ x: e.clientX, y: e.clientY });
  };

  const handleMemberSelect = (member: Member) => {
    if (!currentTag) return;

    // Check if this person already exists as a general mention (x is null)
    // If they do, we "promote" that mention to a tag, OR we can allow multiple.
    // User requested "centralize on face", so we'll replace the general mention if it exists.
    const existsIndex = citations.findIndex(c => c.memberId === member.id && c.x === null);

    const newCitation: Citation = {
      memberId: member.id,
      member,
      x: currentTag.x,
      y: currentTag.y,
      width: currentTag.w,
      height: currentTag.h
    };

    let newCitations = [...citations];
    if (existsIndex > -1) {
      // Replace general mention with specific area
      newCitations[existsIndex] = newCitation;
    } else {
      newCitations.push(newCitation);
    }

    setCitations(newCitations);
    setCurrentTag(null);
    setShowMemberPicker(null);
    setPickerSearch('');
  };

  // Add standard mention (no area)
  const addGeneralMention = (memberId: string) => {
    if (citations.some(c => c.memberId === memberId && c.x === null)) return;
    
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    setCitations([...citations, {
      memberId,
      member,
      x: null, y: null, width: null, height: null
    }]);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(prev + 1, artifacts.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(prev - 1, 0));
      if (e.key === 'Enter') handleSave(true);
      if (e.key === 't') setIsTaggingMode(!isTaggingMode);
      if (e.key === 'Escape') {
        setIsTaggingMode(false);
        setCurrentTag(null);
        setShowMemberPicker(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artifacts, currentIndex, formData, citations, isTaggingMode, currentTag]);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-background text-on-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-fixed border-t-transparent rounded-full animate-spin"></div>
        <p className="font-noto-serif italic opacity-60">Carregando acervo...</p>
      </div>
    </div>
  );

  const getProxyUrl = (mediaUrl: string) => {
    const idMatch = mediaUrl.match(/[-\w]{25,}/);
    if (idMatch) return getDriveThumbnailUrl(idMatch[0], 'w1600');
    return mediaUrl;
  };

  return (
    <div className="h-full flex flex-col bg-background text-on-background select-none">
      {/* Header */}
      <header className="px-8 py-4 bg-surface border-b border-outline/10 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 hanko-seal scale-75">井</div>
          <div>
            <h2 className="font-noto-serif text-xl font-bold">Curadoria de Acervo</h2>
            <p className="text-[10px] text-on-surface/50 tracking-[0.3em] uppercase font-bold">Digital Preservation Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase font-bold tracking-widest text-primary-fixed">Progresso Global</span>
             <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono">{currentIndex + 1} / {artifacts.length}</span>
                <div className="w-32 h-1 bg-surface-container-high rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-primary-fixed transition-all duration-500" 
                     style={{ width: `${((currentIndex + 1) / artifacts.length) * 100}%` }}
                   />
                </div>
             </div>
          </div>
          
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-3 rounded-full hover:bg-surface-container-high transition-colors disabled:opacity-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentIndex(prev => Math.min(artifacts.length - 1, prev + 1))}
              disabled={currentIndex === artifacts.length - 1}
              className="p-3 rounded-full hover:bg-surface-container-high transition-colors disabled:opacity-20"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex min-h-0 overflow-hidden">
        {/* Workspace: Preview + Tools */}
        <div className="flex-[2] bg-[#0a0a0a] flex items-center justify-center p-12 overflow-hidden relative">
          <div 
            ref={imageContainerRef}
            onMouseDown={handleImageMouseDown}
            onMouseMove={handleImageMouseMove}
            onMouseUp={handleImageMouseUp}
            className={`relative max-w-full max-h-full transition-all duration-300 ${isTaggingMode ? 'cursor-crosshair' : 'cursor-default'}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentArtifact?.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="relative shadow-[0_30px_90px_rgba(0,0,0,0.8)] rounded-sm"
              >
                {currentArtifact?.type === 'PHOTO' ? (
                  <img 
                    src={getProxyUrl(currentArtifact.mediaUrl)} 
                    alt={currentArtifact.title}
                    className="max-w-full max-h-[70vh] object-contain pointer-events-none border border-white/5"
                  />
                ) : (
                    <div className="w-[600px] aspect-[1/1.4] bg-white flex flex-col items-center justify-center p-12 text-black">
                       <FileText size={100} strokeWidth={1} className="opacity-10 mb-8" />
                       <p className="font-noto-serif text-2xl italic opacity-40">Preservação de Documento</p>
                    </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Citations Overlay */}
            {citations.filter(c => c.x !== null).map((tag, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  left: `${tag.x}%`, 
                  top: `${tag.y}%`, 
                  width: `${tag.width}%`, 
                  height: `${tag.height}%` 
                }}
                className="absolute border border-primary-fixed bg-primary-fixed/5 group ring-1 ring-primary-fixed/30"
              >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 shadow-xl flex items-center gap-2">
                    <Target size={10} strokeWidth={3} />
                    {tag.member?.firstName} {tag.member?.lastName}
                    <button onClick={() => setCitations(citations.filter((_, idx) => idx !== i))} className="hover:text-red-300">
                      <X size={10} />
                    </button>
                  </div>
              </motion.div>
            ))}

            {/* Current Selection Box */}
            {currentTag && (
              <div 
                style={{ 
                  left: `${currentTag.x}%`, 
                  top: `${currentTag.y}%`, 
                  width: `${currentTag.w}%`, 
                  height: `${currentTag.h}%` 
                }}
                className="absolute border border-dashed border-white bg-white/10 ring-4 ring-white/5"
              />
            )}
          </div>

          {/* Member Picker Modal (Floating) */}
          <AnimatePresence>
            {showMemberPicker && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ left: showMemberPicker.x - 150, top: showMemberPicker.y + 20 }}
                className="fixed w-[300px] bg-surface-container-high backdrop-blur-2xl border border-outline/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
              >
                  <div className="p-4 border-b border-outline/10 bg-white/5">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed mb-3">Identificar Pessoa</p>
                     <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="Buscar na árvore..."
                          value={pickerSearch}
                          onChange={e => setPickerSearch(e.target.value)}
                          className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-lg text-sm border-none focus:ring-1 ring-primary-fixed outline-none"
                        />
                     </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto pt-2 pb-4 px-2 custom-scrollbar">
                     {members
                       .filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(pickerSearch.toLowerCase()))
                       .slice(0, 8)
                       .map(m => (
                          <button 
                            key={m.id}
                            onClick={() => handleMemberSelect(m)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
                          >
                             <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-xs font-bold ring-1 ring-white/10 group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                                {m.firstName[0]}
                             </div>
                             <div>
                                <p className="text-sm font-semibold">{m.firstName} {m.lastName}</p>
                                <p className="text-[10px] opacity-40 uppercase tracking-tighter">Membro Registrado</p>
                             </div>
                          </button>
                       ))}
                       {pickerSearch && members.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(pickerSearch.toLowerCase())).length === 0 && (
                          <p className="p-8 text-center text-xs opacity-30 italic font-noto-serif">Nenhum resultado encontrado.</p>
                       )}
                  </div>
                  <button 
                    onClick={() => { setShowMemberPicker(null); setCurrentTag(null); }}
                    className="w-full p-3 text-[10px] font-bold uppercase tracking-widest text-on-surface/40 hover:text-white transition-colors border-t border-outline/10"
                  >
                    Cancelar
                  </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating UI: Instructions */}
          <div className="absolute top-12 left-12 flex flex-col gap-2">
             <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Arquivo Imoto v2.5</p>
                <p className="text-sm font-noto-serif italic text-white/80">{currentArtifact?.title}</p>
             </div>
          </div>

          {/* Floating UI: Mode Switcher */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-inverse-surface/90 backdrop-blur-2xl rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/5 z-20">
            <button 
              onClick={() => setIsTaggingMode(!isTaggingMode)}
              className={`flex items-center gap-3 px-6 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-widest ${
                isTaggingMode 
                  ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(var(--md-sys-color-primary-rgb),0.5)]' 
                  : 'text-white/60 hover:bg-white/10'
              }`}
            >
              <ScanEye size={18} />
              {isTaggingMode ? 'Modo de Seleção Ativado' : 'Identificar Rosto'}
            </button>
            
            <div className="w-px h-8 bg-white/10" />
            
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Atalhos</span>
               <div className="flex gap-2">
                  <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/60 font-mono">T</kbd>
                  <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/60 font-mono">Enter</kbd>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Metadata & Citations */}
        <div className="flex-1 bg-surface border-l border-outline/10 flex flex-col min-w-[500px] z-10">
          <div className="flex-grow p-10 overflow-y-auto space-y-10 custom-scrollbar">
            
            {/* 1. Core Metadata */}
            <section className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-fixed ml-1">Descrição do Artefato</label>
                <div className="relative group">
                  <input 
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-surface-container-low border-b-2 border-outline/20 px-1 py-4 text-2xl font-noto-serif font-bold focus:border-primary-fixed outline-none transition-all placeholder:opacity-20"
                    placeholder="Sem título..."
                  />
                  {formData.title?.match(/\.(jpg|png|pdf|jpeg)$/i) && (
                    <button 
                      onClick={() => setFormData({...formData, title: formData.title?.split('.')[0]})}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-bold px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/60 transition-all opacity-0 group-hover:opacity-100"
                    >
                      Remover Extensão
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-fixed flex items-center gap-2">
                      <History size={14} /> Época / Ano
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-surface-container-low border-b border-outline/30 py-2 text-base focus:border-primary-fixed outline-none transition-colors"
                      value={formData.year || ''}
                      onChange={e => setFormData({...formData, year: e.target.value})}
                      placeholder="Ex: 1950s"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-fixed flex items-center gap-2">
                      <MapPin size={14} /> Localização
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-surface-container-low border-b border-outline/30 py-2 text-base focus:border-primary-fixed outline-none transition-colors"
                      value={formData.location || ''}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="Ex: São Paulo"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-fixed flex items-center gap-2">
                    <Tag size={14} /> Classificação
                 </label>
                 <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          formData.category === cat 
                           ? 'bg-primary-fixed text-on-primary-fixed border-primary-fixed' 
                           : 'bg-transparent border-outline/20 text-on-surface/50 hover:border-outline'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>
            </section>

            {/* 2. Unified Citations (Pessoas na Imagem) */}
            <section className="space-y-6 pt-10 border-t border-outline/10">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-noto-serif flex items-center gap-3">
                       <Users size={18} className="text-primary-fixed" /> Pessoas na Imagem
                    </h3>
                    <p className="text-[10px] text-on-surface/40 uppercase tracking-widest mt-1">Identificação de Membros</p>
                  </div>
                  <div className="relative group">
                     <button className="p-2 bg-surface-container-high rounded-full hover:bg-primary-fixed hover:text-on-primary-fixed transition-all">
                        <UserPlus size={18} />
                     </button>
                     {/* Quick add dropdown */}
                     <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-highest border border-outline/20 rounded-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto transition-all z-20 overflow-hidden">
                        <div className="p-3 border-b border-outline/10">
                           <input 
                             type="text" 
                             placeholder="Mencionar pessoa..." 
                             className="w-full bg-black/20 px-3 py-1.5 rounded-md text-xs outline-none focus:ring-1 ring-primary-fixed"
                             onChange={(e) => setPickerSearch(e.target.value)}
                           />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                           {members
                             .filter(m => !citations.some(c => c.memberId === m.id) && `${m.firstName} ${m.lastName}`.toLowerCase().includes(pickerSearch.toLowerCase()))
                             .slice(0, 5)
                             .map(m => (
                               <button 
                                 key={m.id}
                                 onClick={() => addGeneralMention(m.id)}
                                 className="w-full p-3 text-left hover:bg-white/5 text-xs font-semibold flex items-center gap-3"
                               >
                                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px]">{m.firstName[0]}</div>
                                  {m.firstName} {m.lastName}
                               </button>
                             ))}
                        </div>
                     </div>
                  </div>
               </div>
               
               {citations.length === 0 ? (
                 <div className="p-12 border-2 border-dashed border-outline/10 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Users size={40} strokeWidth={1} className="opacity-10 mb-4" />
                    <p className="text-xs opacity-30 italic font-noto-serif">Ninguém identificado nesta mídia ainda.<br/>Use o modo "Identificar Rosto" ou o botão (+).</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-3">
                    {citations.map((cite, idx) => (
                      <motion.div 
                        key={idx}
                        layout
                        className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline/10 hover:border-primary-fixed/30 transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative ${cite.x !== null ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface/40'}`}>
                               {cite.member?.firstName[0]}
                               {cite.x !== null && (
                                 <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full ring-1 ring-primary-fixed">
                                   <Target size={10} className="text-primary-fixed" />
                                 </div>
                               )}
                            </div>
                            <div>
                               <p className="text-sm font-bold">{cite.member?.firstName} {cite.member?.lastName}</p>
                               <div className="flex items-center gap-2 mt-0.5">
                                  {cite.x !== null ? (
                                    <span className="text-[9px] uppercase font-bold tracking-tighter text-primary-fixed flex items-center gap-1">
                                       <ScanEye size={10} /> Face Identificada
                                    </span>
                                  ) : (
                                    <span className="text-[9px] uppercase font-bold tracking-tighter opacity-30">Menção Histórica</span>
                                  )}
                               </div>
                            </div>
                         </div>
                         <button 
                           onClick={() => setCitations(citations.filter((_, i) => i !== idx))}
                           className="p-2 opacity-0 group-hover:opacity-100 text-on-surface/30 hover:text-red-500 transition-all"
                         >
                           <Trash2 size={16} />
                         </button>
                      </motion.div>
                    ))}
                 </div>
               )}
            </section>

            {/* 3. Narratives & Context */}
            <section className="space-y-4 pt-10 border-t border-outline/10">
               <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-fixed ml-1">Descrição e Narrativa Contextual</label>
               <textarea 
                 rows={6}
                 value={formData.contextDescription || ''}
                 onChange={e => setFormData({...formData, contextDescription: e.target.value})}
                 className="w-full bg-surface-container-low border border-outline/10 p-6 text-base font-noto-serif leading-relaxed focus:border-primary-fixed outline-none rounded-xl resize-none placeholder:opacity-20"
                 placeholder="Descreva a história por trás desta imagem..."
               />
            </section>
          </div>

          {/* Footer Persistence */}
          <div className="p-10 bg-surface-container-low border-t border-outline/10 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
             <div className="flex gap-4">
                <button 
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="flex-[3] py-5 bg-primary text-on-primary font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-primary/90 transition-all shadow-xl flex items-center justify-center gap-4 hover:gap-6"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  Salvar e Próximo Registro
                </button>
                <button 
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex-1 py-5 border border-outline/30 text-on-surface hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center"
                  title="Salvar sem avançar"
                >
                  <Save size={20} />
                </button>
             </div>

             <div className="h-4 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em]">
                <AnimatePresence>
                  {feedback && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      className={feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}
                    >
                      {feedback.message}
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-4 opacity-30">
                   <span>Atalho de Salvamento: <kbd className="px-2 py-0.5 border border-outline/20 rounded ml-1">Enter</kbd></span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--md-sys-color-primary-fixed-rgb), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--md-sys-color-primary-fixed-rgb), 0.3);
        }
      `}</style>
    </div>
  );
};

export default Cataloging;
