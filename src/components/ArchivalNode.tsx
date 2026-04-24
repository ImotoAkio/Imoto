import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Plus, Minus } from 'lucide-react';

export default function ArchivalNode({ id, data, selected }: any) {
  const isSelected = selected || data.selected;
  const hasChildren = data.hasChildren;
  const isExpanded = data.isExpanded;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleExpand) {
      data.onToggleExpand(id);
    }
  };

  return (
    <div className="flex flex-col items-center group transition-all duration-500">
      {/* Handles for layout connectivity - keeping them hidden for the archival look */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="parent-in" 
        style={{ visibility: 'hidden', top: '50%' }} 
      />
      
      <div className={`relative w-36 h-48 bg-white p-1 shadow-xl transition-all duration-500 ${isSelected ? 'ring-[6px] ring-primary ring-offset-4 scale-105 z-20' : 'group-hover:scale-102 opacity-95 hover:opacity-100'}`}>
        <div className="absolute inset-0 border border-outline-variant/10 z-10 pointer-events-none"></div>
        {data.profileImage ? (
          <img 
            src={data.profileImage} 
            className={`w-full h-full object-cover grayscale transition-all duration-700 ${isSelected ? 'grayscale-0' : 'group-hover:grayscale-0'}`} 
            alt={`${data.firstName}`} 
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-secondary/30">
            <User size={32} strokeWidth={1} />
          </div>
        )}
        {isSelected && <div className="absolute top-2 right-2 hanko-seal-small scale-100 z-20 italic">印</div>}
      </div>

      <div className="mt-4 text-center w-full max-w-[140px]">
        <h3 className={`font-noto-serif font-bold text-sm tracking-tight leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-on-background/80'}`}>
          {data.firstName} <span className="block italic font-light text-[11px] opacity-70">{data.lastName}</span>
        </h3>
        <p className="text-secondary/60 text-[8px] uppercase tracking-[0.2em] mt-1 font-black">
          {data.birthYear || '?'} — {data.deathYear ? data.deathYear : (data.isDeceased ? 'Falec.' : 'Pres.')}
        </p>
      </div>

      {hasChildren && (
        <button 
          onClick={handleToggle}
          className={`absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border-2 bg-white flex items-center justify-center transition-all shadow-xl z-30 ${isExpanded ? 'border-primary text-primary scale-110' : 'border-outline-variant/50 text-secondary hover:border-primary hover:text-primary hover:scale-105'}`}
        >
          {isExpanded ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
        </button>
      )}

      {/* Logic Handles */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="child-out" 
        style={{ visibility: 'hidden', bottom: '50%' }} 
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        id="s-l" 
        style={{ visibility: 'hidden', left: '50%' }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="s-r" 
        style={{ visibility: 'hidden', right: '50%' }} 
      />
    </div>
  );
}
