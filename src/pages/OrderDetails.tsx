import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ArrowLeft, Book, CheckCircle2, Clock, Download, FileText, MapPin,
  Package, PackageCheck, Truck, Check, CircleDot, FileDown, HelpCircle,
} from "lucide-react";

/* ----------------------------- Types & Mock ----------------------------- */
type Status = "Placed" | "Processing" | "Printed" | "Shipped" | "Delivered" | "Ready for download";
type ItemType = "Soft copy" | "Hard copy";
type OrderItem = { type: ItemType; title: string; sku: string; qty: number; price: number; downloadUrl?: string; };
type OrderDetails = {
  id: string; placedAt: string; status: Status; eta?: string;
  address?: string; shippingCarrier?: string; trackingNo?: string;
  subtotal: number; shippingFee: number; tax: number; total: number;
  items: OrderItem[]; history: Array<{ at: string; text: string }>;
};

const MOCK: Record<string, OrderDetails> = {
  "N-2025-001": {
    id: "N-2025-001",
    placedAt: "2025-01-03T10:15:00Z",
    status: "Printed",
    eta: "2025-01-06",
    address: "90 Stamford Rd, #12-01, Singapore 178903",
    shippingCarrier: "Qxpress",
    trackingNo: "QX-88112233",
    subtotal: 18.0, shippingFee: 3.0, tax: 0.0, total: 21.0,
    items: [
      { type: "Soft copy", title: "Econs Lecture Notes (PDF)", sku: "PDF-ECON-101", qty: 1, price: 5.0 },
      { type: "Hard copy", title: "Statistics Revision Guide (Printed)", sku: "PRINT-STAT-201", qty: 1, price: 13.0 },
    ],
    history: [
      { at: "2025-01-03 10:15", text: "Order placed" },
      { at: "2025-01-03 10:20", text: "Payment confirmed" },
      { at: "2025-01-04 09:00", text: "Notes sent to printer" },
    ],
  },
  "N-2025-002": {
    id: "N-2025-002",
    placedAt: "2025-01-02T14:40:00Z",
    status: "Ready for download",
    subtotal: 8.0, shippingFee: 0, tax: 0, total: 8.0,
    items: [
      { type: "Soft copy", title: "Accounting Practice Questions (PDF)", sku: "PDF-ACC-333", qty: 1, price: 8.0, downloadUrl: "/downloads/acc-333.pdf" },
    ],
    history: [
      { at: "2025-01-02 14:40", text: "Order placed" },
      { at: "2025-01-02 14:41", text: "Payment confirmed" },
      { at: "2025-01-02 14:42", text: "Digital notes ready for download" },
    ],
  },
};

/* ----------------------------- Helpers ----------------------------- */
const STATUS_STEPS: Status[] = ["Placed", "Processing", "Printed", "Shipped", "Delivered", "Ready for download"];
const money = (n: number) => n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

function StatusPill({ s }: { s: Status }) {
  const map: Record<Status, string> = {
    Placed: "bg-slate-100 text-slate-700",
    Processing: "bg-amber-100 text-amber-700",
    Printed: "bg-indigo-100 text-indigo-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    "Ready for download": "bg-cyan-100 text-cyan-700",
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
              className={`grid size-6 place-items-center rounded-full border
              ${done ? "bg-emerald-600 text-white border-emerald-600" :
                active ? "border-emerald-600 text-emerald-700" :
                "border-muted-foreground/30 text-muted-foreground"}`}
              title={s}
            >
              {done ? <Check className="size-4" /> : active ? <CircleDot className="size-4" /> : i + 1}
            </div>
            {i !== STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-10 rounded 
                ${i < idx ? "bg-emerald-600" : "bg-muted-foreground/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Page -------------------------------- */
export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = (orderId && MOCK[orderId]) || MOCK["N-2025-001"];
  const softReady = order.status === "Ready for download" || order.status === "Delivered";

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl p-4 lg:p-8">
        {/* Hero header */}
        <div className="mb-6 rounded-2xl border bg-gradient-to-br from-background to-muted/40 p-4 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold md:text-2xl">Order #{order.id}</h1>
              <StatusPill s={order.status} />
            </div>
            <div className="text-xs text-muted-foreground md:text-sm">
              Placed on {new Date(order.placedAt).toLocaleString()}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Stepper current={order.status} />
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

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: tabs */}
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
                  <div className="overflow-auto rounded-lg border">
                    <Table>
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
                        {order.items.map((it, idx) => {
                          const icon = it.type === "Hard copy"
                            ? <Book className="mr-2 size-4" />
                            : <FileText className="mr-2 size-4" />;
                          const canDL = it.type === "Soft copy" && softReady && it.downloadUrl;
                          return (
                            <TableRow key={idx} className="hover:bg-muted/40">
                              <TableCell className="flex items-center">{icon}{it.type}</TableCell>
                              <TableCell>
                                <div className="font-medium">{it.title}</div>
                                <div className="text-xs text-muted-foreground">{it.sku}</div>
                              </TableCell>
                              <TableCell>{it.qty}</TableCell>
                              <TableCell className="text-right">{money(it.price)}</TableCell>
                              <TableCell className="text-right">
                                {canDL ? (
                                  <Button asChild size="sm" className="gap-2">
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
                    {order.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 size-2 rounded-full bg-muted-foreground/80" />
                        <div className="text-sm">
                          <div className="font-medium">{h.text}</div>
                          <div className="text-xs text-muted-foreground">{h.at}</div>
                        </div>
                      </div>
                    ))}
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
                        <span className="font-medium">{money(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">{money(order.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">{money(order.tax)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-semibold">{money(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Right: sticky summary */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {/* Status / ETA */}
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
                    <StatusPill s={order.status} />
                  </div>
                  <div className="mt-3">
                    <Progress
                      value={Math.max(0, STATUS_STEPS.indexOf(order.status)) / (STATUS_STEPS.length - 1) * 100}
                      className="h-2"
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                      <span>{STATUS_STEPS[0]}</span>
                      <span>{STATUS_STEPS.at(-1)}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    {order.items.some(i => i.type === "Hard copy") ? (
                      order.eta ? <>ETA: <span className="font-medium">{order.eta}</span></> :
                      <span className="text-muted-foreground">ETA available after shipment.</span>
                    ) : (
                      softReady ? <span className="font-medium">Digital notes are ready to download.</span> :
                      <span className="text-muted-foreground">We’ll notify you when your digital notes are ready.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping (hard copy only) */}
            {order.items.some(i => i.type === "Hard copy") && (
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
                    <div className="text-muted-foreground">{order.address ?? "-"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Carrier</div>
                      <div className="font-medium">{order.shippingCarrier ?? "-"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tracking no.</div>
                      <div className="font-medium">{order.trackingNo ?? "-"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline">Contact seller</Button>
          <Button variant="outline">Report issue</Button>
          <Button>Download all (zip)</Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
