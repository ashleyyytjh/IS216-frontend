import { Search, Settings2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

export default function FilterBar() {
  const options = mockData;
  return (
    <section className="mx-auto max-w-6xl flex gap-4 text-sm">
      <div className="relative flex-1 basis-full md:basis-auto opacity-60 focus-within:opacity-100 transition-opacity">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for notes..."
          className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors"
        />
      </div>

      <RadioGroupPrimitive.Root
        defaultValue={options[0].value}
        className="flex flex-wrap gap-4"
      >
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
      <Button size="icon">
        <Settings2 />
      </Button>
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
