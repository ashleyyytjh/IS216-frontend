import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { centsToDisplay } from "../components/utils";
import { useFormContext } from "react-hook-form";

interface StepReviewProps {
  files: File[];
}

export default function StepReview({ files }: StepReviewProps) {
  const { watch } = useFormContext();
  const items = watch("items");

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Review & confirm</h2>
      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <Card key={item.fileId}>
            <CardHeader>
              <CardTitle className="truncate">
                {item.title}{" "}
                <span className="text-muted-foreground">
                  ({files[i]?.name || item.fileName})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-6 text-sm">
              <div>
                <span className="font-medium">Course:</span> {item.courseCode}
              </div>
          
              <div>
                <span className="font-medium">Price:</span> $
                {centsToDisplay(item.priceCents)}
              </div>
              <div className="truncate">
                <span className="font-medium">Visibility:</span>{" "}
                {item.visibility}
              </div>
              <div className="truncate">
                <span className="font-medium">Tags:</span>{" "}
                {item.tags?.join(", ") || "—"}
              </div>
              <Separator className="my-2" />
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
