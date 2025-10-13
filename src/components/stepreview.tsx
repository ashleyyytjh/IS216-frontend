import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { centsToDisplay } from "../components/utils";
import { useFormContext } from "react-hook-form";
import { UploadFormValues } from "./schema";
import { priceOrFree } from "@/utils/currency";

interface StepReviewProps {
  file: File;
}

export default function StepReview({ file }: StepReviewProps) {
  const { watch } = useFormContext<UploadFormValues>();
  const item = watch();

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-12 gap-4 [&>div]:col-span-full [&>div]:md:col-span-6 [&_h5]:font-medium [&_span]:text-muted-foreground">
        <div>
          <h5>Title</h5>
          <span>{item.title}</span>
        </div>
        <div>
          <h5>Course:</h5>
          <span>{item.courseCode || "None"}</span>
        </div>
        <Separator className="!col-span-full" />
        <div className="!col-span-full min-h-32">
          <h5>Description</h5>
          <span>{item.description}</span>
        </div>
        <Separator className="!col-span-full" />
        <div>
          <h5>Tags:</h5>{" "}
          <span>{item.tags?.join(", ") || "—"}</span>
        </div>
        <div>
          <h5>Type</h5>
          <span className="capitalize">{item.type}</span>
        </div>
        <div>
          <h5>Price:</h5>
          <span>{priceOrFree(item.priceCents)}</span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Attachment:</span>
          <span>{file.name}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown type"}
        </div>
      </div>
    </section>
  );
}
