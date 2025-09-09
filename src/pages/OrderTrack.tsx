import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Book, Package, Clock, ChevronDown, ChevronUp, Truck } from "lucide-react";

type Status =
  | "Placed"
  | "Processing"
  | "Printed"
  | "Shipped"
  | "Delivered"
  | "Ready for download";

type NoteOrder = {
  id: string;
  placedAt: string;
  status: Status;
  eta?: string;
  total: number;
  items: Array<{ type: "Soft copy" | "Hard copy"; title: string; qty: number; price: number }>;
  history: Array<{ at: string; text: string }>;
};

const MOCK: NoteOrder[] = [
  {
    id: "N-2025-001",
    placedAt: "2025-01-03T10:15:00Z",
    eta: "2025-01-06",
    status: "Printed",
    total: 18.0,
    items: [
      { type: "Soft copy", title: "Econs Lecture Notes (PDF)", qty: 1, price: 5.0 },
      { type: "Hard copy", title: "Statistics Revision Guide (Printed)", qty: 1, price: 13.0 },
    ],
    history: [
      { at: "2025-01-03 10:15", text: "Order placed" },
      { at: "2025-01-03 10:20", text: "Payment confirmed" },
      { at: "2025-01-04 09:00", text: "Notes sent to printer" },
    ],
  },
  {
    id: "N-2025-002",
    placedAt: "2025-01-02T14:40:00Z",
    eta: "2025-01-03",
    status: "Ready for download",
    total: 8.0,
    items: [{ type: "Soft copy", title: "Accounting Practice Questions (PDF)", qty: 1, price: 8.0 }],
    history: [
      { at: "2025-01-02 14:40", text: "Order placed" },
      { at: "2025-01-02 14:41", text: "Payment confirmed" },
      { at: "2025-01-02 14:42", text: "Digital notes ready for download" },
    ],
  },
];

const pill = (s: Status) => {
  switch (s) {
    case "Placed":
      return <Badge className="bg-slate-100 text-slate-700">Placed</Badge>;
    case "Processing":
      return <Badge className="bg-amber-100 text-amber-700">Processing</Badge>;
    case "Printed":
      return <Badge className="bg-indigo-100 text-indigo-700">Printed</Badge>;
    case "Shipped":
      return <Badge className="bg-blue-100 text-blue-700">Shipped</Badge>;
    case "Delivered":
      return <Badge className="bg-emerald-100 text-emerald-700">Delivered</Badge>;
    case "Ready for download":
      return <Badge className="bg-cyan-100 text-cyan-700">Ready for download</Badge>;
  }
};

export default function NotesOrders() {
  const [q, setQ] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const orders = React.useMemo(() => {
    return MOCK.filter((o) =>
      `${o.id} ${o.status} ${o.items.map((i) => i.title).join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-8">
      <h1 className="mb-4 text-2xl font-semibold">My Notes Orders</h1>

      <div className="mb-4">
        <Input
          placeholder="Search by order ID, note title, or status..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No note orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isOpen = expanded === o.id;
            return (
              <Card key={o.id}>
                <CardHeader
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="cursor-pointer flex flex-row items-center justify-between"
                >
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {o.items.some((i) => i.type === "Hard copy") ? (
                        <Book className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                      Order #{o.id}
                      {pill(o.status)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed {new Date(o.placedAt).toLocaleString()} • Total:{" "}
                      {o.total.toLocaleString("en-SG", {
                        style: "currency",
                        currency: "SGD",
                      })}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </CardHeader>

                {isOpen && (
                  <CardContent className="space-y-4">
                    {/* ETA */}
                    {o.eta && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        ETA: {o.eta}
                      </div>
                    )}

                    <Separator />

                    {/* Items */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Notes in this order</h3>
                      <div className="overflow-auto rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {o.items.map((it, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{it.type}</TableCell>
                                <TableCell>{it.title}</TableCell>
                                <TableCell>{it.qty}</TableCell>
                                <TableCell className="text-right">
                                  {it.price.toLocaleString("en-SG", {
                                    style: "currency",
                                    currency: "SGD",
                                  })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Order Timeline</h3>
                      <div className="space-y-2">
                        {o.history.map((h, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/80" />
                            <div>
                              <div className="font-medium">{h.text}</div>
                              <div className="text-xs text-muted-foreground">{h.at}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping info for hard copy */}
                    {o.items.some((i) => i.type === "Hard copy") && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4" />
                        Hard copy notes will be shipped to your address.
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
