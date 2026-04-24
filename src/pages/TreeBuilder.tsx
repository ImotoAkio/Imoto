import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Edge, 
  Node, 
  MarkerType,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Plus, RefreshCw, Save, Trash2, LayoutTemplate, Link, UserPlus, Scissors, UserMinus, Search, Image as ImageIcon, Upload } from 'lucide-react';
import { fetchMembers, createMember, updateMember, deleteMember, connectMember, disconnectMember, uploadImage } from '../lib/api';
import MemberFlowCard from '../components/MemberFlowCard';
import { getLayoutedElements } from '../lib/layout';

export default function TreeBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLinker, setShowLinker] = useState(false);

  // Memoize custom node types
  const nodeTypes = useMemo(() => ({ memberCard: MemberFlowCard }), []);

  // Sync Nodes visual state when selection changes
  useEffect(() => {
     setNodes((nds) => nds.map((node) => ({
        ...node,
        data: { ...node.data, selected: node.id === selectedNodeId }
     })));
  }, [selectedNodeId, setNodes]);

  const loadDataAndLayout = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMembers();
      console.log(`Loaded ${data.length} members from API`);
      setMembers(data);

      const initialNodes: Node[] = [];
      const initialEdges: Edge[] = [];

      data.forEach((m: any) => {
        // Node
        initialNodes.push({
          id: m.id,
          type: 'memberCard',
          position: { x: 0, y: 0 }, // will be set by dagre
          data: { ...m, label: m.firstName },
        });

        // Edge: Parent -> Child (Multiple Parents Support)
        if (m.parents && m.parents.length > 0) {
          m.parents.forEach((parent: any) => {
            initialEdges.push({
              id: `e-${parent.id}-${m.id}`,
              source: parent.id,
              target: m.id,
              sourceHandle: 'child-out',
              targetHandle: 'parent-in',
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#1C352D', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#1C352D' },
              interactionWidth: 20,
            });
          });
        }

        // Edge: Spouse -> Spouse
        if (m.spouseId) {
          initialEdges.push({
            id: `e-sp-${m.id}-${m.spouseId}`,
            source: m.id,
            target: m.spouseId,
            sourceHandle: 's-r',
            targetHandle: 's-l',
            type: 'straight',
            animated: true,
            style: { stroke: '#8A7B5E', strokeWidth: 2, strokeDasharray: '5,5' },
            interactionWidth: 20,
          });
        }
      });

      // Apply auto layout
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
      
      console.log(`Setting ${layoutedNodes.length} nodes and ${layoutedEdges.length} edges to state`);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (e) {
      console.error(e);
      alert('Falha ao carregar motor do Canvas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAndLayout();
  }, []);

  const onConnect = useCallback(async (params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    
    try {
      if (params.source === params.target) {
         throw new Error("Não é possível conectar a pessoa a ela mesma.");
      }

      // Check which handles were connected (accounting for reverse loose dragging)
      const isSpouse = params.sourceHandle?.startsWith('s-') || params.targetHandle?.startsWith('s-');
      
      if (!isSpouse) {
         // Parent-Child connection. Identify who is who by Handle IDs
         const parentId = params.sourceHandle === 'child-out' ? params.source : (params.targetHandle === 'child-out' ? params.target : null);
         const childId = params.targetHandle === 'parent-in' ? params.target : (params.sourceHandle === 'parent-in' ? params.source : null);
         
         if (parentId && childId) {
            console.log(`Linking Parent ${parentId} to Child ${childId}`);
            await connectMember(childId, 'parent', parentId);
         } else {
            console.warn("Ligação inválida entre canais. Use Pé -> Topo.");
         }
      } else {
         // Spouse connection.
         console.log(`Marrying ${params.source} with ${params.target}`);
         await connectMember(params.source, 'spouse', params.target);
      }
      
      // Refresh tree to get DB state synced
      loadDataAndLayout();
    } catch (e: any) {
      alert(e.message || 'Erro ao conectar. Tente novamente.');
      loadDataAndLayout(); // Revert visual edge
    }
  }, [setEdges]);

  const onEdgesDelete = useCallback(async (deleted: Edge[]) => {
    for (const edge of deleted) {
      try {
        if (edge.id.startsWith('e-sp-')) {
          // Spouse disconnection
          const ids = edge.id.replace('e-sp-', '').split('-');
          if (ids.length === 2) {
             console.log(`Breaking marriage between ${ids[0]} and ${ids[1]}`);
             await disconnectMember(ids[0], 'spouse', ids[1]);
          }
        } else if (edge.id.startsWith('e-')) {
          // Parent-Child disconnection
          const ids = edge.id.replace('e-', '').split('-');
          if (ids.length === 2) {
             const parentId = ids[0];
             const childId = ids[1];
             console.log(`Disconnecting Parent ${parentId} from Child ${childId}`);
             await disconnectMember(childId, 'parent', parentId);
          }
        }
      } catch (e) {
        console.error("Erro ao deletar laço no banco", e);
      }
    }
    // Refresh to ensure state is clean
    loadDataAndLayout();
  }, []);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    const member = members.find(m => m.id === node.id);
    setFormData(member);
    setIsSidebarOpen(true);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
    setIsSidebarOpen(false);
  };

  const handleCreateNew = () => {
    setSelectedNodeId('new');
    setFormData({
      firstName: '',
      lastName: '',
      birthYear: '',
      deathYear: '',
      generation: '',
      locationOrigin: '',
      occupation: '',
      shortQuote: '',
      biography: '',
      profileImage: '',
      isDeceased: false,
    });
    setIsSidebarOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     
     setIsSaving(true);
     try {
        const { url } = await uploadImage(file);
        handleInputChange('profileImage', url);
     } catch (error) {
        alert('Erro ao carregar imagem');
     } finally {
        setIsSaving(false);
     }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedData = {
      ...formData,
      birthYear: formData.birthYear === "" ? null : formData.birthYear,
      deathYear: formData.deathYear === "" ? null : formData.deathYear,
      isDeceased: formData.isDeceased || formData.deathYear !== "",
    };

    setIsSaving(true);
    try {
      if (selectedNodeId === 'new') {
        await createMember(sanitizedData);
      } else if (selectedNodeId) {
        await updateMember(selectedNodeId, sanitizedData);
      }
      setIsSidebarOpen(false);
      setSelectedNodeId(null);
      loadDataAndLayout();
    } catch (error: any) {
       console.error("Save error", error);
       alert(`Erro ao salvar: ${error.message || "Erro interno do servidor"}`);
    } finally {
       setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNodeId || selectedNodeId === 'new') return;
    if (confirm('Deletar este membro permanentemente do painel visual?')) {
      await deleteMember(selectedNodeId);
      setIsSidebarOpen(false);
      setSelectedNodeId(null);
      loadDataAndLayout();
    }
  };

  const performLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges]);

  const handleDisconnect = async (type: 'parent' | 'spouse', targetId: string) => {
    if (!selectedNodeId) return;
    try {
      await disconnectMember(selectedNodeId, type, targetId);
      loadDataAndLayout();
    } catch (e) {
      alert("Falha ao desconectar");
    }
  };

  const handleConnect = async (type: 'parent' | 'spouse', targetId: string) => {
    if (!selectedNodeId) return;
    try {
      await connectMember(selectedNodeId, type, targetId);
      setShowLinker(false);
      setSearchQuery('');
      loadDataAndLayout();
    } catch (e) {
      alert("Falha ao conectar");
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return [];
    return members.filter(m => 
      m.id !== selectedNodeId && 
      (m.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
       m.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);
  }, [members, searchQuery, selectedNodeId]);

  return (
    <div className="h-full bg-background flex flex-col md:flex-row relative">
      
      {/* TOOLBAR */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
         <button onClick={handleCreateNew} className="bg-primary text-on-primary px-4 py-2 font-noto-serif font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-primary/95 transition-all">
            <Plus size={16} /> Novo Membro
         </button>
         <button onClick={performLayout} className="bg-white text-secondary px-4 py-2 font-noto-serif font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-surface-container transition-all border border-outline-variant/20">
            <LayoutTemplate size={16} /> Auto-Organizar
         </button>
         <button onClick={loadDataAndLayout} className="bg-white text-secondary p-2 shadow-xl hover:bg-surface-container transition-all border border-outline-variant/20">
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
         </button>
      </div>

      {/* CANVAS */}
      <div className="flex-1 w-full h-full relative">
         <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgesDelete={onEdgesDelete}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            minZoom={0.05}
            maxZoom={5}
            className="bg-surface-container-low/30"
         >
            <Background color="#1C352D" gap={30} size={1} />
            <Controls className="bg-white border-outline-variant/30 text-primary !shadow-2xl" />
            <MiniMap 
               nodeColor={(n) => n.id === selectedNodeId ? '#8A7B5E' : '#EAE8E3'} 
               maskColor="rgba(245, 244, 240, 0.7)"
               className="border border-outline-variant/20 shadow-xl"
            />
         </ReactFlow>
         
         <div className="absolute bottom-4 left-16 z-10 bg-white/80 p-3 text-[10px] uppercase font-bold tracking-widest text-secondary shadow-lg pointer-events-none backdrop-blur border border-outline-variant/10">
            Dica: Arraste a linha do pé de alguém para a cabeça p/ Criar Filhos, e Lado para Lado p/ Casamento.
         </div>
      </div>

      {/* SIDEBAR EDIT FORM */}
      {isSidebarOpen && formData && (
        <div key={selectedNodeId} className="w-full md:w-[450px] h-full bg-white border-l border-outline-variant/20 flex flex-col z-20 absolute md:relative right-0 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
            <div>
               <h2 className="font-noto-serif text-2xl font-bold tracking-tight">
                  {selectedNodeId === 'new' ? 'Novo Registro' : 'Ficha de Mesa'}
               </h2>
               <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 text-ellipsis overflow-hidden w-64 whitespace-nowrap">ID: {selectedNodeId === 'new' ? 'Pendente' : selectedNodeId}</p>
            </div>
            <button onClick={onPaneClick} className="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container rounded-full grayscale opacity-50 hover:opacity-100">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 flex-1 overflow-y-auto space-y-6 flex flex-col">
            {isSaving && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                     <RefreshCw className="animate-spin text-primary" size={32} />
                     <p className="text-[10px] uppercase font-bold tracking-widest text-primary animate-pulse">Gravando Ficha...</p>
                  </div>
               </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Nome</label>
                  <input required value={formData.firstName || ''} onChange={e => handleInputChange('firstName', e.target.value)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-noto-serif text-sm" />
               </div>
               <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Sobrenome</label>
                  <input required value={formData.lastName || ''} onChange={e => handleInputChange('lastName', e.target.value)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-noto-serif text-sm" />
               </div>
            </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Nascimento (Ano)</label>
                   <input type="number" value={formData.birthYear || ''} onChange={e => handleInputChange('birthYear', e.target.value ? parseInt(e.target.value) : null)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm" />
                </div>
                <div>
                   <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary">Falecimento (Ano)</label>
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                         <input 
                            type="checkbox" 
                            checked={formData.isDeceased || false} 
                            onChange={e => handleInputChange('isDeceased', e.target.checked)}
                            className="w-3 h-3 accent-primary" 
                         />
                         <span className="text-[10px] uppercase font-bold text-secondary">Falecido</span>
                      </label>
                   </div>
                   <input type="number" placeholder="Deixe branco p/ vivo" value={formData.deathYear || ''} onChange={e => handleInputChange('deathYear', e.target.value ? parseInt(e.target.value) : null)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm" />
                </div>
             </div>

            <div>
               <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Geração (Ex: Issei)</label>
               <input value={formData.generation || ''} onChange={e => handleInputChange('generation', e.target.value)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm" />
            </div>

            <div>
               <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Imagem de Perfil</label>
               <div className="flex gap-2">
                  <input value={formData.profileImage || ''} onChange={e => handleInputChange('profileImage', e.target.value)} placeholder="URL da foto ou faça upload..." className="flex-1 bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm" />
                  <label className="bg-white border border-outline-variant/30 p-2 text-primary hover:bg-surface-container cursor-pointer transition-all shadow-sm flex items-center justify-center">
                     <Upload size={16} />
                     <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
               </div>
               {formData.profileImage && (
                  <div className="mt-2 relative w-20 h-20 group">
                     <img src={formData.profileImage} className="w-full h-full rounded border grayscale object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] uppercase font-bold">Preview</div>
                  </div>
               )}
            </div>

            <div>
               <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Citação Guiadora</label>
               <textarea rows={2} value={formData.shortQuote || ''} onChange={e => handleInputChange('shortQuote', e.target.value)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-noto-serif italic resize-y text-sm" />
            </div>

            <div>
               <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Biografia Resumida</label>
               <textarea rows={6} value={formData.biography || ''} onChange={e => handleInputChange('biography', e.target.value)} className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body resize-y text-sm" />
            </div>

            {/* SEÇÃO DE RELACIONAMENTOS (O "CODEX") */}
            {selectedNodeId !== 'new' && (
               <div className="pt-6 border-t border-outline-variant/10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Vínculos Familiares</h3>
                  
                  {/* Pais Atuais */}
                  <div className="space-y-3 mb-6">
                     <p className="text-[9px] uppercase font-bold text-secondary/60 tracking-wider">Ascendentes (Pais)</p>
                     {formData.parents && formData.parents.length > 0 ? (
                        formData.parents.map((p: any) => (
                           <div key={p.id} className="flex items-center justify-between bg-surface-container-low p-2 border border-outline-variant/5">
                              <span className="text-xs font-noto-serif">{p.firstName} {p.lastName}</span>
                              <button type="button" onClick={() => handleDisconnect('parent', p.id)} className="text-secondary/40 hover:text-error transition-colors">
                                 <Scissors size={14} />
                              </button>
                           </div>
                        ))
                     ) : (
                        <p className="text-[10px] italic text-secondary/40">Nenhum pai vinculado.</p>
                     )}
                  </div>

                  {/* Cônjuge Atual */}
                  <div className="space-y-3 mb-8">
                     <p className="text-[9px] uppercase font-bold text-secondary/60 tracking-wider">Cônjuge</p>
                     {formData.spouse ? (
                        <div className="flex items-center justify-between bg-surface-container-low p-2 border border-outline-variant/5 italic text-primary font-noto-serif">
                           <span className="text-xs">{formData.spouse.firstName} {formData.spouse.lastName}</span>
                           <button type="button" onClick={() => handleDisconnect('spouse', formData.spouse.id)} className="text-secondary/40 hover:text-error transition-colors">
                              <Scissors size={14} />
                           </button>
                        </div>
                     ) : (
                        <p className="text-[10px] italic text-secondary/40">Nenhum cônjuge vinculado.</p>
                     )}
                  </div>

                  {/* Gerenciador de Novos Vínculos */}
                  {!showLinker ? (
                     <button 
                        type="button" 
                        onClick={() => setShowLinker(true)}
                        className="w-full border border-dashed border-primary/30 text-primary py-2 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
                     >
                        <Link size={14} /> Vincular Novo Indivíduo
                     </button>
                  ) : (
                     <div className="bg-surface-container p-4 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Buscar Parente</span>
                           <button type="button" onClick={() => setShowLinker(false)} className="text-secondary hover:text-primary"><X size={14} /></button>
                        </div>
                        
                        <div className="relative">
                           <Search className="absolute left-3 top-3 text-secondary/40" size={14} />
                           <input 
                              autoFocus
                              placeholder="Digite um nome..."
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant/30 text-sm outline-none focus:border-primary"
                           />
                        </div>

                        {filteredMembers.length > 0 && (
                           <div className="space-y-1">
                              {filteredMembers.map(m => (
                                 <div key={m.id} className="bg-white border border-outline-variant/10 p-2 flex flex-col gap-2">
                                    <div className="font-noto-serif text-xs font-bold">{m.firstName} {m.lastName}</div>
                                    <div className="flex gap-2">
                                       <button 
                                          type="button" 
                                          onClick={() => handleConnect('parent', m.id)}
                                          className="flex-1 bg-surface-container py-1 text-[8px] uppercase font-bold hover:bg-primary hover:text-white transition-all"
                                       >
                                          É Pai/Mãe
                                       </button>
                                       <button 
                                          type="button" 
                                          onClick={() => handleConnect('spouse', m.id)}
                                          className="flex-1 bg-surface-container py-1 text-[8px] uppercase font-bold hover:bg-primary hover:text-white transition-all"
                                       >
                                          É Cônjuge
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                        {searchQuery && filteredMembers.length === 0 && (
                           <p className="text-[10px] text-secondary/60 text-center italic py-2">Nenhum membro encontrado.</p>
                        )}
                     </div>
                  )}
               </div>
            )}

            <div className="flex-1"></div> {/* Spacer */}

            <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
               <button type="submit" className="flex-1 bg-primary text-on-primary py-3 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-xl">
                  <Save size={14} /> {selectedNodeId === 'new' ? 'Baixar para o Canvas' : 'Atualizar'}
               </button>
               {selectedNodeId !== 'new' && (
                  <button type="button" onClick={handleDelete} className="px-4 bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center">
                     <Trash2 size={16} />
                  </button>
               )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
