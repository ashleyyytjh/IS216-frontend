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
      {/* container: comfy on mobile, centered on desktop */}
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10 container w-[95%] sm:w-[85%] lg:w-[80%]">
        <Card className="shadow-lg border bg-background">
          {/* Header */}
          <CardHeader className="pb-3 sm:pb-4 border-b">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="w-fit"
                  >
                    <ArrowLeft className="mr-2 size-4" /> Back
                  </Button>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    Order #{vm.id}
                  </h1>
                </div>

                {/* Actions reflow to full-width on mobile */}
                <div className="flex flex-col xs:flex-row sm:flex-row gap-2 w-full sm:w-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <HelpCircle className="mr-2 size-4" />
                        Get help
                      </Button> */}
                    </TooltipTrigger>
                    <TooltipContent>Chat with support about this order.</TooltipContent>
                  </Tooltip>

                  {/* <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link to={`/refund/${vm.id}`} state={{ order: vm }}>
                      Request refund
                    </Link>
                  </Button> */}
                </div>
              </div>

              {/* Placed on */}
              <div className="text-sm text-muted-foreground">
                {vm.placedAt ? (
                  <>Placed on {new Date(vm.placedAt).toLocaleString()}</>
                ) : (
                  "—"
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Summary tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
              <div className="rounded-lg border bg-background p-4">
                <div className="text-muted-foreground">Transaction ID</div>
                <div className="mt-0.5 font-medium break-all">{vm.id}</div>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="text-muted-foreground">Items</div>
                <div className="mt-0.5 font-medium">{vm.items.length}</div>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="text-muted-foreground">Total</div>
                <div className="mt-0.5 font-semibold">{money(vm.total)}</div>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="grid gap-4 sm:gap-6">
              {vm.items.map((it, idx) => {
                const to = `/listings/${encodeURIComponent(it.sku)}`;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border bg-background p-4 sm:p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                      <div className="space-y-1 md:space-y-1.5">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <FileText className="size-4" />
                          <span className="truncate max-w-[80vw] sm:max-w-none">
                            {it.module ?? "—"}
                          </span>
                        </div>
                        <div className="text-base sm:text-lg leading-snug break-words">
                          {it.title}
                        </div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground break-words">
                          ID: {it.sku}
                        </div>
                      </div>

                      <div className="text-right md:min-w-[160px]">
                        <div className="text-base sm:text-lg font-medium">{money(it.price)}</div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground">Qty {it.qty}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        <span>View details:</span>
                        <Link
                          to={to}
                          className="ml-1 underline underline-offset-2"
                        >
                          Open Note
                        </Link>
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full sm:w-auto"
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
