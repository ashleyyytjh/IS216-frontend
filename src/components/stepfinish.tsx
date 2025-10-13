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
export default function StepFinish({ state, allDone, onGoToNotes }: StepFinishProps) {
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
          You will be redirected shortly.
        </h2>
        <p className="text-muted-foreground">
          Please do not close this page.
        </p>
      </header>
    </section>
  );
}
