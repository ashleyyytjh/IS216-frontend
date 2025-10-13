import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

type PassedOrderItem = { title: string; module?: string; sku: string; qty: number; price: number };
type PassedOrder = { id: string; placedAt?: string; total: number; items: PassedOrderItem[] };

type OrderItem = { id: string; title: string; sku: string; qty: number; unitPrice: number };
type Order = { id: string; placedAt?: string; items: OrderItem[]; total: number };

const money = (n: number) => (n ?? 0).toLocaleString("en-SG", { style: "currency", currency: "SGD" });

export default function Refund() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const location = useLocation() as { state?: { order?: PassedOrder } };
  const passed = location.state?.order;

  if (!passed) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">No order details found.</p>
      </div>
    );
  }

  const ORDER: Order = React.useMemo(() => {
    const items: OrderItem[] = (passed.items || []).map((it, idx) => ({
      id: it.sku ? `it_${it.sku}` : `it_${idx}`,
      title: it.title ?? "Note",
      sku: String(it.sku ?? ""),
      qty: it.qty ?? 1,
      unitPrice: Number(it.price ?? 0),
    }));
    return {
      id: String(passed.id ?? routeId ?? "N/A"),
      placedAt: passed.placedAt,
      items,
      total: Number(passed.total ?? items.reduce((s, i) => s + i.unitPrice * i.qty, 0)),
    };
  }, [passed, routeId]);

  const [selected, setSelected] = React.useState<Record<string, { checked: boolean; qty: number }>>({});
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setSelected(Object.fromEntries(ORDER.items.map(i => [ i.id, { checked: false, qty: 1 } ])));
  }, [ORDER.items]);

  const selectedLineItems = React.useMemo(() => {
    return ORDER.items
      .filter(i => selected[i.id]?.checked)
      .map(i => ({
        ...i,
        reqQty: Math.max(1, Math.min(selected[i.id].qty || 1, i.qty)),
        lineTotal: (selected[i.id].qty || 1) * i.unitPrice,
      }));
  }, [selected, ORDER.items]);

  const estRefund = React.useMemo(
    () => selectedLineItems.reduce((acc, it) => acc + it.lineTotal, 0),
    [selectedLineItems]
  );

  const toggleItem = (id: string, checked: boolean) =>
    setSelected(p => ({ ...p, [id]: { ...p[id], checked } }));

  const changeQty = (id: string, qty: number, max: number) => {
    const v = Math.max(1, Math.min(qty || 1, max));
    setSelected(p => ({ ...p, [id]: { ...p[id], qty: v } }));
  };

  const onSubmit = () => {
    if (selectedLineItems.length === 0) return alert("Please select at least one item to refund.");
    setConfirmOpen(true);
  };

  async function confirmSubmit() {
    setSubmitting(true);
    try {
      // TODO: refund API call
      await new Promise(r => setTimeout(r, 600));
      setSuccessOpen(true);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 py-8">
      <Card className="rounded-2xl border shadow-lg">
        {/* Header */}
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight">Refund</CardTitle>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground text-right">
                Order #{ORDER.id}
                {ORDER.placedAt ? ` • Placed ${new Date(ORDER.placedAt).toLocaleString()}` : ""}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Panel */}
          <div className="mx-4 my-4 rounded-2xl border overflow-hidden">
            <div className="px-4 pt-4 pb-2 text-base font-medium">Select items to refund</div>

            {/* md+ table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-48">Qty</TableHead>
                    <TableHead className="text-right w-40">Unit price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ORDER.items.map((it) => {
                    const sel = selected[it.id];
                    return (
                      <TableRow key={it.id} className="align-middle">
                        <TableCell>
                          <Checkbox checked={sel?.checked} onCheckedChange={(v) => toggleItem(it.id, Boolean(v))} />
                        </TableCell>
                        <TableCell>
                          <div className="truncate font-medium">{it.title}</div>
                          <div className="text-xs text-muted-foreground break-words">{it.sku}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              max={it.qty}
                              value={sel?.qty ?? 1}
                              onChange={(e) => changeQty(it.id, Number(e.target.value), it.qty)}
                              className="h-8 w-24"
                              disabled={!sel?.checked}
                            />
                            <span className="text-xs text-muted-foreground">of {it.qty}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{money(it.unitPrice)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* mobile stacked list */}
            <div className="md:hidden divide-y">
              {ORDER.items.map((it) => {
                const sel = selected[it.id];
                return (
                  <div key={it.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={sel?.checked}
                          onCheckedChange={(v) => toggleItem(it.id, Boolean(v))}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium leading-snug">{it.title}</div>
                          <div className="text-xs text-muted-foreground break-words">{it.sku}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm font-medium">{money(it.unitPrice)}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Quantity (of {it.qty})</span>
                      <Input
                        type="number"
                        min={1}
                        max={it.qty}
                        value={sel?.qty ?? 1}
                        onChange={(e) => changeQty(it.id, Number(e.target.value), it.qty)}
                        className="h-9 w-24"
                        disabled={!sel?.checked}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Refunded-to-card bar */}
            <div className="border-t px-4 py-3">
              <div className="rounded-xl border bg-muted/30 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Refunded to card</span>
                <span className="text-sm font-medium">{money(estRefund)}</span>
              </div>
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="px-4 sm:px-6 pb-6 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
              Submit Refund
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm refund?</DialogTitle>
            <DialogDescription>The refund will be credited back to your original payment method.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Items selected</span><span>{selectedLineItems.length}</span></div>
            <div className="flex justify-between"><span>Total refund</span><span>{money(estRefund)}</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmSubmit} disabled={submitting}>{submitting ? "Processing..." : "Confirm Refund"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Successful</DialogTitle>
            <DialogDescription>
              Your refund for Order #{ORDER.id} has been processed and credited to your card.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setSuccessOpen(false); navigate("/orders"); }}>
              Back to My Orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
