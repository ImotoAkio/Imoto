import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MarriageNode() {
  return (
    <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
      {/* Handles for connections from parents (sideways or top) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="m-l" 
        style={{ visibility: 'hidden' }} 
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        id="m-r" 
        style={{ visibility: 'hidden' }} 
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="m-t" 
        style={{ visibility: 'hidden' }} 
      />

      {/* Visual marker of the union */}
      <div className="w-2 h-2 bg-primary/30 rotate-45 border border-primary/20"></div>

      {/* Handle for children sprouting downwards */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="m-out" 
        style={{ visibility: 'hidden' }} 
      />
    </div>
  );
}
