import * as React from "react";
import {
  Badge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import {
  AlignLeft,
  Archive,
  Download,
  Filter,
  Mail,
  Menu,
  MessageSquareWarning,
  MoreHorizontal,
  Package,
  Paperclip,
  Pencil,
  RotateCw,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  CheckCircle2,
  XCircle,
  UploadCloud,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type DisputeStatus =
  | "open"
  | "awaiting_seller"
  | "awaiting_buyer"
  | "under_review"
  | "resolved"
  | "rejected";

type DisputeType = "Item not received" | "Damaged/Defective" | "Wrong item" | "Payment issue";

type Dispute = {
  id: string;
  orderId: string;
  buyer: { name: string; email: string };
  type: DisputeType;
  claimedAmount: number;
  status: DisputeStatus;
  updatedAt: string; // ISO
  timeline: Array<{ at: string; label: string }>;
  thread: Array<{ from: "buyer" | "seller" | "admin"; at: string; text: string }>;
  evidence: string[]; // filenames (stub)
};

const STATUS_META: Record<
  DisputeStatus,
  { label: string; color: string; dot: string }
> = {
  open: { label: "Open", color: "bg-amber-100 text-amber-700", dot: "bg-amber-600" },
  awaiting_seller: { label: "Awaiting seller", color: "bg-blue-100 text-blue-700", dot: "bg-blue-600" },
  awaiting_buyer: { label: "Awaiting buyer", color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-600" },
  under_review: { label: "Under review", color: "bg-cyan-100 text-cyan-700", dot: "bg-cyan-600" },
  resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-600" },
  rejected: { label: "Rejected", color: "bg-rose-100 text-rose-700", dot: "bg-rose-600" },
};

const MOCK: Dispute[] = [
  {
    id: "DSP-1021",
    orderId: "C-4099",
    buyer: { name: "Nico", email: "nico@example.com" },
    type: "Damaged/Defective",
    claimedAmount: 21.0,
    status: "awaiting_seller",
    updatedAt: "2025-01-05T09:10:00Z",
    timeline: [
      { at: "2025-01-04T12:39:00Z", label: "Dispute opened by buyer" },
      { at: "2025-01-04T12:50:00Z", label: "Evidence uploaded by buyer" },
      { at: "2025-01-05T09:10:00Z", label: "Platform requested seller response" },
    ],
    thread: [
      { from: "buyer", at: "2025-01-04T12:40:00Z", text: "Item arrived with cracked lid. See photos." },
      { from: "admin", at: "2025-01-05T09:10:00Z", text: "Seller, please respond within 48 hours." },
    ],
    evidence: ["photo_lid.jpg", "box_damage.png"],
  },
  {
    id: "DSP-1013",
    orderId: "C-4082",
    buyer: { name: "Kellen", email: "kellen@example.com" },
    type: "Item not received",
    claimedAmount: 8.0,
    status: "under_review",
    updatedAt: "2024-12-29T10:00:00Z",
    timeline: [
      { at: "2024-12-27T18:30:00Z", label: "Buyer reported missing parcel" },
      { at: "2024-12-28T09:15:00Z", label: "Seller uploaded shipping proof" },
      { at: "2024-12-29T10:00:00Z", label: "Admin reviewing evidence" },
    ],
    thread: [
      { from: "buyer", at: "2024-12-27T18:31:00Z", text: "Tracking shows pending for 3 days." },
      { from: "seller", at: "2024-12-28T09:16:00Z", text: "Added tracking slip; courier says delayed." },
    ],
    evidence: ["waybill_2244.pdf"],
  },
  {
    id: "DSP-1007",
    orderId: "C-4074",
    buyer: { name: "Bianca", email: "bianca@example.com" },
    type: "Wrong item",
    claimedAmount: 15.0,
    status: "resolved",
    updatedAt: "2024-12-26T18:00:00Z",
    timeline: [
      { at: "2024-12-25T16:00:00Z", label: "Dispute opened by buyer" },
      { at: "2024-12-26T12:00:00Z", label: "Seller offered replacement" },
      { at: "2024-12-26T18:00:00Z", label: "Buyer accepted resolution" },
    ],
    thread: [
      { from: "seller", at: "2024-12-26T12:01:00Z", text: "We’ll ship the correct SKU today." },
      { from: "buyer", at: "2024-12-26T18:00:00Z", text: "Thanks, accepted." },
    ],
    evidence: [],
  },
];

const formatCurrency = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

/* ----------------------------- NAV COMPONENTS ----------------------------- */
const SideNav: React.FC = () => {
  const link =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition";
  return (
    <aside className="hidden w-64 border-r bg-card/50 lg:block">
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10">
            <ShoppingCart className="size-5" />
          </div>
          <div className="font-semibold">onlyNotes.store1</div>
        </div>
        <nav className="space-y-1">
          <a className={link} href="#"><AlignLeft className="size-4" />Dashboard</a>
          <a className={link} href="#"><Package className="size-4" />Orders</a>
          <a className={link} href="#"><Users className="size-4" />Customers</a>
          <a className={`${link} bg-accent`} href="#"><MessageSquareWarning className="size-4" />Disputes</a>
          <a className={link} href="#"><RotateCw className="size-4" />Returns & Refunds</a>
          <a className={link} href="#"><Archive className="size-4" />Products</a>
          <a className={link} href="#"><Mail className="size-4" />Messages</a>
          <Separator className="my-2" />
          <a className={link} href="#"><Settings className="size-4" />Settings</a>
        </nav>
      </div>
    </aside>
  );
};

const MobileNav: React.FC = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" variant="ghost" className="lg:hidden">
        <Menu className="size-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="p-0">
      <SheetHeader className="p-4">
        <SheetTitle className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10">
            <ShoppingCart className="size-5" />
          </div>
          Grano Café
        </SheetTitle>
      </SheetHeader>
      <ScrollArea className="h-[calc(100vh-4rem)] p-4">
        {[
          { icon: AlignLeft, label: "Dashboard" },
          { icon: Package, label: "Orders" },
          { icon: Users, label: "Customers" },
          { icon: MessageSquareWarning, label: "Disputes" },
          { icon: RotateCw, label: "Returns & Refunds" },
          { icon: Archive, label: "Products" },
          { icon: Mail, label: "Messages" },
          { icon: Settings, label: "Settings" },
        ].map((i) => (
          <a key={i.label} href="#" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent">
            <i.icon className="size-4" />
            {i.label}
          </a>
        ))}
      </ScrollArea>
    </SheetContent>
  </Sheet>
);

/* ------------------------------ MAIN PAGE -------------------------------- */
export default function OrderDispute() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"all" | DisputeStatus>("all");
  const [types, setTypes] = React.useState<Record<DisputeType, boolean>>({
    "Item not received": true,
    "Damaged/Defective": true,
    "Wrong item": true,
    "Payment issue": true,
  });
  const [selected, setSelected] = React.useState<Dispute | null>(MOCK[0] ?? null);

  const list = React.useMemo(() => {
    return MOCK.filter((d) => {
      const txt = `${d.id} ${d.orderId} ${d.buyer.name} ${d.buyer.email} ${d.type}`.toLowerCase();
      const byQ = txt.includes(q.trim().toLowerCase());
      const byStatus = status === "all" ? true : d.status === status;
      const byType = types[d.type];
      return byQ && byStatus && byType;
    });
  }, [q, status, types]);

  React.useEffect(() => {
    if (selected && !list.some((d) => d.id === selected.id)) {
      setSelected(list[0] ?? null);
    }
  }, [list, selected]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 p-3 lg:p-4">
              <MobileNav />
              <div className="ml-1 text-xl font-semibold tracking-tight">
                {list.length.toLocaleString()} disputes
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 size-4" /> Export
                </Button>
                <Avatar className="size-8">
                  <AvatarFallback>SE</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_420px] lg:p-6">
            {/* Left: list */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Disputes</CardTitle>
                <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
                  <div className="relative w-full lg:max-w-lg">
                    <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search dispute ID, order, buyer, type"
                    />
                  </div>

                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Filter className="mr-2 size-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64" align="start">
                        <DropdownMenuLabel>Date range</DropdownMenuLabel>
                        <div className="px-2 pb-2 text-xs text-muted-foreground">
                          (Stub) plug your DateRange picker here
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Dispute type</DropdownMenuLabel>
                        {(Object.keys(types) as DisputeType[]).map((t) => (
                          <DropdownMenuCheckboxItem
                            key={t}
                            checked={types[t]}
                            onCheckedChange={(v) =>
                              setTypes((prev) => ({ ...prev, [t]: Boolean(v) }))
                            }
                          >
                            {t}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                      <SelectTrigger className="w-[170px]">
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        {Object.entries(STATUS_META).map(([k, meta]) => (
                          <SelectItem key={k} value={k}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="ml-auto flex gap-2">
                    <Button size="sm"><Pencil className="mr-2 size-4" /> New note</Button>
                    <Button variant="outline" size="sm"><RotateCw className="mr-2 size-4" /> Refresh</Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dispute</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-10 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {list.map((d) => {
                        const meta = STATUS_META[d.status];
                        const active = selected?.id === d.id;
                        return (
                          <TableRow
                            key={d.id}
                            className={`cursor-pointer hover:bg-muted/40 ${active ? "bg-muted/50" : ""}`}
                            onClick={() => setSelected(d)}
                          >
                            <TableCell className="font-medium">#{d.id}</TableCell>
                            <TableCell className="text-muted-foreground">#{d.orderId}</TableCell>
                            <TableCell>
                              <div className="font-medium">{d.buyer.name}</div>
                              <div className="text-xs text-muted-foreground">{d.buyer.email}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{d.type}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(d.claimedAmount)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${meta.color}`}>
                                <span className={`size-2 rounded-full ${meta.dot}`} />
                                {meta.label}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(d.updatedAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="icon" variant="ghost"><MoreHorizontal className="size-4" /></Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {list.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No disputes match your filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <div>Showing {list.length} result(s)</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Prev</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: detail */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Dispute details</span>
                  {selected && (
                    <Badge variant="secondary">
                      {STATUS_META[selected.status].label}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selected ? (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    Select a dispute to view details.
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    <div className="rounded-lg border p-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Dispute ID</div>
                          <div className="font-medium">#{selected.id}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Order</div>
                          <div className="font-medium">#{selected.orderId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Buyer</div>
                          <div className="font-medium">{selected.buyer.name}</div>
                          <div className="text-xs text-muted-foreground">{selected.buyer.email}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Claimed amount</div>
                          <div className="font-medium">{formatCurrency(selected.claimedAmount)}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-muted-foreground">Type</div>
                          <div className="font-medium">{selected.type}</div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <div className="mb-2 text-sm font-medium">Timeline</div>
                      <div className="space-y-3">
                        {selected.timeline.map((t, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-1 size-2 rounded-full bg-muted-foreground/80" />
                            <div className="text-sm">
                              <div className="font-medium">{t.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(t.at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Message thread */}
                    <div>
                      <div className="mb-2 text-sm font-medium">Conversation</div>
                      <ScrollArea className="h-44 rounded-md border p-3">
                        <div className="space-y-3">
                          {selected.thread.map((m, idx) => (
                            <MessageBubble key={idx} who={m.from} at={m.at} text={m.text} />
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="mt-3 space-y-2">
                        <Textarea placeholder="Write a reply to the buyer/admin…" />
                        <div className="flex items-center justify-between">
                          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                            <Input type="file" className="hidden" />
                            <UploadCloud className="size-4" />
                            Add evidence
                          </label>
                          <Button size="sm">
                            <Send className="mr-2 size-4" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Evidence */}
                    <div>
                      <div className="mb-2 text-sm font-medium">Evidence</div>
                      {selected.evidence.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No files uploaded.</div>
                      ) : (
                        <div className="space-y-2">
                          {selected.evidence.map((f, i) => (
                            <div key={i} className="flex items-center justify-between rounded border p-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Paperclip className="size-4" />
                                {f}
                              </div>
                              <Button size="icon" variant="ghost">
                                <Download className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Actions</div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Truck className="mr-2 size-4" />
                          Offer replacement
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="mr-2 size-4" />
                          Propose partial refund
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCw className="mr-2 size-4" />
                          Request more info
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="mr-2 size-4" />
                          Escalate to admin
                        </Button>
                        <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-600/90">
                          <CheckCircle2 className="mr-2 size-4" />
                          Approve full refund
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="mr-2 size-4" />
                          Reject dispute
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

/* --------------------------- SMALL SUBCOMPONENTS -------------------------- */
function MessageBubble({
  who,
  at,
  text,
}: {
  who: "buyer" | "seller" | "admin";
  at: string;
  text: string;
}) {
  const tone =
    who === "buyer"
      ? "bg-muted"
      : who === "seller"
      ? "bg-primary/10"
      : "bg-amber-50";
  const label = who.charAt(0).toUpperCase() + who.slice(1);
  return (
    <div className={`rounded-lg ${tone} p-2`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(at).toLocaleString()}
        </div>
      </div>
      <div className="mt-1 text-sm">{text}</div>
    </div>
  );
}
