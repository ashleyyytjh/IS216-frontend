"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrders } from "@/services/OrdersService";
import type { PopularityCounts } from "@/utils/relevance";

export type Order = {
  id: number;
  note_id: string;
  status: "created" | "processing" | "succeeded" | "failed";
  createdAt?: string;
};

export type PopularityOpts = {
  statuses?: Array<Order["status"]>;
  days?: number; // only count if within last N days
};

function withinWindow(o: Order, days?: number) {
  if (!days || !o.createdAt) return true;
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(o.createdAt).getTime() >= since;
}

export function useOrderPopularity(
  opts: PopularityOpts = { statuses: ["succeeded"], days: 90 }
) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrders()
      .then((os) => { if (!cancelled) setOrders(os ?? []); })
      .catch(() => { if (!cancelled) setOrders([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const statusesKey = useMemo(
    () => (opts.statuses ?? ["succeeded"]).slice().sort().join(","),
    [opts.statuses]
  );

  const { counts, signature } = useMemo(() => {
    const map: PopularityCounts = new Map();
    if (!orders) return { counts: map, signature: "" };

    const allowed = new Set((statusesKey || "").split(",").filter(Boolean));
    for (const o of orders) {
      if (!allowed.has(o.status)) continue;
      if (!withinWindow(o, opts.days)) continue;
      map.set(o.note_id, (map.get(o.note_id) ?? 0) + 1);
    }

    const sig = Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}:${v}`)
      .join("|");

    return { counts: map, signature: sig };
  }, [orders, statusesKey, opts.days]);

  return { counts, signature, loading } as const;
}
