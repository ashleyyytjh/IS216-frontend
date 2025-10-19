import * as React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

import { getOrders } from "@/services/OrdersService";
import { getNotesById } from "@/services/NotesService";

/* ---------------- Types ---------------- */
type ApiOrder = {
  id: string | number;
  note_id?: string | number;
  price?: number;
  createdAt?: string;
};

type OrderItem = {
  title: string;
  module?: string;
  sku: string;
  qty: number;
  price: number;
};

type OrderVM = {
  id: string;
  placedAt?: string;
  total: number;
  items: OrderItem[];
};

/* ---------------- Utils ---------------- */
const money = (n: number) =>
  (n ?? 0).toLocaleString("en-SG", { style: "currency", currency: "SGD" });
const fromCents = (c?: number) => (c ?? 0) / 100;

function toVM(api: ApiOrder, note?: any): OrderVM {
  const id = String(api.id);
  const title = note?.originalName ?? note?.title ?? `Note ${api.note_id ?? ""}`;
  const module: string | undefined = note?.moduleCode || note?.module || note?.course || undefined;
  const price = fromCents(api.price);
  const placedAt = api.createdAt ?? note?.createdAt ?? undefined;

  const items: OrderItem[] = [
    {
      title,
      module: module ? module.toUpperCase() : undefined,
      sku: String(api.note_id ?? id),
      qty: 1,
      price,
    },
  ];

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  return { id, placedAt, total, items };
}

/* ---------------- Page ---------------- */
export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { order?: ApiOrder } };

  const [vm, setVm] = React.useState<OrderVM | null>(null);
  const [loading, setLoading] = React.useState<boolean>(!location.state?.order);
  const [error, setError] = React.useState<string | null>(null);
  const ord = location.state?.order;

  React.useEffect(() => {
    if (!ord) return;
    (async () => {
      try {
        const note = ord.note_id ? await getNotesById(String(ord.note_id)).catch(() => null) : null;
        setVm(toVM(ord, note || undefined));
      } catch (e: any) {
        setError(e?.message ?? "Failed to prepare order");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.state?.order]);

  React.useEffect(() => {
    if (vm || !id) return;
    (async () => {
      try {
        setLoading(true);
        const all: ApiOrder[] = await getOrders();
        const found = all.find((o) => String(o.id) === String(id));
        if (!found) throw new Error("Order not found");
        const note = found.note_id ? await getNotesById(String(found.note_id)).catch(() => null) : null;
        setVm(toVM(found, note || undefined));
      } catch (e: any) {
        setError(e?.message ?? "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, vm]);

  if (loading)
    return (
      <div className="flex justify-center p-10 text-neutral-600">Loading order…</div>
    );

  if (error)
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <p className="mt-3 text-red-600">{error}</p>
      </div>
    );

  if (!vm)
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <p className="mt-3">Order not found.</p>
      </div>
    );

  /* ---------------- Motion ---------------- */
  const fadeUp = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.22 } } };

  return (
    <div className="bg-white min-h-[80vh] flex flex-col items-center justify-start">
      <motion.div
        className="w-full max-w-6xl px-6 pt-12 pb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="rounded-3xl border border-neutral-200 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-6 md:p-10 mb-8">
          {/* Header */}
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

            <div className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm shadow-sm">
              Total: <span className="font-semibold">{money(vm.total)}</span>
            </div>
          </div>

          <div className="text-sm text-neutral-500 mb-8">
            Placed on{" "}
            <span className="font-medium text-neutral-800">
              {vm.placedAt}
            </span>
          </div>

          {/* Summary */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            {[
              { label: "TRANSACTION ID", value: vm.id },
              { label: "ITEMS", value: vm.items.length },
              { label: "TOTAL", value: money(vm.total) },
            ].map((t, i) => (
              <div
                key={t.label}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                  {t.label}
                </div>
                <div
                  className={`mt-1 ${
                    i === 2 ? "font-semibold" : "font-medium"
                  } text-lg`}
                >
                  {t.value}
                </div>
              </div>
            ))}
          </motion.div>

          <Separator className="bg-neutral-200 mb-6" />

          {/* Items */}
          {vm.items.map((it, idx) => {
            const to = `/listings/${encodeURIComponent(it.sku)}`;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-all mb-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <FileText className="size-4" />
                      {it.module && (
                        <span className="rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-[11px]">
                          {it.module}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-medium text-neutral-900">
                      {it.title}
                    </div>
                    <div className="text-xs text-neutral-500">ID: {it.sku}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-neutral-900">
                      {money(it.price)}
                    </div>
                    <div className="text-xs text-neutral-500">Qty {it.qty}</div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-lg bg-black text-white hover:bg-neutral-800 px-6 py-2 text-sm font-medium shadow-sm"
                  >
                    <Link to={to}>Open note</Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </Card>
      </motion.div>
    </div>
  );
}
