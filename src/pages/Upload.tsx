import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNotes,
  confirmUpload,
  putToPresignedUrl,
  pollNoteUntilDone,
} from "@/lib/notesApi";
import { fetchAuthSession } from "aws-amplify/auth";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  LoaderCircleIcon,
} from "lucide-react";

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

import { formSchema, UploadFormValues } from "../components/schema";
import { mkId } from "../components/utils";

import StepUpload from "../components/stepupload";
import StepDetails from "../components/stepdetails";
import StepReview from "../components/stepreview";
import StepFinish, { UploadState, UploadStage } from "../components/stepfinish";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

/* ------------------------------ Consts ----------------------------- */
const API_BASE = "http://localhost:8080";

/* ------------------------------ Hooks ----------------------------------- */
function useIsSmall() {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isSmall;
}

/* ------------------------------ Component ------------------------------- */
export default function Upload() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>({ stage: "pending" });

  const totalSteps = 4;
  const isSmall = useIsSmall();

  const stepsMeta = useMemo(
    () => [
      { id: 1, title: "Document", description: "Select file" },
      {
        id: 2,
        title: "Details",
        description: "Extra information",
      },
      {
        id: 3,
        title: "Review",
        description: "Final Checks",
      },
      {
        id: 4,
        title: "Publish",
        description: "",
      },
    ],
    []
  );

  const methods = useForm<UploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [
        {
          fileId: "",
          fileName: "",
          title: "",
          description: "",
          courseCode: "",
          priceCents: 0,
          visibility: "public",
          tags: [],
          type: "notes",
        },
      ],
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, trigger, setFocus, formState } = methods;

  // --- handle file change
  const onDrop = (fs: File[]) => {
    if (!fs.length) return;
    const f = fs[0];
    setFile(f);

    methods.setValue("items.0.fileName", f.name);
    methods.setValue("items.0.fileId", mkId(f));
    methods.setValue("items.0.title", f.name.replace(/\.[^.]+$/, ""));
    methods.clearErrors();
  };

  const onDeleteFile = () => {
    setFile(null);
    methods.resetField("items.0");
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const next = async () => {
    if (step === 1) {
      if (!file) return;
      setStep(2);
    } else if (step === 2) {
      const ok = await trigger("items.0", { shouldFocus: true });
      if (!ok) return;
      setStep(3);
    } else if (step === 3) {
      await handleSubmit(onSubmit)();
    }
  };

  const updateState = (stage: UploadStage, extra?: Partial<UploadState>) =>
    setState((prev) => ({ ...prev, stage, ...extra }));

  async function onSubmit(values: UploadFormValues) {
    setStep(4);
    const token = ``;

    const item = values.items[0];
    if (!file) return;

    try {
      updateState("pending");

      const res = await createNotes(API_BASE, token, {
        filename: item.fileName,
        description: item.description,
        tags: item.tags ?? [],
        mimeType: file.type || "application/pdf",
        size: file.size,
        price: item.priceCents,
        module: item.courseCode,
        type: item.type ?? "notes",
      });

      await putToPresignedUrl(res.url, file);
      updateState("uploaded", { noteId: res.noteId });

      await confirmUpload(API_BASE, token, res.noteId);
      await pollNoteUntilDone(
        API_BASE,
        res.noteId,
        (status) => {
          if (status === "done") updateState("done");
        },
        { token }
      );
    } catch (err: any) {
      updateState("pending", { error: err?.message || "Upload failed" });
    }
  }

  const allDone = state.stage === "done";
  const isPublishing = step === 4 && !allDone;

  return (
    <main className="min-h-screen py-5 container w-[80%] ml-auto mr-auto">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Upload Notes</CardTitle>
          <CardDescription className="font-light">
            Complete the steps below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FormProvider {...methods}>
            <Form {...methods}>
              <Stepper
                value={step}
                onValueChange={(v) => v < step && setStep(v)}
                orientation={isSmall ? "vertical" : "horizontal"}
                className="w-full"
                indicators={{
                  completed: <Check className="size-4" />,
                  loading: <LoaderCircleIcon className="size-4 animate-spin" />,
                }}
              >
                {/* Stepper Nav */}
                <div>
                  <StepperNav
                    className={`${isSmall ? "flex-col space-y-8" : "flex-row justify-between items-start"} relative`}
                  >
                    {stepsMeta.map((s, idx) => (
                      <StepperItem
                        key={s.id}
                        step={s.id}
                        loading={s.id === 4 && isPublishing}
                        className={`relative group/step cursor-pointer ${isSmall ? "flex-row items-center" : "flex-col items-center text-center"} ${isSmall ? "w-full" : "flex-1"}`}
                      >
                        <StepperTrigger
                          className={`flex gap-4 transition-all duration-300 hover:scale-105 ${isSmall ? "flex-row items-center text-left w-full" : "flex-col items-center text-center"}`}
                        >
                          <div className="relative">
                            <StepperIndicator
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center text-sm justify-center rounded-full border-2 font-medium transition-colors duration-300",
                                "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
                                "data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary",
                                "data-[state=inactive]:border-muted-foreground/30 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground",
                                isSmall && "flex-shrink-0"
                              )}
                            >
                              {s.id}
                            </StepperIndicator>
                          </div>

                          <div className={`transition-all duration-300`}>
                            <StepperTitle
                              className={`font-medium text-sm transition-colors ${step === s.id
                                  ? "text-black"
                                  : "text-muted-foreground"
                                }`}
                            >
                              {s.title}
                            </StepperTitle>
                            <StepperDescription
                              className={cn(
                                "text-xs font-light transition-colors text-muted-foreground",
                                `${isSmall ? "" : "max-w-32"}`
                              )}
                            >
                              {s.description}
                            </StepperDescription>
                          </div>
                        </StepperTrigger>

                        {idx < stepsMeta.length - 1 && !isSmall && (
                          <StepperSeparator
                            className={cn(
                              "absolute top-6 left-[calc(50%+1.5rem)] right-0 h-1 rounded-full transition-all duration-500 ease-in-out transform origin-left w-3/4",
                              `${step > s.id ? "bg-black" : "bg-muted"}`
                            )}
                          />
                        )}
                      </StepperItem>
                    ))}
                  </StepperNav>
                </div>

                {/* Stepper Content */}
                <div className="py-10">
                  <StepperPanel className="text-sm">
                    {stepsMeta.map((s) => (
                      <StepperContent
                        key={s.id}
                        value={s.id}
                        className="space-y-6 animate-in fade-in-50 duration-300 border rounded-lg bg-card p-5"
                      >
                        <h2 className="text-lg font-medium">
                          {stepsMeta[step - 1].title}
                        </h2>

                        {s.id === 1 && (
                          <StepUpload
                            file={file}
                            onDrop={onDrop}
                            onDelete={onDeleteFile}
                          />
                        )}

                        {s.id === 2 && file && (
                          <StepDetails
                            file={file}
                            field={methods.getValues("items.0")}
                            onDelete={onDeleteFile}
                          />
                        )}

                        {s.id === 3 && file && <StepReview files={[file]} />}
                      </StepperContent>
                    ))}
                  </StepperPanel>
                </div>
              </Stepper>
            </Form>
          </FormProvider>
        </CardContent>
<CardFooter className="border-t pt-4">
  <div className="w-full flex flex-col gap-3 xs:flex-col sm:flex-row sm:justify-between sm:items-center">
    <Button
      size="sm"
      variant="outline"
      type="button"
      onClick={prev}
      disabled={step === 1 || step === totalSteps}
      className="w-full sm:w-auto"
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      Previous
    </Button>

    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={next}
        disabled={step === 1 && !file}
        className="w-full sm:w-auto"
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>

      <Button
        onClick={next}
        disabled={step !== 3}
        size="sm"
        className="w-full sm:w-auto  text-white hover:bg-green-700"
      >
        Publish
      </Button>
    </div>
  </div>
</CardFooter>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-md text-muted-foreground mb-2">
          Prefer to write your notes manually?
        </p>
        <Link
          to="/writeNotes"
          className="inline-flex items-center justify-center gap-2 text-md font-medium text-gray-600 hover:text-gray-700 hover:underline transition-colors"
        >
          ✍️ Write a note instead
        </Link>
      </div>
    </main>
  );
}
