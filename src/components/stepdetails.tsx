"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FileText,
  DollarSign,
  Tag as TagIcon,
  Sparkles,
  Edit3,
  Grid3x3,
  CheckIcon,
  PlusIcon,
  File,
} from "lucide-react";
import {
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
import { UploadFormValues } from "./schema";
import { centsToDisplay, displayToCents } from "../components/utils";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "./ui/shadcn-io/tags";
import { PriceInput } from "./upload/PriceInput";

export function TagInput({
  value,
  onChange,
  maxTags = 8,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}) {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleSelect = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else if (value.length < maxTags) {
      onChange([...value, id]);
    }
  };

  const handleCreateTag = () => {
    const newTag = inputValue.trim();
    if (!newTag || value.includes(newTag) || value.length >= maxTags) return;
    onChange([...value, newTag]);
    setInputValue("");
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <Tags className="w-full">
      <TagsTrigger>
        {value.map((id) => (
          <TagsValue key={id} onRemove={() => handleRemove(id)}>
            {id}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput
          className="placeholder:font-light"
          value={inputValue}
          onValueChange={setInputValue}
          placeholder="Type and press Enter..."
        />
        <TagsList>
          <TagsEmpty>
            <button
              type="button"
              onClick={handleCreateTag}
              className="mx-auto flex cursor-pointer items-center gap-2"
            >
              <PlusIcon size={14} className="text-muted-foreground" />
              Create tag: {inputValue}
            </button>
          </TagsEmpty>
          {value.length > 0 && (
            <TagsGroup>
              {value.map((tag) => (
                <TagsItem key={tag} onSelect={handleSelect} value={tag}>
                  {tag}
                  <CheckIcon
                    size={14}
                    className="text-muted-foreground opacity-70"
                  />
                </TagsItem>
              ))}
            </TagsGroup>
          )}
        </TagsList>
      </TagsContent>
    </Tags>
  );
}

type StepDetailsProps = {
  file: File;
  field: { fileName: string; fileId?: string };
  onDelete: () => void;
};

export default function StepDetails({
  file,
  field,
  onDelete,
}: StepDetailsProps) {
  const methods = useFormContext<UploadFormValues>();
  const { clearErrors, trigger } = methods;

  const touchOk = (name: string) => {
    clearErrors(name as any);
    void trigger(name as any);
  };

  const smartFillFromFileName = () => {
    const fileName = field.fileName;
    const courseMatch = fileName.match(/([A-Z]{2,4}\s*\d{3,4}[A-Z]?)/i);
    if (courseMatch && !methods.getValues("courseCode")) {
      const courseCode = courseMatch[1].replace(/\s+/g, "").toUpperCase();
      methods.setValue("courseCode", courseCode, {
        shouldValidate: false,
      });
      methods.clearErrors("courseCode" as any);
      methods.trigger("courseCode" as any);
    }
    if (!methods.getValues("title")) {
      const smartTitle = fileName
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      methods.setValue("title", smartTitle, { shouldValidate: false });
      methods.clearErrors("title" as any);
      methods.trigger("title" as any);
    }
  };

  return (
    <div className="space-y-8">
      <Button size="sm" onClick={smartFillFromFileName}>
        <Sparkles className="w-4 h-4 mr-2" />
        Autofill
      </Button>

      <div className="flex items-center gap-2">
        <File />
        <div>
          <h3 className="text-sm font-medium">{field.fileName}</h3>
          <p className="text-xs text-muted-foreground font-light">
            {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown type"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        <FormField
          control={methods.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel className="flex items-center gap-2">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., CS425 Word Embeddings Notes"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    touchOk("title");
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel className="flex items-center gap-2">
                Course Code
              </FormLabel>
              <FormControl>
                <Input
                  className="placeholder:font-light"
                  placeholder="cs12345"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    touchOk("courseCode");
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="placeholder:font-light"
                  rows={4}
                  placeholder="Topics and concepts covered, or where they are adapted from."
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    touchOk("description");
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel className="flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Tags
              </FormLabel>
              <FormControl>
                <TagInput
                  value={field.value || []}
                  onChange={(tags) => {
                    field.onChange(tags);
                    touchOk("tags");
                  }}
                  maxTags={8}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    touchOk("type");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="cheatsheet">Cheatsheet</SelectItem>
                    <SelectItem value="answerkey">Answer Key</SelectItem>
                    <SelectItem value="knowledge">Knowledge</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="priceCents"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel className="flex items-center gap-2 font-semibold">
                Price (SGD)
              </FormLabel>
              <FormControl>
                <PriceInput field={field} touchOk={touchOk} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
