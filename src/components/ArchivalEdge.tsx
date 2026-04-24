import React from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export default function ArchivalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const isMarriage = data?.type === 'marriage';
  
  // Professional orthogonal "FamilySearch" routing using SmoothStep with 0 radius
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0, // Strict 90-degree angles
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: isMarriage ? 2 : 1.2,
        stroke: '#1C352D',
        opacity: isMarriage ? 0.4 : 0.2,
        transition: 'all 0.5s ease',
      }}
    />
  );
}
