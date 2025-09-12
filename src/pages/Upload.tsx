import * as React from "react";
import { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { formSchema, UploadFormValues } from "../components/schema";
import { mkId } from "../components/utils";

import StepUpload from "../components/stepupload";
import StepDetails from "../components/stepdetails";
import StepReview from "../components/stepreview";
import StepFinish from "../components/stepfinish";

export default function Upload() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const totalSteps = 4; // 1 Upload, 2 Details, 3 Review, 4 Finish

  const methods = useForm<UploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [] },
    mode: "onChange",
  });

  const { control, handleSubmit, trigger } = methods;
  const { replace, remove } = useFieldArray({ control, name: "items" });

  // Sync file list → form items (metadata)
  useEffect(() => {
    const wanted = files.map((f) => ({
      fileId: mkId(f),
      fileName: f.name,
      title: f.name.replace(/\.[^.]+$/, ""),
      description: "",
      faculty: "",
      courseCode: "",
      priceCents: 0,
      visibility: "public" as const,
      tags: [],
    }));
    replace(wanted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.map(mkId).join("|")]);

  const progress = (step / totalSteps) * 100;

  const onDrop = (fs: File[]) => setFiles(fs);
  const onDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    remove(index);
  };

  const next = async () => {
    if (step === 1) {
      if (files.length < 1) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      const ok = await trigger("items");
      if (!ok) return;
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
    }
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  async function onSubmit(values: UploadFormValues) {
    const payload = {
      items: values.items.map(({ fileId, fileName, ...rest }) => ({
        fileId,
        fileName,
        ...rest,
      })),
    };
    console.log("SUBMIT payload", payload);
    console.log("FILES", files);
    // TODO integrate with your backend
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {step} of {totalSteps}
          </span>
          <span className="text-muted-foreground">
            {["Upload files", "Details", "Review", "Finish"][step - 1]}
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>

      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <StepUpload files={files} onDrop={onDrop} onDelete={onDeleteFile} />
            )}
            {step === 2 && <StepDetails />}
            {step === 3 && <StepReview files={files} />}
            {step === 4 && <StepFinish />}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={prev}
                disabled={step === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>

              {step < totalSteps && (
                <Button
                  type="button"
                  onClick={next}
                  disabled={step === 1 && files.length < 1}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}

              {step === totalSteps && (
                <Button type="submit">Submit & Publish</Button>
              )}
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
