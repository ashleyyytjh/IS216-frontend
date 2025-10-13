import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { ChartBarLabel } from "@/components/seller-bar";
import { ChartPieInteractive } from "@/components/seller-pie";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { getUser } from "@/services/UserService";
import { getOrders } from "@/services/OrdersService";
import { getNotesById, getUserOwned } from "@/services/NotesService";
import { ScatterVisual } from "@/components/scatter-chart";
import { GetNotesRes } from "@/types/requests/notes";

export default function DashboardSeller() {
  const [animate, setAnimate] = useState(false);

  // shared state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadInfo, setLoadInfo] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalNoteCount, setTotalNoteCount] = useState(0);
  const [topModule, setTopModule] = useState<{
    module: string;
    count: number;
  } | null>(null);
  const [moduleCountsArray, setModuleCountsArray] = useState<
    { module: string; count: number }[]
  >([]);
  const [moduleRevenueArray, setModuleRevenueArray] = useState<
    { module: string; revenue: number }[]
  >([]);
  //total sales count is calling from API.
  useEffect(() => {
    setAnimate(true); 
  }, []);

  useEffect(() => {
    getUser()
      .then((resp) => setCurrentUser(resp))
      .catch((err) => console.error("Error fetching user:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    getOrders()
      .then((orders) => {
        const uniqueNoteIds = [...new Set(orders.map((o) => o.note_id))];
        return Promise.all(
          uniqueNoteIds.map((id) =>
            getNotesById(String(id)).catch((err) => {
              console.error("Failed fetching note", id, err);
              return null;
            })
          )
        ).then((notes) => ({ orders, notes }));
      })
      .then(({ orders, notes }) => {
        const noteMap = new Map(
          (notes ?? [])
            .filter((note): note is GetNotesRes => Boolean(note))
            .map(note => [note?.id, note])
        );

        let total = 0;
        let totalCnt = 0;
        const moduleCountMap = new Map<string, number>();
        const moduleRevenueMap = new Map<string, number>();

        orders.forEach((order) => {
          console.log(order)
          const note = noteMap.get(order.note_id);
          if (note && note.userId === currentUser.sub) {
            if (order.status == "succeeded") {
              total += Number(order.price) / 100;
              totalCnt += 1;
              const mod = note.module?.toUpperCase() || "Unknown";
              moduleCountMap.set(mod, (moduleCountMap.get(mod) || 0) + 1);
              moduleRevenueMap.set(
                mod,
                (moduleRevenueMap.get(mod) || 0) + Number(order.price) / 100
              );
            }

          }
        });

        //dummy additions (optional)
        // moduleCountMap.set("CS101", (moduleCountMap.get("CS101") || 0) + 100)
        // moduleCountMap.set("IS216", (moduleCountMap.get("IS216") || 0) + 90)

        // moduleRevenueMap.set("CS101", (moduleRevenueMap.get("CS101") || 0) + 500000 / 100)
        // moduleRevenueMap.set("IS216", (moduleRevenueMap.get("IS216") || 0) + 30000 / 100)
        const arr = Array.from(moduleCountMap.entries())
          .map(([module, count]) => ({ module, count }))
          .sort((a, b) => b.count - a.count);

        const revenueArr = Array.from(moduleRevenueMap.entries())
          .map(([module, revenue]) => ({ module, revenue }))
          .sort((a, b) => b.revenue - a.revenue);

        setModuleCountsArray(arr);
        setLoadInfo(false);
        setModuleRevenueArray(revenueArr);
        setTotalSales(total);
        setTotalNoteCount(totalCnt);
        setTopModule(arr[0] || null);
      })
      .catch((err) => console.error("Error fetching sales:", err));
  }, [currentUser]);

  getUserOwned()
    .then((resp) => {
      console.log(resp);
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div
      className={
        animate
          ? "fade-in container w-[80%] ml-auto mr-auto"
          : "container w-[80%] ml-auto mr-auto"
      }
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <SidebarInset className="mt-5">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards
                  loadInfo={loadInfo}
                  totalSales={totalSales}
                  totalNoteCount={totalNoteCount}
                  topModule={topModule}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 lg:px-6 w-full items-stretch">
                  <div className="w-full">
                    <ChartPieInteractive moduleCountsArray={moduleCountsArray} />
                  </div>
                  <div className="w-full">
                    <ChartBarLabel moduleRevenueArray={moduleRevenueArray} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="w-[100%] lg:w-[100%] px-6">
                    <ScatterVisual />
                  </div>
                </div>
                <DataTable currentUser={currentUser} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
