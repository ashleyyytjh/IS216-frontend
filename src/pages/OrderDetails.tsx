import * as React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowLeft, Book, Check, CircleDot, Clock, Download, FileDown, FileText,
  HelpCircle, MapPin, Truck,
} from "lucide-react";

import { getOrders } from "@/services/OrdersService";
import { getNotesById } from "@/services/NotesService";

/* ---------------- Types & helpers ---------------- */

type Status =
  | "Placed"
  | "Processing"
  | "Printed"
  | "Shipped"
  | "Delivered"
  | "Ready for download";

type ApiOrder = {
  id: string | number;
  note_id?: string | number;
  price?: number;
  status?: string;
  createdAt?: string;
};

type OrderItem = {
  type: "Soft copy" | "Hard copy";
  title: string;
  sku: string;           // used as note id in the URL
  qty: number;
  price: number;
  downloadUrl?: string;
};

type OrderVM = {
  id: string;
  placedAt?: string;
  status: Status;
  eta?: string;
  address?: string;
  shippingCarrier?: string;
  trackingNo?: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  items: OrderItem[];
  history: Array<{ at: string; text: string }>;
};

const STATUS_STEPS: Status[] = [
  "Placed", "Processing", "Printed", "Shipped", "Delivered", "Ready for download",
];

const money = (n: number) =>
  (n ?? 0).toLocaleString("en-SG", { style: "currency", currency: "SGD" });

// prices are already dollars
const normalizePrice = (p?: number) => p ?? 0;

function StatusPill({ s }: { s: Status }) {
  const map: Record<Status, string> = {
    Placed: "bg-slate-200 text-slate-900",
    Processing: "bg-amber-200 text-amber-900",
    Printed: "bg-violet-200 text-violet-900",
    Shipped: "bg-blue-200 text-blue-900",
    Delivered: "bg-emerald-200 text-emerald-900",
    "Ready for download": "bg-cyan-200 text-cyan-900",
  };
  return <Badge className={`px-2.5 py-1 ${map[s]}`}>{s}</Badge>;
}

