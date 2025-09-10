import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup, RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Book, FileText, UploadCloud, HelpCircle, Info, Image as ImageIcon, File as FileIcon, CheckCircle2
} from "lucide-react";

type ItemType = "Soft copy" | "Hard copy";
type OrderItem = {
  id: string;
  type: ItemType;
  title: string;
  sku: string;
  qty: number;            // purchased
  unitPrice: number;
  fulfillStatus: "Delivered" | "Shipped" | "Printed" | "Ready" | "Other";
};

type Order = {
  id: string;
  placedAt: string;
  status: "Delivered" | "Shipped" | "Printed" | "Processing";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

const MOCK_ORDER: Order = {
  id: "N-2025-001",
  placedAt: "2025-01-03T10:15:00Z",
  status: "Printed",
  items: [
    {
      id: "it_1",
      type: "Soft copy",
      title: "Econs Lecture Notes (PDF)",
      sku: "PDF-ECON-101",
      qty: 1,
      unitPrice: 5.0,
      fulfillStatus: "Printed",
    },
    {
      id: "it_2",
      type: "Hard copy",
      title: "Statistics Revision Guide (Printed)",
      sku: "PRINT-STAT-201",
      qty: 1,
      unitPrice: 13.0,
      fulfillStatus: "Printed",
    },
  ],
  subtotal: 18.0,
  shipping: 3.0,
  tax: 0.0,
  total: 21.0,
};

const money = (n: number) => n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

export default function ReturnRefund() {
  const navigate = useNavigate();

  // Form state
  const [selectedItems, setSelectedItems] = React.useState<Record<string, { checked: boolean; qty: number }>>(
    Object.fromEntries(MOCK_ORDER.items.map(i => [i.id, { checked: false, qty: 1 }]))
  );
  const [reason, setReason] = React.useState<string>("");
  const [details, setDetails] = React.useState<string>("");
  const [resolution, setResolution] = React.useState<"refund" | "replacement" | "store_credit">("refund");
  const [refundMethod, setRefundMethod] = React.useState<"original" | "store_credit">("original");
  const [files, setFiles] = React.useState<File[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const anySelected = Object.values(selectedItems).some(v => v.checked);

  const selectedLineItems = React.useMemo(() => {
    return MOCK_ORDER.items
      .filter(i => selectedItems[i.id]?.checked)
      .map(i => ({
        ...i,
        reqQty: Math.max(1, Math.min(selectedItems[i.id].qty || 1, i.qty)),
        lineTotal: (selectedItems[i.id].qty || 1) * i.unitPrice,
      }));
  }, [selectedItems]);

  const estRefund = React.useMemo(() => {
    const itemsSum = selectedLineItems.reduce((acc, it) => acc + it.lineTotal, 0);
    // Business rule example:
    // - If only soft copies requested and status is "Ready" (digital delivered), allow prorated refund?
    // For demo, we simply sum selected items. Shipping not included unless all items are returned.
    const allItemsSelected = selectedLineItems.length === MOCK_ORDER.items.length &&
      selectedLineItems.every(it => it.reqQty === it.qty);
    const shipping = allItemsSelected ? MOCK_ORDER.shipping : 0;
    return itemsSum + shipping;
  }, [selectedLineItems]);

  function toggleItem(id: string, checked: boolean) {
    setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], checked } }));
  }
  function changeQty(id: string, qty: number) {
    setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], qty } }));
  }
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files);
    setFiles(prev => [...prev, ...arr]);
  }
  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  function onSubmit() {
    // Simple required checks
    if (!anySelected) {
      alert("Please select at least one item to return/refund.");
      return;
    }
    if (!reason) {
      alert("Please select a reason.");
      return;
    }
    setConfirmOpen(true);
  }

  async function confirmSubmit() {
    setSubmitting(true);
    try {
      // TODO: replace with API call
      // await api.createReturnRequest({ ...payload })
      await new Promise(res => setTimeout(res, 600));
      setSuccessOpen(true);
      // Optionally clear form here
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 lg:p-8">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Return / Refund Request</h1>
          <Badge variant="secondary">Order #{MOCK_ORDER.id}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Placed on {new Date(MOCK_ORDER.placedAt).toLocaleString()}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left: Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">1) Select items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Items table */}
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ORDER.items.map((it) => {
                    const Icon = it.type === "Hard copy" ? Book : FileText;
                    const sel = selectedItems[it.id];
                    return (
                      <TableRow key={it.id} className="align-top">
                        <TableCell>
                          <Checkbox
                            checked={sel?.checked}
                            onCheckedChange={(v) => toggleItem(it.id, Boolean(v))}
                            aria-label={`Select ${it.title}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{it.title}</div>
                          <div className="text-xs text-muted-foreground">{it.sku}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {it.type}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              max={it.qty}
                              value={sel?.qty ?? 1}
                              onChange={(e) => changeQty(it.id, Math.max(1, Math.min(Number(e.target.value || 1), it.qty)))}
                              className="h-8 w-20"
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

            <Separator />

            {/* Reason + resolution */}
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-medium">2) Reason</div>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_received">Item not received</SelectItem>
                      <SelectItem value="damaged">Damaged / print quality issue</SelectItem>
                      <SelectItem value="wrong_item">Wrong item delivered</SelectItem>
                      <SelectItem value="download_issue">Cannot download digital notes</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    3) Desired outcome
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <RadioGroup
                    value={resolution}
                    onValueChange={(v: "refund" | "replacement" | "store_credit") => setResolution(v)}
                    className="flex flex-wrap gap-2"
                  >
                    <label className="flex items-center gap-2 rounded-md border p-2">
                      <RadioGroupItem value="refund" id="res-refund" />
                      <span>Refund</span>
                    </label>
                    <label className="flex items-center gap-2 rounded-md border p-2">
                      <RadioGroupItem value="replacement" id="res-replace" />
                      <span>Replacement</span>
                    </label>
                  </RadioGroup>
                </div>
              </div>

              {/* Refund method (only if refund chosen) */}
              {resolution === "refund" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm font-medium">Refund method</div>
                    <RadioGroup
                      value={refundMethod}
                      onValueChange={(v: "original" | "store_credit") => setRefundMethod(v)}
                      className="grid gap-2"
                    >
                      <label className="flex items-center gap-2 rounded-md border p-2">
                        <RadioGroupItem value="original" id="rm-1" />
                        <span>Original payment method</span>
                      </label>
                      <label className="flex items-center gap-2 rounded-md border p-2">
                        <RadioGroupItem value="store_credit" id="rm-2" />
                        <span>Store credit (faster)</span>
                      </label>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="mb-2 text-sm font-medium">4) Describe the issue</div>
                <Textarea
                  placeholder="Tell us what went wrong. Include order context, page numbers with defects, or error messages for downloads."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                />
                <div className="mt-1 text-xs text-muted-foreground">{details.length}/800</div>
              </div>

              {/* Evidence upload */}
              <div>
                <div className="mb-2 text-sm font-medium">5) Add evidence (optional)</div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border p-4 text-sm hover:bg-muted/40">
                  <Input type="file" className="hidden" multiple accept="image/*,.pdf" onChange={onFiles} />
                  <UploadCloud className="h-4 w-4" />
                  Upload images or PDFs
                </label>
                {files.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {files.map((f, i) => {
                      const isImg = f.type.startsWith("image/");
                      return (
                        <div key={i} className="flex items-center justify-between rounded border p-2 text-sm">
                          <div className="flex items-center gap-2">
                            {isImg ? <ImageIcon className="h-4 w-4" /> : <FileIcon className="h-4 w-4" />}
                            <span className="max-w-[200px] truncate">{f.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(i)}
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Submit */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button onClick={onSubmit} disabled={submitting}>
                Submit request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Summary */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-3 text-sm">
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <Info className="h-4 w-4" />
                  Selected items
                </div>
                {selectedLineItems.length === 0 ? (
                  <div className="text-muted-foreground">No items selected.</div>
                ) : (
                  <div className="space-y-2">
                    {selectedLineItems.map((it) => (
                      <div key={it.id} className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{it.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {it.type} • {it.reqQty} × {money(it.unitPrice)}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{money(it.lineTotal)}</div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estimated refund</span>
                      <span className="text-sm font-semibold">{money(estRefund)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-3 text-sm">
                <div className="mb-1 text-xs text-muted-foreground">Order total</div>
                <div className="flex justify-between"><span>Subtotal</span><span>{money(MOCK_ORDER.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{money(MOCK_ORDER.shipping)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{money(MOCK_ORDER.tax)}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span><span>{money(MOCK_ORDER.total)}</span>
                </div>
              </div>

              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">Policy notes</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Digital notes are refundable only if downloads failed or files are corrupted.</li>
                  <li>Printed notes must be unused and returned within 7 days of delivery.</li>
                  <li>Shipping is refunded only when all items are returned.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit return/refund request?</DialogTitle>
            <DialogDescription>
              We’ll create a support ticket and email you updates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items selected</span>
              <span className="font-medium">{selectedLineItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated refund</span>
              <span className="font-medium">{money(estRefund)}</span>
            </div>
            <div className="flex justify-between">
              <span>Outcome</span>
              <span className="font-medium">
                {resolution === "refund" ? "Refund" : resolution === "replacement" ? "Replacement" : "Store credit"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Review again</Button>
            <Button onClick={confirmSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Confirm & submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Request submitted
            </DialogTitle>
            <DialogDescription>
              Your case ID is <span className="font-medium">RR-{MOCK_ORDER.id}</span>. We’ll email you next steps.
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
