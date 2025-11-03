import * as React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Tag } from "lucide-react";
import { motion } from "framer-motion";

import { getOrders } from "@/services/OrdersService";
import { getNotesById, getSingleCompose } from "@/services/NotesService";

/* ---------------- Types ---------------- */
type ApiOrder = {
  id: string | number;
  note_id?: string | number;
  price?: number;              // cents
  createdAt?: string;
  noteType?: "normal" | "composed";
  status?: string;
};

type OrderItem = {
  title: string;
  module?: string;
  sku: string;
  qty: number;
  price: number;               // dollars
};

type OrderVM = {
  id: string;
  placedAt?: string;
  total: number;
  items: OrderItem[];
};

type NoteMeta = {
  id: string;
  noteType: "upload" | "compose";
  title: string;
  description?: string | null;
  module?: string | null;
  type?: string | null;
  tags?: string[] | null;
  price?: number | null;       // dollars (list price)
  createdAt?: string | null;
  authorName?: string | null;
  authorImage?: string | null;
};

/* ---------------- Utils ---------------- */
const money = (n: number) =>
  (n ?? 0).toLocaleString("en-SG", { style: "currency", currency: "SGD" });
const fromCents = (c?: number) => (c ?? 0) / 100;

function toVM(api: ApiOrder, note?: any): OrderVM {
  const id = String(api.id);
  const title = note?.originalName ?? note?.title ?? `Note ${api.note_id ?? ""}`;
  const module: string | undefined =
    note?.moduleCode || note?.module || note?.course || note?.module || undefined;
  const price = fromCents(api.price);
  const placedAt = api.createdAt ?? note?.createdAt ?? undefined;

  const items: OrderItem[] = [
    { title, module: module ? module.toUpperCase() : undefined, sku: String(api.note_id ?? id), qty: 1, price },
  ];
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  return { id, placedAt, total, items };
}

const formatStatus = (s?: string | null) =>
  (s ?? "unknown").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

function statusClasses(status?: string | null) {
  const s = (status ?? "").toLowerCase();
  if (s === "succeeded" || s === "success") return "bg-green-50 text-green-700 border border-green-200";
  if (s === "processing" || s === "pending") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  if (s === "failed" || s === "canceled" || s === "cancelled") return "bg-red-50 text-red-700 border border-red-200";
  if (s === "created") return "bg-neutral-100 text-neutral-700 border border-neutral-200";
  return "bg-neutral-100 text-neutral-700 border border-neutral-200";
}