function Stepper({ current }: { current: Status }) {
  const idx = STATUS_STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-3">
      {STATUS_STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div className="flex items-center gap-3" key={s}>
            <div
              className={`grid size-7 place-items-center rounded-full border
                ${done ? "bg-emerald-600 text-white border-emerald-600"
                       : active ? "border-emerald-600 text-emerald-700"
                                : "border-muted-foreground/30 text-muted-foreground"}`}
            >
              {done ? <Check className="size-4" /> : active ? <CircleDot className="size-4" /> : i + 1}
            </div>
            {i !== STATUS_STEPS.length - 1 && (
              <div className={`h-1 w-12 rounded ${i < idx ? "bg-emerald-600" : "bg-muted-foreground/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function mapStatus(s?: string): Status {
  switch ((s ?? "").toLowerCase()) {
    case "created": case "placed": return "Placed";
    case "processing": return "Processing";
    case "printed": return "Printed";
    case "shipped": return "Shipped";
    case "delivered": return "Delivered";
    case "completed": case "ready": case "ready_for_download": return "Ready for download";
    default: return "Placed";
  }
}

function toVM(api: ApiOrder, note?: any): OrderVM {
  const id = String(api.id);
  const title = note?.originalName ?? note?.title ?? `Note ${api.note_id ?? ""}`;
  const price = normalizePrice(api.price);
  const placedAt = api.createdAt ?? note?.createdAt ?? undefined;

  const items: OrderItem[] = [
    {
      type: "Soft copy",
      title,
      sku: String(api.note_id ?? id), // navigate with this
      qty: 1,
      price,
    },
  ];

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shippingFee = items.some(i => i.type === "Hard copy") ? 3 : 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  return {
    id,
    placedAt,
    status: mapStatus(api.status),
    subtotal,
    shippingFee,
    tax,
    total,
    items,
    history: placedAt ? [{ at: new Date(placedAt).toLocaleString(), text: "Order placed" }] : [],
  };
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

  // Fast path: from table (state)
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

  // Fallback: refresh / deep link
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

  if (loading) return <div className="p-6">Loading order…</div>;
  if (error)   return (
    <div className="p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>
      <p className="mt-3 text-red-600">Error: {error}</p>
    </div>
  );
  if (!vm) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <p className="mt-3">Order not found.</p>
      </div>
    );
  }

  const hasHardCopy = vm.items.some(i => i.type === "Hard copy");
  const softReady = vm.status === "Ready for download" || vm.status === "Delivered";

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl border bg-gradient-to-br from-background to-muted/40 p-4 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold md:text-2xl">Order #{vm.id}</h1>
              <StatusPill s={vm.status} />
            </div>
            <div className="text-xs text-muted-foreground md:text-sm">
              {vm.placedAt ? <>Placed on {new Date(vm.placedAt).toLocaleString()}</> : "—"}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Stepper current={vm.status} />
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="mr-2 size-4" />
                    Get help
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Chat with support about this order.</TooltipContent>
              </Tooltip>
              <Button variant="outline" size="sm">Request refund</Button>
            </div>
          </div>
        </div>

        {/* 12-col grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left column (8/12) */}
          <div className="lg:col-span-8 min-w-0">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Order details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="items" className="w-full">
                  <TabsList className="mb-3">
                    <TabsTrigger value="items">Items</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="receipt">Receipt</TabsTrigger>
                  </TabsList>

                  {/* ITEMS */}
                  <TabsContent value="items">
                    {/* Scrollable container */}
                    <div className="overflow-auto rounded-lg border">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="w-36 text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vm.items.map((it, idx) => {
                            const icon = it.type === "Hard copy" ? <Book className="mr-2 size-4" /> : <FileText className="mr-2 size-4" />;
                            const canDL = it.type === "Soft copy" && softReady && !!it.downloadUrl;
                            const to = `/listings/${encodeURIComponent(it.sku)}`;
                            return (
                              <TableRow
                                key={idx}
                                className="group hover:bg-muted/40 cursor-pointer"
                                onClick={() => navigate(to)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    navigate(to);
                                  }
                                }}
                              >
                                <TableCell className="whitespace-nowrap flex items-center">
                                  {icon}{it.type}
                                </TableCell>
                                <TableCell className="min-w-[16rem]">
                                  {/* Title: lights up on hover (no underline) */}
                                  <Link
                                    to={to}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-medium text-foreground transition-all duration-200 group-hover:text-primary group-hover:bg-primary/10 group-hover:shadow-[0_0_14px_theme(colors.primary/30)] rounded px-1"
                                  >
                                    {it.title}
                                  </Link>
                                  <div className="text-xs text-muted-foreground break-words">
                                    {it.sku}
                                  </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{it.qty}</TableCell>
                                <TableCell className="text-right whitespace-nowrap">{money(it.price)}</TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                  {canDL ? (
                                    <Button
                                      asChild
                                      size="sm"
                                      className="gap-2"
                                      onClick={(e) => e.stopPropagation()} // prevent row navigation
                                    >
                                      <a href={it.downloadUrl} download>
                                        <Download className="size-4" />
                                        Download
                                      </a>
                                    </Button>
                                  ) : it.type === "Soft copy" ? (
                                    <span className="text-xs text-muted-foreground">Not ready yet</span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Ships to address</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* TIMELINE */}
                  <TabsContent value="timeline">
                    <div className="space-y-3 rounded-lg border p-4">
                      {vm.history.length ? vm.history.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1 size-2 rounded-full bg-muted-foreground/80" />
                          <div className="text-sm min-w-0">
                            <div className="font-medium">{h.text}</div>
                            <div className="text-xs text-muted-foreground">{h.at}</div>
                          </div>
                        </div>
                      )) : <div className="text-sm text-muted-foreground">No timeline yet.</div>}
                    </div>
                  </TabsContent>

                  {/* RECEIPT */}
                  <TabsContent value="receipt">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileDown className="size-4" />
                        Payment summary
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{money(vm.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-medium">{money(vm.shippingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium">{money(vm.tax)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-semibold">{money(vm.total)}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right column (4/12) */}
          <div className="lg:col-span-4 min-w-0 space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {/* Status & ETA */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="size-5" />
                  Status & ETA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="mb-1 text-xs text-muted-foreground">Current status</div>
                  <div className="flex items-center gap-2">
                    <StatusPill s={vm.status} />
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={Math.max(0, STATUS_STEPS.indexOf(vm.status)) / (STATUS_STEPS.length - 1) * 100}
                      className="h-2"
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                      <span>{STATUS_STEPS[0]}</span>
                      <span>{STATUS_STEPS.at(-1)}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    {hasHardCopy ? (
                      vm.eta ? <>ETA: <span className="font-medium">{vm.eta}</span></> :
                        <span className="text-muted-foreground">ETA available after shipment.</span>
                    ) : (
                      (vm.status === "Ready for download" || vm.status === "Delivered")
                        ? <span className="font-medium">Digital notes are ready to download.</span>
                        : <span className="text-muted-foreground">We’ll notify you when your digital notes are ready.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping (hard copy only) */}
            {hasHardCopy && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="size-5" />
                    Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-3 text-sm">
                    <div className="mb-2 flex items-center gap-2 font-medium">
                      <MapPin className="size-4" />
                      Delivery address
                    </div>
                    <div className="text-muted-foreground">{vm.address ?? "-"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Carrier</div>
                      <div className="font-medium">{vm.shippingCarrier ?? "-"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tracking no.</div>
                      <div className="font-medium">{vm.trackingNo ?? "-"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline">Contact seller</Button>
          <Button variant="outline">Report issue</Button>
          <Button>Download all (zip)</Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
