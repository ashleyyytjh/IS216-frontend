import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { GraphData } from "@/types/types";

export default function Graph({
  title,
  graph,
}: {
  title: string;
  graph?: GraphData;
}) {
  if (!graph || !graph.nodes?.length) {
    return (
      <div className="w-full h-screen border rounded-xl flex items-center justify-center text-muted-foreground">
        Nothing to see
      </div>
    );
  }

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const rfNodes: Node[] = graph.nodes.map((n) => ({
      id: n.id,
      data: { label: n.title },
      position: { x: 0, y: 0 },
      style: { background: getColorByType(n.type) },
      draggable: true,
    }));

    const rfEdges: Edge[] = graph.edges.map((e, i) => ({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      label: e.relation,
      animated: true,
    }));

    return layoutElements(rfNodes, rfEdges, "LR");
  }, [graph]);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
    []
  );

  return (
    <div className="w-full h-screen border rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Panel position="top-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {title}
          </h3>
        </Panel>
        <Background color="#aaa" gap={16} />
        <Controls position="top-right" />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

// default node size
const nodeWidth = 180;
const nodeHeight = 50;

export function layoutElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "BT" | "LR" | "RL" = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 30, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: Node[] = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id) as { x: number; y: number };
    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function getColorByType(type?: string): string {
  switch (type) {
    case "concept":
      return "#A5D8FF"; // blue
    case "subconcept":
      return "#B2F2BB"; // green
    case "keyword":
      return "#FFEC99"; // amber
    default:
      return "#fff";
  }
}