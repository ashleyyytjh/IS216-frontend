import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatCurrency = (n: number) => `S$${n.toFixed(2)}`;

const ORDERS = [
  {
    id: "ord_abc123",
    customerName: "Alice Tan",
    email: "alice@example.com",
    total: 129.5,
    status: "new",
    createdAt: "2025-09-01T10:00:00Z",
  },
  {
    id: "ord_def456",
    customerName: "Ben Goh",
    email: "ben.goh@example.com",
    total: 259.0,
    status: "processing",
    createdAt: "2025-09-02T14:30:00Z",
  },
  {
    id: "ord_xyz789",
    customerName: "Cindy Lim",
    email: "cindy@example.com",
    total: 59.99,
    status: "shipped",
    createdAt: "2025-09-03T08:15:00Z",
  },
];

export default function OrderManage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Order Management (Static)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-sm text-muted-foreground">{o.email}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(o.total)}</TableCell>
                    <TableCell>
                      <Badge>{o.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}