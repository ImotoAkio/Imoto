import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Defines standard width/height based on ArchivalNode & MarriageNode
const nodeWidth = 144; 
const nodeHeight = 250; 
const junctionWidth = 20;
const junctionHeight = 20;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  
  // Set layout options for professional archival feel
  dagreGraph.setGraph({ 
     rankdir: direction,
     ranksep: 180, // Vertical spacing between generations
     nodesep: 150, // Horizontal spacing between members
     edgesep: 100,
     marginx: 100,
     marginy: 100,
  });

  nodes.forEach((node) => {
    let width = nodeWidth;
    let height = nodeHeight;

    if (node.type === 'marriage') {
      width = junctionWidth;
      height = junctionHeight;
    } else if (node.id === 'add-node') {
      width = 100;
      height = 50;
    }

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    let width = nodeWidth;
    let height = nodeHeight;

    if (node.type === 'marriage') {
      width = junctionWidth;
      height = junctionHeight;
    } else if (node.id === 'add-node') {
      width = 100;
      height = 50;
    }

    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};
