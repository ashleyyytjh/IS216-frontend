"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function ForumFilterButton({ onFilterChange }) {
  const [selected, setSelected] = useState("all");

  const handleSelect = (value: "all" | "page") => {
    setSelected(value)
    onFilterChange(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
          <Filter className="h-4 w-4" />
          Filter by {selected === "all" ? "All" : "Page"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSelect("all")}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("page")}>
          Page
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
