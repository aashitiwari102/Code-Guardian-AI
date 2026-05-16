import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { PageHeader } from "@/components/PageHeader";
import { graphEdges, graphNodes } from "@/lib/mock-data";

export const Route = createFileRoute("/dasboard/architecture")({
  head: () => ({ meta: [{ title: "Architecture — CodeGuardian AI" }] }),
  component: Architecture,
});

const groupColor: Record<string, string> = {
  frontend: "#FF6FA6",
  backend: "#FF7A59",
  data: "#18B7B0",
  infra: "#FFD166",
  external: "#202B3D",
};

function Architecture() {
  const { nodes, edges } = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {
      ui: { x: 0, y: 0 },
      api: { x: 280, y: 0 },
      auth: { x: 560, y: -120 },
      billing: { x: 560, y: 120 },
      db: { x: 840, y: 0 },
      queue: { x: 840, y: 240 },
      mailer: { x: 1120, y: 240 },
      stripe: { x: 840, y: -160 },
    };
    const nodes: Node[] = graphNodes.map((n) => ({
      id: n.id,
      position: positions[n.id] ?? { x: 0, y: 0 },
      data: { label: n.label },
      style: {
        background: groupColor[n.group],
        color: n.group === "infra" ? "#202B3D" : "white",
        border: "2px solid #202B3D",
        borderRadius: 16,
        padding: "12px 18px",
        fontWeight: 600,
        fontFamily: "Fredoka, sans-serif",
        boxShadow: "4px 4px 0 #202B3D",
      },
    }));
    const edges: Edge[] = graphEdges.map((e, i) => ({
      id: `e${i}`,
      source: e.from,
      target: e.to,
      animated: true,
      style: { stroke: "#202B3D", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#202B3D" },
    }));
    return { nodes, edges };
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="architecture"
        title="Dependency map"
        description="Live graph of services, modules, and external dependencies. Drag to explore."
      />

      <div className="rounded-3xl bg-white p-3 retro-border retro-shadow">
        <div style={{ height: 560 }} className="rounded-2xl overflow-hidden retro-border">
          <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
            <Background color="#202B3D" gap={20} />
            <Controls />
          </ReactFlow>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 px-2 text-xs">
          {Object.entries(groupColor).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded retro-border" style={{ background: v }} />
              <span className="capitalize">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}