import * as React from "react";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

  export type FilterOption = "all" | "page";

  interface DiscussionFilterProps {
    onFilterChange: (filter: FilterOption) => void;
  }

export function ForumFilterButton({ onFilterChange }: DiscussionFilterProps) {
    const [filter, setFilter] = React.useState<FilterOption>("all");

    const handleValueChange = (value: string) => {
      const newFilter = value as FilterOption;
      setFilter(newFilter);
      onFilterChange(newFilter);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" />
            Filter Discussions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filter} onValueChange={handleValueChange}>
            <DropdownMenuRadioItem value="all">All Discussions</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="page">This Page</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
