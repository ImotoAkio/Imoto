import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Clock, 
  MapPin, 
  Calendar, 
  Tag, 
  FileText,
  Search,
  Loader2,
  ChevronRight,
  Users,
  UserPlus,
  ArrowRight,
  Files,
  CheckCircle2
} from 'lucide-react';
import { formatDriveEmbedUrl } from '../utils/mediaUtils';
import { 
  fetchArtifacts, createArtifact, updateArtifact, deleteArtifact,
  fetchEvents, createEvent, updateEvent, deleteEvent,
  fetchMembers,
  uploadImage 
} from '../lib/api';

type Tab = 'artifacts' | 'timeline';

const ArchiveManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('artifacts');
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [artData, eventData, memberData] = await Promise.all([
        fetchArtifacts(),
        fetchEvents(),
        fetchMembers()
      ]);
      setArtifacts(artData);
      setEvents(eventData);
      setMembers(memberData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Família e Relações');
  const [bulkYear, setBulkYear] = useState('');
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBulkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const RawItems = bulkUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (RawItems.length === 0) return;

    setIsSaving(true);
    setImportProgress({ current: 0, total: RawItems.length });
    
    try {
      for (let i = 0; i < RawItems.length; i++) {
        const item = RawItems[i];
        let finalUrl = item;

        // Suporte a IDs puros do Google Drive
        if (!item.startsWith('http') && item.length >= 20) {
          finalUrl = `https://drive.google.com/file/d/${item}/view`;
        }

        await createArtifact({
          type: 'PHOTO',
          title: `Nova Foto - ${bulkYear || 'S/D'}`,
          category: bulkCategory,
          year: bulkYear,
          mediaUrl: formatDriveEmbedUrl(finalUrl),
          contextDescription: 'Registro importado via ferramenta de lote (IDs/Links).'
        });

        setImportProgress(prev => ({ ...prev, current: i + 1 }));
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setIsBulkImportOpen(false);
        setShowSuccess(false);
        setBulkUrls('');
      }, 2000);
      
      await loadData();
    } catch (error) {
      console.error('Erro no lote:', error);
      alert('Ocorreu um erro durante a importação em lote. Alguns registros podem ter sido criados.');
    } finally {
      setIsSaving(false);
      setImportProgress({ current: 0, total: 0 });
    }
  };

  const handleCreateNew = () => {
    if (activeTab === 'artifacts') {
      setSelectedItem({
        type: 'PHOTO',
        title: '',
        category: 'Família',
        year: '',
        location: '',
        contextDescription: '',
        mediaUrl: '',
        originalText: '',
        translationText: '',
        citations: [] // IDs dos membros
      });
    } else {
      setSelectedItem({
        year: new Date().getFullYear(),
        title: '',
        description: '',
        location: '',
        iconName: 'Clock'
      });
    }
    setIsEditorOpen(true);
  };

  const handleEdit = (item: any) => {
    // Mapear citações para array de IDs para o editor
    const citationIds = item.citations?.map((c: any) => c.memberId) || [];
    setSelectedItem({ ...item, citations: citationIds });
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item permanentemente?')) return;
    
    setIsSaving(true);
    try {
      if (activeTab === 'artifacts') {
        await deleteArtifact(id);
      } else {
        await deleteEvent(id);
      }
      await loadData();
    } catch (error) {
      alert('Erro ao excluir item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'artifacts') {
        if (selectedItem.id) {
          await updateArtifact(selectedItem.id, selectedItem);
        } else {
          await createArtifact(selectedItem);
        }
      } else {
        if (selectedItem.id) {
          await updateEvent(selectedItem.id, selectedItem);
        } else {
          await createEvent(selectedItem);
        }
      }
      setIsEditorOpen(false);
      await loadData();
    } catch (error) {
      alert('Erro ao salvar item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const { url } = await uploadImage(file);
      const fullUrl = `${url}`;
      setSelectedItem((prev: any) => ({ 
        ...prev, 
        mediaUrl: fullUrl,
        // Tentar inferir se é PDF pelo nome/tipo
        type: file.type === 'application/pdf' ? 'DOCUMENT' : prev.type
      }));
    } catch (error) {
      alert('Erro no upload da imagem');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCitation = (memberId: string) => {
    setSelectedItem((prev: any) => {
      const currentCitations = prev.citations || [];
      const exists = currentCitations.includes(memberId);
      if (exists) {
        return { ...prev, citations: currentCitations.filter((id: string) => id !== memberId) };
      } else {
        return { ...prev, citations: [...currentCitations, memberId] };
      }
    });
  };

  const filteredArtifacts = (Array.isArray(artifacts) ? artifacts : []).filter(art => 
    (art.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (art.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = (Array.isArray(events) ? events : []).filter(ev => 
    (ev.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ev.year || '').toString().includes(searchQuery)
  );

  const availableMembers = (Array.isArray(members) ? members : []).filter(m => 
    (`${m.firstName} ${m.lastName || ''}`).toLowerCase().includes(memberSearch.toLowerCase()) &&
    !selectedItem?.citations?.includes(m.id)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Header Area */}
      <header className="px-8 md:px-12 pt-12 pb-8 border-b border-outline-variant/10 bg-surface-container-low/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="hanko-seal scale-75">管</div>
                <h1 className="text-3xl md:text-4xl font-noto-serif">Gerenciador do Acervo</h1>
             </div>
             <p className="text-secondary text-sm font-body">Administração de registros históricos, fotografias e linha do tempo.</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" />
                <input 
                  type="text" 
                  placeholder="Pesquisar registro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-outline-variant/20 text-sm font-noto-serif min-w-[250px] outline-none focus:border-primary transition-colors"
                />
             </div>
              <button 
                onClick={() => setIsBulkImportOpen(true)}
                className="bg-surface-container-high text-primary px-4 py-2 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-surface-container-highest transition-all shadow-sm border border-outline-variant/20"
              >
                <Files size={16} /> Importação em Lote
              </button>
              <button 
                onClick={handleCreateNew}
                className="bg-primary text-on-primary px-6 py-2 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg"
              >
                <Plus size={16} /> Novo Registro
              </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-outline-variant/10">
           <button 
              onClick={() => setActiveTab('artifacts')}
              className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'artifacts' ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
           >
              Imagens & Documentos
              {activeTab === 'artifacts' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
           </button>
           <button 
              onClick={() => setActiveTab('timeline')}
              className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'timeline' ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
           >
              Linha do Tempo
              {activeTab === 'timeline' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-primary" size={48} />
             <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary animate-pulse">Consultando Arquivos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'artifacts' ? (
              filteredArtifacts.map(art => (
                <motion.div 
                  layout
                  key={art.id}
                  className="group bg-white border border-outline-variant/10 p-4 washi-texture relative hover:border-primary/30 transition-all cursor-pointer flex flex-col"
                  onClick={() => handleEdit(art)}
                >
                  <div className="aspect-square bg-surface-container-low mb-4 relative overflow-hidden">
                    {art.type === 'DOCUMENT' ? (
                       <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high/50 text-secondary gap-3">
                          <FileText size={48} className="text-primary/40" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Documento PDF</span>
                       </div>
                    ) : art.mediaUrl ? (
                      <img src={art.mediaUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={art.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(art.id); }}
                        className="p-2 bg-error/10 text-error hover:bg-error hover:text-white transition-all rounded shadow-sm"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-1">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{art.category}</span>
                     {art.citations?.length > 0 && (
                        <div className="flex -space-x-1">
                           {art.citations.slice(0, 3).map((c: any) => (
                              <div key={c.id} className="w-5 h-5 rounded-full bg-primary-fixed border border-white flex items-center justify-center text-[8px] font-bold" title={`${c.member.firstName} ${c.member.lastName || ''}`}>
                                 {c.member.firstName ? c.member.firstName[0] : '?'}
                              </div>
                           ))}
                           {art.citations.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-surface-container border border-white flex items-center justify-center text-[8px] font-bold">
                                 +{art.citations.length - 3}
                              </div>
                           )}
                        </div>
                     )}
                  </div>
                  <h3 className="font-noto-serif text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{art.title}</h3>
                  <div className="mt-auto flex items-center gap-4 text-[10px] text-secondary font-bold font-noto-serif border-t border-outline-variant/10 pt-3">
                     <span className="flex items-center gap-1"><Calendar size={10} className="text-primary/50" /> {art.year || 'S/D'}</span>
                     <span className="flex items-center gap-1"><MapPin size={10} className="text-primary/50" /> {art.location || 'N/A'}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              filteredEvents.map(ev => (
                <motion.div 
                  layout
                  key={ev.id}
                  className="group bg-[#1b1c1a] text-inverse-on-surface p-6 border-l-4 border-primary hover:bg-[#252623] transition-all cursor-pointer flex flex-col"
                  onClick={() => handleEdit(ev)}
                >
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-3xl font-noto-serif text-primary italic leading-none">{ev.year}</span>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }}
                        className="p-2 text-stone-500 hover:text-error transition-colors"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                  <h3 className="font-noto-serif text-xl mb-3">{ev.title}</h3>
                  <p className="text-sm text-stone-400 font-body leading-relaxed line-clamp-3 mb-4">{ev.description}</p>
                  <div className="mt-auto flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-primary/70">
                     <MapPin size={12} /> {ev.location}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Side Editor Drawer */}
      <AnimatePresence>
        {isBulkImportOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-on-background/60 backdrop-blur-sm z-[2000]"
              onClick={() => setIsBulkImportOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-background shadow-2xl z-[2010] p-10 washi-texture border border-outline-variant/10"
            >
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <Files className="text-primary" size={24} />
                  <div>
                    <h2 className="font-noto-serif text-2xl font-bold">Importação em Lote</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-secondary mt-1">Sincronize várias fotos do Drive (Links ou IDs)</p>
                  </div>
                </div>
                {!isSaving && (
                  <button onClick={() => setIsBulkImportOpen(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                    <X size={24} />
                  </button>
                )}
              </div>

              {showSuccess ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="py-20 flex flex-col items-center justify-center text-center gap-6"
                >
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle2 size={48} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-noto-serif italic">Importação Concluída!</h3>
                      <p className="text-sm text-secondary mt-2">Seus registros foram adicionados ao acervo.</p>
                   </div>
                </motion.div>
              ) : (
                <form onSubmit={handleBulkSave} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-3 flex justify-between">
                       <span>Links ou IDs do Drive (Um por linha)</span>
                       {isSaving && <span className="text-primary">Processando: {importProgress.current} / {importProgress.total}</span>}
                    </label>
                    
                    <div className="relative">
                      <textarea 
                        required
                        disabled={isSaving}
                        rows={8}
                        value={bulkUrls}
                        onChange={(e) => setBulkUrls(e.target.value)}
                        placeholder="Cole aqui a coluna do seu Sheets com os IDs...&#10;1_A2B3C4D5...&#10;1_X6Y7Z8W9..."
                        className={`w-full bg-surface-container-low border p-4 font-mono text-xs outline-none focus:border-primary transition-all resize-none shadow-inner ${isSaving ? 'opacity-50 border-primary/20' : 'border-primary/20'}`}
                      />
                      
                      {isSaving && (
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex flex-col items-center justify-center gap-4">
                           <div className="w-64 h-1 bg-surface-container overflow-hidden rounded-full relative">
                              <motion.div 
                                className="absolute inset-y-0 left-0 bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                              />
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                              Sincronizando Arquivos...
                           </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <label>
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-2">Categoria Padrão</span>
                      <select 
                        disabled={isSaving}
                        value={bulkCategory}
                        onChange={(e) => setBulkCategory(e.target.value)}
                        className="w-full bg-surface-container-low border border-primary/20 p-3 text-xs outline-none focus:border-primary font-body"
                      >
                        <option value="Civis e Pessoais">Registros Civis</option>
                        <option value="Família e Relações">Família e Relações</option>
                        <option value="Patrimônio e Negócios">Patrimônio e Negócios</option>
                        <option value="Impostos e Burocracia">Impostos e Burocracia</option>
                      </select>
                    </label>
                    <label>
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-secondary mb-2">Ano Aproximado</span>
                      <input 
                        disabled={isSaving}
                        type="text"
                        placeholder="Ex: 1945"
                        value={bulkYear}
                        onChange={(e) => setBulkYear(e.target.value)}
                        className="w-full bg-surface-container-low border border-primary/20 p-3 text-xs outline-none focus:border-primary font-body"
                      />
                    </label>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="submit"
                      disabled={isSaving || !bulkUrls.trim()}
                      className="flex-1 bg-primary text-on-primary py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={16} /> : <div className="flex items-center gap-2"><Upload size={16} /> Iniciar Importação</div>}
                    </button>
                    {!isSaving && (
                      <button 
                        type="button"
                        onClick={() => setIsBulkImportOpen(false)}
                        className="px-8 border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditorOpen && selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-on-background/60 backdrop-blur-sm z-[1500]"
              onClick={() => setIsEditorOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-background shadow-2xl z-[1510] flex flex-col washi-texture overflow-hidden"
            >
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
                <div>
                   <h2 className="font-noto-serif text-2xl font-bold">{selectedItem.id ? 'Editar Registro' : 'Novo Registro'}</h2>
                   <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-1">
                      {activeTab === 'artifacts' ? (selectedItem.type === 'PHOTO' ? 'Fotografia' : 'Documento Histórico') : 'Evento Cronológico'}
                   </p>
                </div>
                <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors text-secondary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                {activeTab === 'artifacts' ? (
                  <>
                    <div className="space-y-6">
                      {/* Type Toggle */}
                      <div className="flex p-1 bg-surface-container rounded-lg gap-1">
                         <button 
                            type="button"
                            onClick={() => setSelectedItem({...selectedItem, type: 'PHOTO'})}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${selectedItem.type === 'PHOTO' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
                         >
                            Fotografia
                         </button>
                         <button 
                            type="button"
                            onClick={() => setSelectedItem({...selectedItem, type: 'DOCUMENT'})}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${selectedItem.type === 'DOCUMENT' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
                         >
                            Documento PDF
                         </button>
                      </div>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Título do Registro</span>
                        <input 
                          required
                          value={selectedItem.title} 
                          onChange={e => setSelectedItem({...selectedItem, title: e.target.value})}
                          placeholder="Ex: Certidão de Imigração"
                          className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-noto-serif text-lg"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-6">
                        <label className="block">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Ano</span>
                          <input 
                            value={selectedItem.year || ''} 
                            onChange={e => setSelectedItem({...selectedItem, year: e.target.value})}
                            placeholder="Ex: 1924"
                            className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Categoria</span>
                          <select 
                            value={selectedItem.category || 'Família e Relações'} 
                            onChange={e => setSelectedItem({...selectedItem, category: e.target.value})}
                            className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm"
                          >
                            <option value="Civis e Pessoais">1. Registros Civis e Pessoais</option>
                            <option value="Família e Relações">2. Família e Relações</option>
                            <option value="Patrimônio e Negócios">3. Imigração, Patrimônio e Negócios</option>
                            <option value="Impostos e Burocracia">4. Impostos e Burocracia</option>
                          </select>
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Localização</span>
                        <input 
                          value={selectedItem.location || ''} 
                          onChange={e => setSelectedItem({...selectedItem, location: e.target.value})}
                          placeholder="Ex: Santos, SP"
                          className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm"
                        />
                      </label>

                      {/* Translations for Documents */}
                      {selectedItem.type === 'DOCUMENT' && (
                         <div className="space-y-6 pt-4 border-t border-outline-variant/10">
                            <label className="block">
                               <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-2 block">Texto Original (Japonês/Outros)</span>
                               <textarea 
                                 rows={4}
                                 value={selectedItem.originalText || ''} 
                                 onChange={e => setSelectedItem({...selectedItem, originalText: e.target.value})}
                                 placeholder="Digite o texto como aparece no documento original..."
                                 className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-noto-serif text-sm italic"
                               />
                            </label>
                            <label className="block">
                               <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-2 block">Tradução para Português</span>
                               <textarea 
                                 rows={4}
                                 value={selectedItem.translationText || ''} 
                                 onChange={e => setSelectedItem({...selectedItem, translationText: e.target.value})}
                                 placeholder="Tradução literal ou resumida..."
                                 className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-body text-sm"
                               />
                            </label>
                         </div>
                      )}

                      {/* Citations / Member Tagging */}
                      <div className="pt-6 border-t border-outline-variant/10">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-4 block flex items-center gap-2">
                            <Users size={12} /> Pessoas Citadas no Registro
                         </span>
                         
                         {/* Selected Tags */}
                         <div className="flex flex-wrap gap-2 mb-4">
                            {selectedItem.citations?.map((memberId: string) => {
                               const member = members.find(m => m.id === memberId);
                               const displayName = member ? `${member.firstName} ${member.lastName || ''}` : 'Membro desconhecido';
                               return (
                                  <div key={memberId} className="flex items-center gap-2 px-3 py-1 bg-primary text-on-primary rounded-full text-[10px] font-bold group">
                                     {displayName}
                                     <button type="button" onClick={() => toggleCitation(memberId)} className="hover:text-error transition-colors">
                                        <X size={10} />
                                     </button>
                                  </div>
                               );
                            })}
                            {(!selectedItem.citations || selectedItem.citations.length === 0) && (
                               <p className="text-[10px] text-secondary italic">Nenhuma pessoa marcada neste registro.</p>
                            )}
                         </div>

                         {/* Search Selector */}
                         <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                            <input 
                               type="text"
                               placeholder="Buscar membro para marcar..."
                               value={memberSearch}
                               onChange={(e) => setMemberSearch(e.target.value)}
                               className="w-full pl-9 pr-4 py-3 bg-surface-container border border-outline-variant/10 text-xs outline-none focus:border-primary transition-all"
                            />
                            {memberSearch && (
                               <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border border-outline-variant/20 z-50 max-h-[150px] overflow-y-auto">
                                  {availableMembers.map(m => (
                                     <button 
                                        key={m.id}
                                        type="button"
                                        onClick={() => { toggleCitation(m.id); setMemberSearch(''); }}
                                        className="w-full px-4 py-2 text-left text-[10px] font-bold hover:bg-surface-container flex items-center justify-between group"
                                     >
                                        <span>{m.firstName} {m.lastName}</span>
                                        <UserPlus size={12} className="opacity-0 group-hover:opacity-100 text-primary" />
                                     </button>
                                  ))}
                                  {availableMembers.length === 0 && (
                                     <div className="p-4 text-[10px] text-secondary text-center">Nenhum membro encontrado.</div>
                                  )}
                               </div>
                            )}
                         </div>
                      </div>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">{selectedItem.type === 'PHOTO' ? 'Imagem (Acervo)' : 'Arquivo (PDF/DOC)'}</span>
                        <div className="flex gap-3">
                           <input 
                            value={selectedItem.mediaUrl || ''} 
                            onChange={e => {
                               const val = e.target.value;
                               // Auto-format drive links if pasted
                               const formatted = formatDriveEmbedUrl(val);
                               setSelectedItem({...selectedItem, mediaUrl: formatted});
                            }}
                            placeholder="URL do arquivo..."
                            className="flex-1 bg-surface-container-low border-b border-primary/30 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-xs"
                          />
                          <label className="p-3 bg-white border border-outline-variant/30 text-primary hover:bg-surface-container cursor-pointer transition-all shadow-sm">
                             <Upload size={18} />
                             <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
                          </label>
                        </div>
                        {selectedItem.mediaUrl && selectedItem.type === 'PHOTO' && (
                          <div className="mt-4 aspect-video bg-black/5 flex items-center justify-center border border-outline-variant/10 overflow-hidden">
                             <img src={selectedItem.mediaUrl} className="max-w-full max-h-full object-contain grayscale" alt="Preview" />
                          </div>
                        )}
                        {selectedItem.mediaUrl && selectedItem.type === 'DOCUMENT' && (
                           <div className="mt-4 p-4 bg-surface-container-high rounded border border-outline-variant/20 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <FileText size={20} className="text-primary" />
                                 <span className="text-[10px] font-bold font-mono truncate max-w-[200px]">{selectedItem.mediaUrl.split('/').pop()}</span>
                              </div>
                              <a href={selectedItem.mediaUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                                 Visualizar <ArrowRight size={12} />
                              </a>
                           </div>
                        )}
                      </label>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Contexto Histórico / Notas</span>
                        <textarea 
                          rows={4}
                          value={selectedItem.contextDescription || ''} 
                          onChange={e => setSelectedItem({...selectedItem, contextDescription: e.target.value})}
                          placeholder="Conte a história por trás deste registro..."
                          className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-body text-sm resize-none italic"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <label className="block">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Ano</span>
                          <input 
                            required
                            type="number"
                            value={selectedItem.year} 
                            onChange={e => setSelectedItem({...selectedItem, year: e.target.value})}
                            className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-noto-serif text-2xl italic text-primary"
                          />
                        </label>
                        <label className="block md:col-span-3">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Título do Evento</span>
                          <input 
                            required
                            value={selectedItem.title} 
                            onChange={e => setSelectedItem({...selectedItem, title: e.target.value})}
                            placeholder="O que aconteceu?"
                            className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-noto-serif text-lg"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Local</span>
                        <input 
                          value={selectedItem.location || ''} 
                          onChange={e => setSelectedItem({...selectedItem, location: e.target.value})}
                          placeholder="Cidade, País"
                          className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-body text-sm"
                        />
                      </label>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Descrição Detalhada</span>
                        <textarea 
                          rows={8}
                          value={selectedItem.description || ''} 
                          onChange={e => setSelectedItem({...selectedItem, description: e.target.value})}
                          placeholder="Detalhes sobre este marco histórico..."
                          className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-3 outline-none focus:border-primary transition-colors font-body text-sm leading-relaxed"
                        />
                      </label>

                      <label className="block">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block">Ícone Visual</span>
                        <select 
                          value={selectedItem.iconName || 'Clock'} 
                          onChange={e => setSelectedItem({...selectedItem, iconName: e.target.value})}
                          className="w-full bg-surface-container-low border-b border-primary/30 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm"
                        >
                          <option value="Clock">Relógio (Padrão)</option>
                          <option value="Ship">Navio (Imigração)</option>
                          <option value="Building2">Construção/Origem</option>
                          <option value="MapPin">Localização/Expansão</option>
                          <option value="GraduationCap">Estudos/Conquista</option>
                          <option value="Anchor">Estabilidade/Marco</option>
                        </select>
                      </label>
                    </div>
                  </>
                )}
              </form>

              <div className="p-8 border-t border-outline-variant/10 flex gap-4 bg-surface-container-low">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-primary text-on-primary py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Gravar Alterações
                </button>
                {selectedItem.id && (
                   <button 
                    type="button"
                    onClick={() => handleDelete(selectedItem.id)}
                    className="px-6 bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center border border-error/20 shadow-lg"
                   >
                     <Trash2 size={20} />
                   </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchiveManager;
