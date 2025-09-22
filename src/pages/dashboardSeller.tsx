import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ChartBarLabel } from "@/components/chart-bar-label";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

export default function DashboardSeller() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // trigger animation after mount
  }, []);

  return (
    <div className={animate ? "fade-in container w-[80%] ml-auto mr-auto" : "container w-[80%] ml-auto mr-auto"}>
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
                <SectionCards />
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
                  <div className="flex-1 px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  <div className="flex-1 px-4 lg:px-6">
                    <ChartBarLabel />
                  </div>
                </div>
                <DataTable />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

    </div>

  )
}
