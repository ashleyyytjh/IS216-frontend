import { Search, Settings2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChangeEvent, useState } from "react";
import { TypeOption } from "@/types/types";

type FilterBarProps = {
  query: string;
  setQuery: (q: string) => void;
  type: string;
  setType: (t: string) => void;
  showPaid: boolean;
  setShowPaid: (b: boolean) => void;
  options: TypeOption[];
  onSearch: () => void;
  timeFilter: string;
  setTimeFilter: (s: string) => void;
};

export default function FilterBar({
  query,
  setQuery,
  type,
  setType,
  showPaid,
  setShowPaid,
  onSearch,
  options,
  timeFilter,
  setTimeFilter,
}: FilterBarProps) {

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("enter")
      onSearch()
    }
  }

  const handleType = (e: ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value)
  }

  return (
    <section className="mx-auto max-w-6xl flex gap-4 text-sm">
      <div className="relative flex-1 basis-full md:basis-auto opacity-60 focus-within:opacity-100 transition-opacity">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          type="search"
          placeholder="Search for notes..."
          className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors"
        />
      </div>

      <RadioGroupPrimitive.Root
        value={type}
        onValueChange={setType}
        className="flex flex-wrap gap-4"
      >
          <RadioGroupPrimitive.Item
            key="all"
            value=""
            className="ring-[1px] ring-border rounded-md py-1 px-3 data-[state=checked]:bg-muted shadow-xs"
          >
            <span className="tracking-tight whitespace-nowrap">{`All(${options.reduce((acc, opt) => acc + opt.count, 0)})`}</span>
          </RadioGroupPrimitive.Item>
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.value}
            value={option.value}
            className="ring-[1px] ring-border rounded-md py-1 px-3 data-[state=checked]:bg-muted shadow-xs"
          >
            <span className="tracking-tight whitespace-nowrap">{`${option.label}(${option.count})`}</span>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon">
            <Settings2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={showPaid} onCheckedChange={setShowPaid}>Show Paid Items</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Published Since</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={timeFilter} onValueChange={setTimeFilter}>
              <DropdownMenuRadioItem value="">{"All Time"}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="year">{"< 1 Year"}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="6month">{"< 6 Months"}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="month">{"< 1 Month"}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="week">{"< 1 Week"}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}

const mockData = [
  {
    value: "notes",
    label: "Notes",
    count: 22,
  },
  {
    value: "cheatsheet",
    label: "Cheat Sheets",
    count: 14,
  },
  {
    value: "answerkey",
    label: "Answer Key",
    count: 4,
  },
  {
    value: "knowledge",
    label: "Knowledge",
    count: 8,
  },
];
