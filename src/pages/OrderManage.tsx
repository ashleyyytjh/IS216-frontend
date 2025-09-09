import * as React from "react";
import {
  Badge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  AlignLeft,
  Archive,
  Ban,
  ChevronDown,
  CircleCheck,
  CircleDot,
  Clock3,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Trash2,
  Users,
  X,
  Menu,
  MessageSquareWarning,
  RotateCw,
} from "lucide-react";

type Status =
  | "new"
  | "processing"
  | "ready"
  | "shipped"
  | "delivered"
  | "paid"
  | "refunded"
  | "cancelled";

type Order = {
  id: string;
  customerName: string;
  email: string;
  items: number;
  total: number;
  status: Status;
  method: "Card" | "Bank Transfer" | "Cash" | "PayNow";
  createdAt: string; // ISO
};

const formatCurrency = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

const STATUS_META: Record<
  Status,
  { label: string; color: string; dot: string }
> = {
  new: { label: "New", color: "bg-sky-100 text-sky-700", dot: "bg-sky-600" },
  processing: {
    label: "Processing",
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-600",
  },
  ready: {
    label: "Ready for pickup",
    color: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-600",
  },
  shipped: {
    label: "On the way",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-600",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-600",
  },
  paid: { label: "Paid", color: "bg-teal-100 text-teal-700", dot: "bg-teal-600" },
  refunded: {
    label: "Refunded",
    color: "bg-violet-100 text-violet-700",
    dot: "bg-violet-600",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-700",
    dot: "bg-rose-600",
  },
};

const MOCK_ORDERS: Order[] = [
  {
    id: "C-4099",
    customerName: "Nico",
    email: "nico@example.com",
    items: 3,
    total: 21.0,
    status: "paid",
    method: "Card",
    createdAt: "2025-01-03T12:39:00Z",
  },
  {
    id: "C-4084",
    customerName: "Everson P S Dias",
    email: "everson@example.com",
    items: 3,
    total: 21.75,
    status: "paid",
    method: "Card",
    createdAt: "2024-12-28T22:47:00Z",
  },
  {
    id: "C-4082",
    customerName: "Kellen",
    email: "kellen@example.com",
    items: 1,
    total: 8.0,
    status: "shipped",
    method: "PayNow",
    createdAt: "2024-12-27T16:26:00Z",
  },
  {
    id: "C-4081",
    customerName: "TH",
    email: "th@example.com",
    items: 2,
    total: 7.01,
    status: "ready",
    method: "Cash",
    createdAt: "2024-12-27T15:41:00Z",
  },
  {
    id: "C-4079",
    customerName: "BoraEstampar",
    email: "bora@example.com",
    items: 4,
    total: 73.35,
    status: "paid",
    method: "Card",
    createdAt: "2024-12-26T09:04:00Z",
  },
  {
    id: "C-4078",
    customerName: "Rodrigo Ribeiro",
    email: "rodrigo@example.com",
    items: 1,
    total: 8.0,
    status: "paid",
    method: "Card",
    createdAt: "2024-12-26T15:48:00Z",
  },
  {
    id: "C-4076",
    customerName: "Henrique Araujo",
    email: "henrique@example.com",
    items: 2,
    total: 48.9,
    status: "shipped",
    method: "PayNow",
    createdAt: "2024-12-26T08:32:00Z",
  },
  {
    id: "C-4075",
    customerName: "Cecili",
    email: "cecili@example.com",
    items: 1,
    total: 10.7,
    status: "new",
    method: "Card",
    createdAt: "2024-12-24T00:53:00Z",
  },
  {
    id: "C-4074",
    customerName: "Bianca",
    email: "bianca@example.com",
    items: 2,
    total: 15.0,
    status: "processing",
    method: "Bank Transfer",
    createdAt: "2024-12-24T00:48:00Z",
  },
];

const SideNav: React.FC = () => {
  const linkClass =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition";
  return (
    <aside className="hidden border-r bg-card/50 lg:block w-64">
      <div className="p-4">
        <div className="flex items-center gap-2 pb-4">
          <div className="size-9 rounded-xl bg-primary/10 grid place-items-center">
            <ShoppingCart className="size-5" />
          </div>
          <div className="font-semibold">onlyNotes.Store1</div>
        </div>
        <nav className="space-y-1">
          <a className={linkClass} href="#">
            <AlignLeft className="size-4" /> Dashboard
          </a>
          <a className={`${linkClass} bg-accent`} href="#">
            <Package className="size-4" /> Orders
          </a>
          <a className={linkClass} href="#">
            <Users className="size-4" /> Customers
          </a>
          <a className={linkClass} href="#">
            <RotateCw className="size-4" /> Returns & Refunds
          </a>
          <a className={linkClass} href="#">
            <MessageSquareWarning className="size-4" /> Disputes
          </a>
          <a className={linkClass} href="#">
            <Archive className="size-4" /> Products
          </a>
          <a className={linkClass} href="#">
            <Mail className="size-4" /> Messages
          </a>
          <Separator className="my-2" />
          <a className={linkClass} href="#">
            <Settings className="size-4" /> Settings
          </a>
        </nav>
      </div>
    </aside>
  );
};