/* ---------------- Robust note resolver (404-safe) ---------------- */
async function resolveNoteMeta(
  noteId: string,
  prefer: "normal" | "composed" | undefined
): Promise<{ noteType: "upload" | "compose"; data: any } | null> {
  const tryGetUpload = async () => {
    try {
      const n = await getNotesById(noteId);      // /notes/:id
      if (!n) return null;
      return { noteType: "upload" as const, data: n };
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
  };
  const tryGetCompose = async () => {
    try {
      const n = await getSingleCompose(noteId);  // /notes/compose/:id
      if (!n) return null;
      return { noteType: "compose" as const, data: n };
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
  };

  if (prefer === "normal") return (await tryGetUpload()) ?? (await tryGetCompose());
  if (prefer === "composed") return (await tryGetCompose()) ?? (await tryGetUpload());
  return (await tryGetUpload()) ?? (await tryGetCompose());
}

function mapNoteMeta(kind: "upload" | "compose", n: any): NoteMeta {
  if (kind === "upload") {
    return {
      id: String(n.id),
      noteType: "upload",
      title: n.title ?? n.originalName ?? `Note ${n.id}`,
      description: n.description ?? null,
      module: n.module ?? null,
      type: n.type ?? null,
      tags: n.tags ?? null,
      price: typeof n.price === "number" ? n.price : null,
      createdAt: n.createdAt ?? null,
      authorName: n.userFullName ?? null,
      authorImage:
        n.userImageUrl ||
        (n.userFullName
          ? `https://ui-avatars.com/api/?background=DDD&color=111&name=${encodeURIComponent(n.userFullName)}`
          : null),
    };
  }
  return {
    id: String(n.id),
    noteType: "compose",
    title: n.title ?? `Note ${n.id}`,
    description: n.description ?? null,
    module: n.module ?? null,
    type: n.type ?? null,
    tags: n.tags ?? null,
    price: typeof n.price === "number" ? n.price : null,
    createdAt: n.createdAt ?? null,
    authorName: n.userFullName ?? null,
    authorImage:
      n.userImageUrl ||
      (n.userFullName
        ? `https://ui-avatars.com/api/?background=DDD&color=111&name=${encodeURIComponent(n.userFullName)}`
        : null),
  };
}

/* ---------------- Page ---------------- */
export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { order?: ApiOrder } };
  const ord = location.state?.order;

  const [vm, setVm] = React.useState<OrderVM | null>(null);
  const [loading, setLoading] = React.useState<boolean>(!ord);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(ord?.status ?? null);
  const [note, setNote] = React.useState<NoteMeta | null>(null);

  React.useEffect(() => {
    if (!ord) return;
    (async () => {
      try {
        setStatus(ord.status ?? null);

        let noteMeta: NoteMeta | null = null;
        if (ord.note_id) {
          const resolved = await resolveNoteMeta(String(ord.note_id), ord.noteType);
          if (resolved) noteMeta = mapNoteMeta(resolved.noteType, resolved.data);
        }
        if (noteMeta) setNote(noteMeta);

        const title = noteMeta?.title ?? `Note ${ord.note_id ?? ""}`;
        setVm(toVM(ord, { title, module: noteMeta?.module, createdAt: noteMeta?.createdAt }));
      } catch (e: any) {
        setError(e?.message ?? "Failed to prepare order");
      } finally {
        setLoading(false);
      }
    })();
  }, [ord]);

  React.useEffect(() => {
    if (vm || !id) return;
    (async () => {
      try {
        setLoading(true);
        const all: ApiOrder[] = await getOrders();
                //                               all.push({
                //     "id": 900,
                //     "status": 'succeeded',
                //     "note_id": "68fdc48ada0006fb103e9153",
                //     "price": 1150
                // })
        const found = all.find((o) => String(o.id) === String(id));
        if (!found) throw new Error("Order not found");

        setStatus(found.status ?? null);

        let noteMeta: NoteMeta | null = null;
        if (found.note_id) {
          const resolved = await resolveNoteMeta(String(found.note_id), found.noteType);
          if (resolved) noteMeta = mapNoteMeta(resolved.noteType, resolved.data);
        }
        if (noteMeta) setNote(noteMeta);

        const title = noteMeta?.title ?? `Note ${found.note_id ?? ""}`;
        setVm(toVM(found, { title, module: noteMeta?.module, createdAt: noteMeta?.createdAt }));
      } catch (e: any) {
        setError(e?.message ?? "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, vm]);

  if (loading) return <div className="flex justify-center p-10 text-neutral-600">Loading order…</div>;

  if (error) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <p className="mt-3 text-red-600">{error}</p>
      </div>
    );
  }

  if (!vm) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <p className="mt-3">Order not found.</p>
      </div>
    );
  }

  const item = vm.items[0]; // single-item orders
  const to =
    (ord?.noteType ?? "").toLowerCase() === "composed"
      ? `/article/${encodeURIComponent(item.sku)}`
      : `/listings/${encodeURIComponent(item.sku)}`;

  const fadeUp = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  };

  // const showListPrice =
  //   typeof note?.price === "number" && Math.abs((note?.price ?? 0) - (item?.price ?? 0)) > 1e-9;

  return (
    <div className="bg-white min-h-[80vh] ml-auto mr-auto flex flex-col items-center justify-start sm:w-[90%] md:w-[85%] lg:w-[80%]">
      <motion.div
        className="w-full max-w-6xl px-6 pt-12 pb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="rounded-3xl border border-neutral-200 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-6 md:p-10 mb-8">
     
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="rounded-full text-neutral-700 hover:bg-neutral-100"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                Order #{vm.id}
              </h1>
            </div>
            <div className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm ${statusClasses(status)}`}>
              {formatStatus(status)}
            </div>
          </div>

      
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6" variants={fadeUp} initial="hidden" animate="show">
            {[
              { label: "TRANSACTION ID", value: vm.id },
              { label: "ITEMS", value: vm.items.length },
              { label: "TOTAL", value: money(vm.total) },
            ].map((t, i) => (
              <div key={t.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">{t.label}</div>
                <div className={`mt-1 ${i === 2 ? "font-semibold" : "font-medium"} text-lg`}>{t.value}</div>
              </div>
            ))}
          </motion.div>

         
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
    
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">

                  <div className="min-w-0">
                    <div className="text-lg font-medium text-neutral-900 truncate">
                      {note?.title ?? item.title}
                    </div>

              
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-neutral-600">
                      {(note?.module || item.module) && (
                        <span className="rounded-full border border-neutral-300 bg-white px-2 py-0.5">
                          {(note?.module ?? item.module)?.toUpperCase()}
                        </span>
                      )}
                      {note?.type && (
                        <span className="rounded-full border border-neutral-300 bg-white px-2 py-0.5">
                          {note.type}
                        </span>
                      )}
                    </div>

                    {note?.description && (
                      <p className="text-sm text-neutral-700 mt-3">
                        {note.description}
                      </p>
                    )}

                    {note?.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Tag className="h-3 w-3" /> Tags:
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {note.tags.map((t, i) => (
                            <span key={`${t}-${i}`} className="text-xs rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

          
                    <div className="text-xs text-neutral-500 mt-3">
                      Note ID: {item.sku}
                    </div>
                  </div>
                </div>
              </div>

             
     
<div className="min-w-[220px] flex flex-col items-end text-right">
  <div>
    <div className="text-lg font-semibold text-neutral-900">
      {money(item.price)}
    </div>

    {(note?.createdAt || vm.placedAt) && (
      <div className="text-xs text-neutral-500 mt-1">
        {new Date(note?.createdAt ?? vm.placedAt!).toLocaleDateString()}
      </div>
    )}
    <div className="text-xs text-neutral-500 mt-1">Qty {item.qty}</div>
  </div>

  <div className="mt-auto pt-6">
    <Button
      asChild
      size="sm"
      className="rounded-lg bg-black text-white hover:bg-neutral-800 px-6 py-2 text-sm font-medium shadow-sm"
    >
      <Link to={to}>Open Note</Link>
    </Button>
  </div>
</div>

            </div>
          </motion.div>
 

        </Card>
      </motion.div>
    </div>
  );
}
