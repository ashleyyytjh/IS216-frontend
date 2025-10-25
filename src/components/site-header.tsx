
import { CardTitle } from "./ui/card"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 lg:gap-2">
         <CardTitle className="text-xl text-foreground">Seller Dashboard Analytics</CardTitle>
      </div>
    </header>
  )
}
