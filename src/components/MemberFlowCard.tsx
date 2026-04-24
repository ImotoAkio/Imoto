import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';
import { resolveImageUrl } from '../lib/api';

export default function MemberFlowCard({ data, selected }: any) {
  const imageUrl = resolveImageUrl(data.profileImage);
  
  return (
    <div className={`relative bg-surface-container-low border-2 shadow-2xl p-4 w-48 text-center transition-all ${selected ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-outline-variant/30 hover:border-primary/50'}`}>
      {/* Entrada: Terceiro Pai conectando na cabeça */}
      <Handle type="target" position={Position.Top} id="parent-in" style={{ width: 12, height: 12, background: '#1C352D' }} />
      
      {/* Saída/Entrada: Cônjuge (lados) */}
      <Handle type="source" position={Position.Left} id="s-l" style={{ width: 12, height: 12, background: '#8A7B5E', borderRadius: '0', left: -6 }} />
      <Handle type="source" position={Position.Right} id="s-r" style={{ width: 12, height: 12, background: '#8A7B5E', borderRadius: '0', right: -6 }} />

      <div className="w-16 h-20 mx-auto bg-surface-container-high mb-3 flex items-center justify-center grayscale overflow-hidden">
         {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <User className="text-secondary/30" />}
      </div>
      
      <p className="font-noto-serif font-bold text-sm leading-tight text-on-surface break-words">{data.firstName} {data.lastName}</p>
      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 truncate">{data.generation || 'Sem Geração'}</p>

      {/* Saída: Filhos descendo dos pés */}
      <Handle type="source" position={Position.Bottom} id="child-out" style={{ width: 12, height: 12, background: '#1C352D' }} />
      
      {data.isTargetting && <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary"></div>}
    </div>
  );
}
