import * as React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, HelpCircle, FileText } from "lucide-react";

import { getOrders } from "@/services/OrdersService";
import { getNotesById } from "@/services/NotesService";

/* ---------------- Types ---------------- */

type ApiOrder = {
  id: string | number;
  note_id?: string | number;
  price?: number;           // in cents
  createdAt?: string;
};

type OrderItem = {
  title: string;
  module?: string;
  sku: string;
  qty: number;
  price: number;            // dollars
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

/* ---------------- Mapping ---------------- */

function toVM(api: ApiOrder, note?: any): OrderVM {
  const id = String(api.id);
  const title =
    note?.originalName ?? note?.title ?? `Note ${api.note_id ?? ""}`;
  const module: string | undefined =
    note?.moduleCode || note?.module || note?.course || undefined;
  const price = fromCents(api.price);
  const placedAt = api.createdAt ?? note?.createdAt ?? undefined;

  const items: OrderItem[] = [
    {
      title,
      module: module ? module.charAt(0).toUpperCase() + module.slice(1) : undefined,
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

  // Fast path (navigated from orders table with state)
  React.useEffect(() => {
    if (!ord) return;
    (async () => {
      try {
        const note = ord.note_id
          ? await getNotesById(String(ord.note_id)).catch(() => null)
          : null;
        setVm(toVM(ord, note || undefined));
      } catch (e: any) {
        setError(e?.message ?? "Failed to prepare order");
      } finally {
        setLoading(false);
      }
    })();
  }, [location.state?.order]);

  // Fallback (deep link / refresh)
  React.useEffect(() => {
    if (vm || !id) return;
    (async () => {
      try {
        setLoading(true);
        const all: ApiOrder[] = await getOrders();
        const found = all.find((o) => String(o.id) === String(id));
        if (!found) throw new Error("Order not found");
        const note = found.note_id
          ? await getNotesById(String(found.note_id)).catch(() => null)
          : null;
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
      <div className="flex justify-center p-10">
        <div className="animate-pulse rounded-xl border px-4 py-3 text-sm text-muted-foreground bg-muted/30">
          Loading order…
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <p className="mt-3 text-red-600">Error: {error}</p>
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

  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <Card className="shadow-lg border bg-background">
          <CardHeader className="pb-4 border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 size-4" /> Back
                </Button>
                <h1 className="text-2xl font-medium tracking-tight">
                  Order #{vm.id}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="mr-2 size-4" /> Get help
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Chat with support about this order.
                  </TooltipContent>
                </Tooltip>
                {/* Dynamic link to Return/Refund page with state */}
                <Button asChild variant="outline" size="sm">
                  <Link to={`/refund/${vm.id}`} state={{ order: vm }}>
                    Request refund
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {vm.placedAt ? (
                <>Placed on {new Date(vm.placedAt).toLocaleString()}</>
              ) : (
                "—"
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-background border rounded-xl p-4">
              <div>
                <div className="text-muted-foreground">Transaction ID</div>
                <div>{vm.id}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Items</div>
                <div>{vm.items.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total</div>
                <div>{money(vm.total)}</div>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="grid gap-6 md:gap-8">
              {vm.items.map((it, idx) => {
                const to = `/listings/${encodeURIComponent(it.sku)}`;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border bg-background p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="size-4" />
                          <span>{it.module ?? "—"}</span>
                        </div>
                        <div className="text-lg leading-snug">{it.title}</div>
                        <div className="text-xs text-muted-foreground break-words">
                          SKU: {it.sku}
                        </div>
                      </div>
                      <div className="text-right md:min-w-[160px]">
                        <div>{money(it.price)}</div>
                        <div className="text-xs text-muted-foreground">
                          Qty {it.qty}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        <span>View details:</span>
                        <Link
                          to={to}
                          className="ml-1 underline underline-offset-2"
                        >
                          open note
                        </Link>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full md:w-auto"
                      >
                        <Link to={to} aria-label={`Open ${it.title}`}>
                          <span>Open note</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
