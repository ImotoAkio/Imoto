import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Maximize2, X, User, Search, Navigation } from 'lucide-react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { fetchMembers } from '../lib/api';
import { getLayoutedElements } from '../lib/layout';
import ArchivalNode from '../components/ArchivalNode';
import ArchivalEdge from '../components/ArchivalEdge';

const SmartControls: React.FC<{ selectedId: string | null }> = ({ selectedId }) => {
  const { zoomIn, zoomOut, fitView, setCenter, getNodes } = useReactFlow();
  const handleCenter = useCallback(() => {
    if (selectedId) {
      const node = getNodes().find((n) => n.id === selectedId);
      if (node) setCenter(node.position.x + 72, node.position.y + 96, { zoom: 1, duration: 800 });
    } else {
      fitView({ duration: 800, padding: 0.2 });
    }
  }, [selectedId, fitView, setCenter, getNodes]);

  useEffect(() => {
    if (selectedId) handleCenter();
  }, [selectedId, handleCenter]);

  return (
    <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-40 flex flex-col gap-3">
      <div className="flex gap-2">
        <button onClick={() => zoomIn()} className="bg-white p-4 shadow-2xl hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/20"><Plus size={24} /></button>
        <button onClick={() => zoomOut()} className="bg-white p-4 shadow-2xl hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/20"><Minus size={24} /></button>
      </div>
      <button onClick={handleCenter} className="bg-white p-4 shadow-2xl hover:bg-primary hover:text-on-primary border border-outline-variant/20 flex items-center justify-center gap-3 w-full">
        <Maximize2 size={24} /> <span className="text-[10px] font-bold uppercase tracking-widest">{selectedId ? 'Focar' : 'Centralizar'}</span>
      </button>
    </div>
  );
};

const ProfileModal: React.FC<{ member: any; onClose: () => void }> = ({ member, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-on-background/40 backdrop-blur-sm">
    <div className="bg-background w-full max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
      <div className="w-full md:w-2/5 h-64 md:h-auto bg-surface-container-low flex items-center justify-center shrink-0">
        {member.profileImage ? <img src={member.profileImage} className="w-full h-full object-cover grayscale" alt="" /> : <User size={80} className="text-secondary/20" />}
      </div>
      <div className="w-full md:w-3/5 p-8 md:p-16 relative overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-3 hover:bg-surface-container-high transition-colors"><X size={28} /></button>
        <div className="mb-16">
          <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-primary">{member.generation}</span>
          <h2 className="text-5xl md:text-7xl font-noto-serif italic leading-tight">{member.firstName} {member.lastName}</h2>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.3em] text-secondary font-bold">
              {member.birthYear || '?'} — {member.deathYear ? member.deathYear : (member.isDeceased ? 'Falecido' : 'Presente')}
            </span>
            <div className="h-[1px] w-12 bg-primary/30"></div>
          </div>
        </div>
        <p className="text-sm font-body leading-relaxed text-on-surface-variant italic">"{member.shortQuote || 'Guardando a memória da família.'}"</p>
      </div>
    </div>
  </div>
);

const GenealogyContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodeTypes = useMemo(() => ({ archivalCard: ArchivalNode }), []);
  const edgeTypes = useMemo(() => ({ archivalEdge: ArchivalEdge }), []);

  const buildGraph = useCallback(() => {
    if (allMembers.length === 0) return;

    try {
      const initialNodes: Node[] = [];
      const initialEdges: Edge[] = [];

      allMembers.forEach((m) => {
        initialNodes.push({
          id: m.id.toString(),
          type: 'archivalCard',
          position: { x: 0, y: 0 },
          data: { ...m, hasChildren: false, isExpanded: false }
        });

        if (m.parents) {
          m.parents.forEach((p: any) => {
            initialEdges.push({
              id: `e-${p.id}-${m.id}`,
              source: p.id.toString(),
              target: m.id.toString(),
              type: 'archivalEdge',
            });
          });
        }
      });

      const { nodes: lNodes, edges: lEdges } = getLayoutedElements(initialNodes, initialEdges);
      setNodes(lNodes);
      setEdges(lEdges);
    } catch (e) {
      console.error('Layout error:', e);
    }
  }, [allMembers, setNodes, setEdges]);

  useEffect(() => {
    if (!isLoading) buildGraph();
  }, [buildGraph, isLoading]);

  useEffect(() => {
    fetchMembers().then(data => {
      setAllMembers(data);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Fetch error:', err);
      setIsLoading(false);
    });
  }, []);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (selectedMember?.id === node.id) setIsModalOpen(true);
    else { setSelectedMember(node.data); }
  }, [selectedMember]);

  if (isLoading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background font-noto-serif italic gap-4">
      <div className="w-12 h-12 border-t-2 border-primary animate-spin rounded-full"></div>
      <p className="text-secondary/60 animate-pulse text-sm">Restaurando Arquivos...</p>
    </div>
  );

  return (
    <div className="h-full overflow-hidden relative archival-grid">

      <div className="absolute top-12 left-12 z-50">
        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="bg-white p-4 shadow-xl border border-outline-variant/10 flex items-center gap-3">
          <Search size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Buscar</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={onNodeClick}
        nodeTypes={nodeTypes} edgeTypes={edgeTypes} connectionMode={ConnectionMode.Loose} fitView
        minZoom={0.05} maxZoom={5}
        nodesDraggable={true} zoomOnDoubleClick={false} className="archival-flow"
      >
        <Background color="#1C352D" gap={40} size={1} opacity={0.03} />
        <Panel position="bottom-left"><SmartControls selectedId={selectedMember?.id || null} /></Panel>
      </ReactFlow>

      {isModalOpen && selectedMember && <ProfileModal member={selectedMember} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default function Genealogy() {
  return <ReactFlowProvider><GenealogyContent /></ReactFlowProvider>;
}