const MobileNav: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-primary/10 grid place-items-center">
              <ShoppingCart className="size-5" />
            </div>
            Grano Café
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {[
              { icon: AlignLeft, label: "Dashboard" },
              { icon: Package, label: "Orders" },
              { icon: Users, label: "Customers" },
              { icon: RotateCw, label: "Returns & Refunds" },
              { icon: MessageSquareWarning, label: "Disputes" },
              { icon: Archive, label: "Products" },
              { icon: Mail, label: "Messages" },
              { icon: Settings, label: "Settings" },
            ].map((i) => (
              <a
                key={i.label}
                href="#"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-accent"
              >
                <i.icon className="size-4" />
                {i.label}
              </a>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default function OrderManagement() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"all" | Status>("all");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = React.useState<
    Record<Order["method"], boolean>
  >({ Card: true, "Bank Transfer": true, Cash: true, PayNow: true });

  const orders = React.useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      const text =
        `${o.id} ${o.customerName} ${o.email}`.toLowerCase();
      const matchesText = text.includes(q.trim().toLowerCase());
      const matchesStatus = status === "all" ? true : o.status === status;
      const matchesPayment = paymentFilter[o.method];
      return matchesText && matchesStatus && matchesPayment;
    });
  }, [q, status, paymentFilter]);

  const allSelected = selected.length > 0 && selected.length === orders.length;
  const toggleAll = (checked: boolean) =>
    setSelected(checked ? orders.map((o) => o.id) : []);

  const toggleOne = (id: string, checked: boolean) =>
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <SideNav />

        {/* Main */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 p-3 lg:p-4">
              <MobileNav />
              <div className="ml-1 text-xl font-semibold tracking-tight">
                {orders.length.toLocaleString()} open orders
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 size-4" />
                  Export
                </Button>
                <Avatar className="size-8">
                  <AvatarFallback>JE</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex w-full items-center gap-2 lg:max-w-xl">
                    <div className="relative w-full">
                      <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Item, customer or code"
                        className="pl-9"
                      />
                    </div>

                    {/* Filters */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Filter className="mr-2 size-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72" align="start">
                        <DropdownMenuLabel>Date range</DropdownMenuLabel>
                        <div className="px-2 pb-2 text-xs text-muted-foreground">
                          (Stub) Add your Calendar/DateRange picker here
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Payment method</DropdownMenuLabel>
                        {(["Card", "Bank Transfer", "Cash", "PayNow"] as const).map(
                          (m) => (
                            <DropdownMenuCheckboxItem
                              key={m}
                              checked={paymentFilter[m]}
                              onCheckedChange={(v) =>
                                setPaymentFilter((prev) => ({
                                  ...prev,
                                  [m]: Boolean(v),
                                }))
                              }
                            >
                              {m}
                            </DropdownMenuCheckboxItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Status */}
                    <Select
                      value={status}
                      onValueChange={(v) =>
                        setStatus(v as "all" | Status)
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        {Object.keys(STATUS_META).map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_META[s as Status].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    {selected.length > 0 ? (
                      <>
                        <Button variant="outline" size="sm">
                          <CircleCheck className="mr-2 size-4" />
                          Mark as paid
                        </Button>
                        <Button variant="outline" size="sm">
                          <Truck className="mr-2 size-4" />
                          Mark as shipped
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 size-4" />
                          Delete ({selected.length})
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm">
                          <Plus className="mr-2 size-4" />
                          Create order
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCcw className="mr-2 size-4" />
                          Sync
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={(v) => toggleAll(Boolean(v))}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customers</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-12 text-right">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {orders.map((o) => {
                        const meta = STATUS_META[o.status];
                        return (
                          <TableRow key={o.id} className="hover:bg-muted/40">
                            <TableCell>
                              <Checkbox
                                checked={selected.includes(o.id)}
                                onCheckedChange={(v) =>
                                  toggleOne(o.id, Boolean(v))
                                }
                                aria-label={`Select ${o.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              #{o.id}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(o.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{o.customerName}</div>
                              <div className="text-xs text-muted-foreground">
                                {o.email}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {o.items} {o.items === 1 ? "item" : "items"}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(o.total)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${meta.color}`}
                              >
                                <span
                                  className={`size-2 rounded-full ${meta.dot}`}
                                />
                                {meta.label}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {o.method}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <MenuItem icon={Pencil} label="Edit" />
                                  <MenuItem icon={Truck} label="Mark as shipped" />
                                  <MenuItem icon={CircleDot} label="Set status…" />
                                  <MenuItem icon={Ban} label="Cancel order" />
                                  <DropdownMenuSeparator />
                                  <MenuItem icon={Trash2} label="Delete" destructive />
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {orders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            No orders match your filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Footer / pagination (static demo) */}
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <div>Showing {orders.length} result(s)</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Prev
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  destructive,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  destructive?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted ${
        destructive ? "text-destructive" : ""
      }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
