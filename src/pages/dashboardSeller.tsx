import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
//import {myNotes} from '../types/types.ts';
import sampleData from '../app/dashboard/data.json'; // Adjust path as needed
 

export default function DashboardSeller() {

  return (
    <div className="container w-[80%] ml-auto mr-auto fade-in">
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
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={sampleData} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

    </div>

  )
}
