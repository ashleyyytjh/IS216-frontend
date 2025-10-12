import * as React from "react";
import { ReactFlow, Node, Edge, Position, Handle } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { NodeStatusIndicator } from "@/components/node-status-indicator";

/* ---------------- Types ---------------- */
export type UploadStage = "pending" | "uploaded" | "done";

export type UploadState = {
  stage: UploadStage;
  noteId?: string;
  error?: string;
};

type StepFinishProps = {
  file: File | null;
  state: UploadState;
  allDone: boolean;
  onGoToNotes?: () => void;
};

/* ---------------- Node component ---------------- */
function StatusNode({
  data,
}: {
  data: { label: string; status: "default" | "loading" | "success" | "error" };
}) {
  return (
    <NodeStatusIndicator status={data.status} variant="border">
      <BaseNode>
        <BaseNodeContent>{data.label}</BaseNodeContent>
      </BaseNode>
      <Handle type="target" position={Position.Left} id="l" isConnectable={false} />
      <Handle type="source" position={Position.Right} id="r" isConnectable={false} />
    </NodeStatusIndicator>
  );
}

const nodeTypes = { status: StatusNode };

/* ---------------- Helpers ---------------- */
const LABEL: Record<UploadStage, string> = {
  pending: "Pending",
  uploaded: "Uploaded",
  done: "Generated",
};

function toIndicator(
  stage: UploadStage,
  target: UploadStage,
  hasError: boolean
): "default" | "loading" | "success" | "error" {
  if (hasError) return "error";
  if (target === "pending") {
    return stage === "pending" ? "loading" : "success";
  }
  if (target === "uploaded") {
    if (stage === "pending") return "default";
    if (stage === "uploaded") return "loading";
    return "success";
  }
  return stage === "done" ? "success" : "default";
}

function edgeStyle(progressReached: boolean, error: boolean) {
  return {
    stroke: error ? "#ef4444" : progressReached ? "#22c55e" : "#cbd5e1",
    strokeWidth: 2,
  };
}

/* ---------------- Component ---------------- */
export default function StepFinish({ file, state, allDone, onGoToNotes }: StepFinishProps) {
  if (!file) {
    return (
      <section className="space-y-6 text-center py-10">
        <h2 className="text-lg font-medium text-muted-foreground">
          No file to display.
        </h2>
      </section>
    );
  }

  const hasError = !!state.error;

  const nodes: Node[] = (["pending", "uploaded", "done"] as UploadStage[]).map(
    (stage, i) => ({
      id: stage,
      type: "status",
      position: { x: i * 200, y: 0 },
      data: {
        label: LABEL[stage],
        status: toIndicator(state.stage, stage, hasError),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: false,
      selectable: false,
    })
  );

  const edges: Edge[] = [
    {
      id: "e-p-u",
      source: "pending",
      target: "uploaded",
      sourceHandle: "r",
      targetHandle: "l",
      animated: state.stage !== "pending",
      style: edgeStyle(state.stage !== "pending", hasError),
    },
    {
      id: "e-u-d",
      source: "uploaded",
      target: "done",
      sourceHandle: "r",
      targetHandle: "l",
      animated: state.stage === "done",
      style: edgeStyle(state.stage === "done", hasError),
    },
  ];

  return (
    <section className="space-y-6">
      <header className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">
          {allDone ? "All done 🎉" : "Publishing your notes…"}
        </h2>
        <p className="text-muted-foreground">
          We’ll update each checkpoint as your file moves through the pipeline.
        </p>
      </header>

      <div className="rounded-lg border p-4 bg-card/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium truncate">{file.name}</h4>
          {hasError && (
            <span className="text-xs text-red-600 ml-3">Error: {state.error}</span>
          )}
        </div>

        <div className="h-28 w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
            nodesDraggable={false}
            elementsSelectable={false}
            zoomOnScroll={false}
            panOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
          />
        </div>
      </div>

      <footer className="pt-2 text-center">
        {allDone ? (
          <button
            onClick={onGoToNotes}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            View in Repository
          </button>
        ) : (
          <p className="text-xs text-muted-foreground">
            You can navigate away—processing continues in the background.
          </p>
        )}
      </footer>
    </section>
  );
}
