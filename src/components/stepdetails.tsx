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

  return (
    <section className="space-y-6">
      {fields.map((field, idx) => (
        <Card key={field.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="truncate">{field.fileName}</CardTitle>
          </CardHeader>
          <Separator />

          {/* items-start prevents alignment wobble across rows */}
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
                    <Input
                      placeholder="comma,separated,tags"
                      value={field.value.join(",")}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                  </FormControl>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {field.value.map((t, i) => (
                      <Badge key={`${t}-${i}`} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
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