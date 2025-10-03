import * as React from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  FileText,
  DollarSign,
  Eye,
  Tag as TagIcon,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Sparkles,
  Trash2,
  Plus,
  X,
  BookOpen,
  Edit3,
  Zap,
  Grid3x3,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { UploadFormValues } from "./schema";
import { centsToDisplay, displayToCents, mkId } from "../components/utils";

/* ---------- Enhanced TagInput with Animations ---------- */
type TagInputProps = {
  value?: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  hasError?: boolean;
};

function TagInput({ value = [], onChange, maxTags = 8, hasError = false }: TagInputProps) {
  const [input, setInput] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  
  const addTokens = (raw: string) => {
    const tokens = raw.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
    if (!tokens.length) return;
    const next = [...value];
    for (const t of tokens) {
      if (next.length >= maxTags) break;
      if (!next.includes(t)) next.push(t);
    }
    onChange(next);
  };
  
  const addFromInput = () => { 
    if (input.trim()) { 
      addTokens(input); 
      setInput(""); 
    } 
  };
  
  const removeTag = (t: string) => onChange((value ?? []).filter((x) => x !== t));
  
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const k = e.key;
    if (k === "Enter" || k === "," || k === "Tab" || k === " ") { 
      e.preventDefault(); 
      addFromInput(); 
      return; 
    }
    if (k === "Backspace" && input === "" && value.length) { 
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

  return (
    <div className={cn(
      "flex flex-wrap items-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-300",
      "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50",
      "focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20",
      "focus-within:from-blue-50 focus-within:to-indigo-50",
      hasError && "border-red-500 from-red-50 to-pink-50",
      isFocused && "scale-[1.02] transform"
    )}>
      <div className="flex flex-wrap items-center gap-2">
        {value.map((t, idx) => (
          <Badge 
            key={t} 
            variant="secondary" 
            className={`
              flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 
              text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300
              animate-in slide-in-from-left-2 fade-in-0
              hover:scale-110 transform cursor-default shadow-sm
            `}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="text-sm font-medium">{t}</span>
            <button 
              type="button" 
              onClick={() => removeTag(t)} 
              className="leading-none opacity-80 hover:opacity-100 transition-opacity p-0.5 rounded-sm hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <input
          className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-500 min-w-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => {
            addFromInput();
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={value.length === 0 ? "Add tags (comma/space/enter)..." : "Add more..."}
          aria-invalid={hasError || undefined}
          maxLength={50}
        />
        
        {input && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addFromInput}
            className="h-6 w-6 p-0 hover:bg-blue-500 hover:text-white transition-all duration-200"
          >
            <Plus className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="text-xs text-gray-500 ml-auto">
        {value.length}/{maxTags}
      </div>
    </div>
  );
}

/* ---------- Enhanced Bulk Actions Panel ---------- */
type BulkActionsPanelProps = {
  fields: { id: string; fileName: string }[];
  methods: UseFormReturn<UploadFormValues>;
};

function BulkActionsPanel({ fields, methods }: BulkActionsPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const toggleSelectAll = () => {
    if (selected.size === fields.length) setSelected(new Set());
    else setSelected(new Set(fields.map((_, i) => i)));
  };

  const applyBulkValue = (field: "visibility", value: string) => {
    selected.forEach((idx) => {
      methods.setValue(`items.${idx}.${field}`, value as any, { shouldValidate: false });
      methods.clearErrors(`items.${idx}.${field}` as any);
      methods.trigger(`items.${idx}.${field}` as any);
    });
  };

  const smartFillFromFileName = () => {
    selected.forEach((idx) => {
      const fileName = fields[idx].fileName;

      const courseMatch = fileName.match(/([A-Z]{2,4}\s*\d{3,4}[A-Z]?)/i);
      if (courseMatch && !methods.getValues(`items.${idx}.courseCode`)) {
        methods.setValue(`items.${idx}.courseCode`, courseMatch[1].replace(/\s+/g, "").toUpperCase(), { shouldValidate: false });
        methods.clearErrors(`items.${idx}.courseCode` as any);
        methods.trigger(`items.${idx}.courseCode` as any);
      }

      if (!methods.getValues(`items.${idx}.title`)) {
        const smartTitle = fileName
          .replace(/\.[^.]+$/, "")
          .replace(/[_-]/g, " ")
          .split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        methods.setValue(`items.${idx}.title`, smartTitle, { shouldValidate: false });
        methods.clearErrors(`items.${idx}.title` as any);
        methods.trigger(`items.${idx}.title` as any);
      }
    });
  };

  return (
    <Card className={`
      mb-8 border-2 border-dashed border-indigo-200 transition-all duration-300
      hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10
      ${isOpen ? 'shadow-xl shadow-indigo-500/20 border-indigo-400' : ''}
    `}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className={`
            cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50
            ${isOpen ? 'bg-gradient-to-r from-indigo-50 to-purple-50' : ''}
          `}>
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bulk Actions & Smart Tools
                </span>
              </div>
              <div className={`
                transition-transform duration-300 p-1 rounded-lg hover:bg-white/50
                ${isOpen ? 'rotate-180 bg-white/30' : ''}
              `}>
                <ChevronDown className="w-5 h-5 text-indigo-600" />
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={toggleSelectAll}
                className="hover:scale-105 transition-all duration-200 border-2"
              >
                {selected.size === fields.length ? 
                  <CheckSquare className="w-4 h-4 mr-2 text-green-600" /> : 
                  <Square className="w-4 h-4 mr-2" />
                }
                {selected.size === fields.length ? "Deselect All" : "Select All"}
              </Button>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {selected.size} selected
                </Badge>
                <span className="text-sm text-gray-600">of {fields.length} files</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-40 overflow-y-auto p-4 bg-white rounded-xl border-2 border-gray-100">
              {fields.map((f, i) => (
                <label key={f.id} className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105
                  ${selected.has(i) ? 'bg-gradient-to-r from-blue-100 to-indigo-100 shadow-sm' : 'hover:shadow-md'}
                `}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selected.has(i)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) next.add(i); else next.delete(i);
                      setSelected(next);
                    }}
                  />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm truncate font-medium" title={f.fileName}>
                      {f.fileName}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Apply Visibility
                </label>
                <Select onValueChange={(v) => applyBulkValue("visibility", v)}>
                  <SelectTrigger className="h-14 border-2 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="unlisted">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Unlisted
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 flex justify-end items-center ">
                <Button 
                  type="button" 
                  onClick={smartFillFromFileName} 
                  className={`
                    h-14 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600
                    w-fit
                    transition-all duration-300 hover:scale-105 hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  disabled={selected.size === 0}
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Smart Fill from Filenames
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

/* ---------- Enhanced FormField Component ---------- */
type EnhancedFormFieldProps = {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
};

function EnhancedFormField({ label, icon, required, children, error, className }: EnhancedFormFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {children}
        {error && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1 animate-in slide-in-from-top-1">
            <X className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Main Enhanced Component ---------- */
type StepDetailsProps = {
  files: File[];
  fields: { id: string; fileName: string; fileId?: string }[];
  onDeleteItem: (index: number) => void;
};

export default function StepDetails({ files, fields, onDeleteItem }: StepDetailsProps) {
  const methods = useFormContext<UploadFormValues>();
  const { clearErrors, trigger } = methods;

  const touchOk = (name: string) => {
    clearErrors(name as any);
    void trigger(name as any);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-6 shadow-lg">
          <Edit3 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          Complete File Details
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Add the finishing touches to make your notes discoverable and appealing to buyers.
        </p>
      </div>

      <BulkActionsPanel fields={fields as any} methods={methods} />

      {/* Files Grid */}
      <section className="space-y-6">
        {fields.map((f, idx) => {
          const fileId = (f as any).fileId ?? methods.getValues(`items.${idx}.fileId`);
          const file = files.find((x) => mkId(x) === fileId);

          return (
            <Card 
              key={f.id} 
              className={`
                overflow-hidden transition-all duration-300 border-2 hover:border-blue-300
                hover:shadow-xl hover:shadow-blue-500/10 animate-in slide-in-from-bottom-4
                bg-gradient-to-br from-white to-gray-50
              `}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Collapsible defaultOpen>
                <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          {f.fileName}
                        </CardTitle>
                        {file && (
                          <p className="text-sm text-gray-500 mt-1">
                            {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-10 px-4 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                        >
                          <ChevronUp className="w-4 h-4 data-[state=closed]:hidden transition-transform" />
                          <ChevronDown className="w-4 h-4 hidden data-[state=closed]:block transition-transform" />
                        </Button>
                      </CollapsibleTrigger>

                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          onDeleteItem(idx); 
                        }}
                        title="Remove this file"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
                  <CardContent className="p-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <FormField
                          control={methods.control}
                          name={`items.${idx}.title`}
                          render={({ field, fieldState }) => (
                            <EnhancedFormField
                              label="Title"
                              icon={<BookOpen className="w-4 h-4 text-blue-500" />}
                              required
                              error={fieldState.error?.message}
                            >
                              <Input
                                placeholder="e.g., CS425 Word Embeddings Notes"
                                {...field}
                                onChange={(e) => { field.onChange(e); touchOk(`items.${idx}.title`); }}
                                className="h-14 border-2 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 bg-white"
                                aria-invalid={!!fieldState.error || undefined}
                              />
                            </EnhancedFormField>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name={`items.${idx}.courseCode`}
                          render={({ field, fieldState }) => (
                            <EnhancedFormField
                              label="Course Code"
                              icon={<Grid3x3 className="w-4 h-4 text-green-500" />}
                              required
                              error={fieldState.error?.message}
                            >
                              <Input
                                placeholder="e.g., CS425"
                                {...field}
                                onChange={(e) => { field.onChange(e); touchOk(`items.${idx}.courseCode`); }}
                                className="h-14 border-2 hover:border-green-400 focus:border-green-500 transition-all duration-200 bg-white"
                                aria-invalid={!!fieldState.error || undefined}
                              />
                            </EnhancedFormField>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={methods.control}
                            name={`items.${idx}.priceCents`}
                            render={({ field, fieldState }) => (
                              <EnhancedFormField
                                label="Price (SGD)"
                                icon={<DollarSign className="w-4 h-4 text-yellow-500" />}
                                required
                                error={fieldState.error?.message}
                              >
                                <Input
                                  inputMode="decimal"
                                  placeholder="0.00"
                                  value={centsToDisplay(field.value ?? 0)}
                                  onChange={(e) => { field.onChange(displayToCents(e.target.value)); touchOk(`items.${idx}.priceCents`); }}
                                  className="h-14 border-2 hover:border-yellow-400 focus:border-yellow-500 transition-all duration-200 bg-white"
                                  aria-invalid={!!fieldState.error || undefined}
                                />
                              </EnhancedFormField>
                            )}
                          />

                          <FormField
                            control={methods.control}
                            name={`items.${idx}.visibility`}
                            render={({ field }) => (
                              <EnhancedFormField
                                label="Visibility"
                                icon={<Eye className="w-4 h-4 text-purple-500" />}
                              >
                                <Select
                                  onValueChange={(v) => { field.onChange(v); touchOk(`items.${idx}.visibility`); }}
                                  value={field.value}
                                  defaultValue="public"
                                >
                                  <SelectTrigger className="h-14 border-2 hover:border-purple-400 focus:border-purple-500 transition-all duration-200 bg-white">
                                    <SelectValue placeholder="Choose visibility" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="public">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                        Public
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="unlisted">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                        Unlisted
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </EnhancedFormField>
                            )}
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <FormField
                          control={methods.control}
                          name={`items.${idx}.description`}
                          render={({ field, fieldState }) => (
                            <EnhancedFormField
                              label="Description"
                              icon={<FileText className="w-4 h-4 text-indigo-500" />}
                              required
                              error={fieldState.error?.message}
                            >
                              <Textarea
                                rows={4}
                                placeholder="What does this cover? Any disclaimers or special notes?"
                                {...field}
                                onChange={(e) => { field.onChange(e); touchOk(`items.${idx}.description`); }}
                                className="min-h-[112px] border-2 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-200 bg-white resize-none"
                                aria-invalid={!!fieldState.error || undefined}
                              />
                            </EnhancedFormField>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name={`items.${idx}.tags`}
                          render={({ field, fieldState }) => (
                            <EnhancedFormField
                              label="Tags"
                              icon={<TagIcon className="w-4 h-4 text-pink-500" />}
                              error={fieldState.error?.message}
                            >
                              <TagInput
                                value={field.value}
                                onChange={(tags) => { field.onChange(tags); touchOk(`items.${idx}.tags`); }}
                                maxTags={8}
                                hasError={!!fieldState.error}
                              />
                            </EnhancedFormField>
                          )}
                        />

                          <FormField
  control={methods.control}
  name={`items.${idx}.type`}
  render={({ field, fieldState }) => (
    <EnhancedFormField
      label="Type"
      icon={<Edit3 className="w-4 h-4 text-purple-500" />}
      required
      error={fieldState.error?.message}
      className="mt-[-4px]" // optional spacing tweak
    >
      <Select
        value={field.value}
        onValueChange={(v) => { field.onChange(v); touchOk(`items.${idx}.type`); }}
      >
        <FormControl>
          <SelectTrigger className="h-14 border-2 hover:border-purple-400 focus:border-purple-500 transition-all duration-200 bg-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="notes">Notes</SelectItem>
          <SelectItem value="cheatsheet">Cheatsheet</SelectItem>
          <SelectItem value="answerkey">Answer Key</SelectItem>
          <SelectItem value="knowledge">Knowledge</SelectItem>
        </SelectContent>
      </Select>
    </EnhancedFormField>
  )}
/>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </section>
    </div>
  );
}