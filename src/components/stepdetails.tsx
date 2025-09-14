import * as React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UploadFormValues } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { centsToDisplay, displayToCents } from "../components/utils";

export default function StepDetails() {
  const methods = useFormContext<UploadFormValues>();
  const { control } = methods;

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  function TagInput({
  value,
  onChange,
  maxTags = 8
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}) {
  const [input, setInput] = React.useState("");

  const addTokens = (raw: string) => {
    // split on commas or whitespace (space, tabs, newlines)
    const tokens = raw
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (tokens.length === 0) return;

    const next = [...value];
    for (const t of tokens) {
      if (next.length >= maxTags) break; 
      if (!next.includes(t)) next.push(t); 
    }
    onChange(next);
  };

  const addFromInput = () => {
    addTokens(input);
    setInput("");
  };

  const removeTag = (t: string) => onChange(value.filter((x) => x !== t));

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const key = e.key;

    // Treat Enter, comma, Tab, and Space as "commit tag" keys
    if (key === "Enter" || key === "," || key === "Tab" || key === " ") {
      e.preventDefault(); // prevent form submit / literal space insertion
      addFromInput();
      return;
    }

    // Remove last tag on Backspace when input is empty
    if (key === "Backspace" && input === "" && value.length) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    }
  };

  const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    addTokens(text);
    setInput("");
  };

  const onBlur = () => {
    
    if (input.trim() !== "") addFromInput();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-2 focus-within:ring-ring">
      {value.map((t) => (
        <Badge key={t} variant="secondary" className="flex items-center gap-1">
          {t}
          <button
            type="button"
            onClick={() => removeTag(t)}
            aria-label={`Remove ${t}`}
            className="leading-none opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </Badge>
      ))}

      <input
        className="min-w-[8ch] flex-1 bg-transparent py-1 text-sm outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onBlur={onBlur}
      />
    </div>
  );
}






  return (
    <section className="space-y-6">
      {fields.map((field, idx) => (
        <Card key={field.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">{field.fileName}</CardTitle>
          </CardHeader>
          <Separator />

         
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2 items-start">
            {/* Title */}
            <FormField
              control={methods.control}
              name={`items.${idx}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., CS1231 Discrete Math Midterm Notes"
                      {...field}
                    />
                  </FormControl>
                  {/* Reserve space for error to avoid layout shift */}
                  <div className="h-5">
                    <FormMessage className="text-xs leading-tight break-words" />
                  </div>
                </FormItem>
              )}
            />

            {/* Course code */}
            <FormField
              control={methods.control}
              name={`items.${idx}.courseCode`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS1231" {...field} />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage className="text-xs leading-tight break-words" />
                  </div>
                </FormItem>
              )}
            />

            {/* Faculty (Select) */}
            <FormField
              control={methods.control}
              name={`items.${idx}.faculty`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a faculty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SIS">SIS</SelectItem>
                      <SelectItem value="LKCSB">LKCSB</SelectItem>
                      <SelectItem value="SOE">SOE</SelectItem>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="SOSS">SOSS</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="h-5">
                    <FormMessage className="text-xs leading-tight break-words" />
                  </div>
                </FormItem>
              )}
            />

            {/* Price (SGD) */}
            <FormField
              control={methods.control}
              name={`items.${idx}.priceCents`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (SGD)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      placeholder="0.00"
                      value={centsToDisplay(field.value ?? 0)}
                      onChange={(e) =>
                        field.onChange(displayToCents(e.target.value))
                      }
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage className="text-xs leading-tight break-words" />
                  </div>
                </FormItem>
              )}
            />

            {/* Visibility */}
            <FormField
              control={methods.control}
              name={`items.${idx}.visibility`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="h-5">
                    <FormMessage className="text-xs leading-tight break-words" />
                  </div>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={methods.control}
              name={`items.${idx}.description`}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="What does this cover? Any disclaimers?"
                      {...field}
                    />
                  </FormControl>
                  <div className="h-5">
                    <FormMessage className="text-xs leading-tight break-words" />
                  </div>
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
  control={methods.control}
  name={`items.${idx}.tags`}
  render={({ field }) => (
    <FormItem className="sm:col-span-2">
      <FormLabel>Tags</FormLabel>
      <FormControl>
        <TagInput
          value={field.value ?? []}              
          onChange={field.onChange}              
          maxTags={8}
        />
      </FormControl>
      <div className="h-5">
        <FormMessage className="text-xs leading-tight break-words" />
      </div>
    </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}