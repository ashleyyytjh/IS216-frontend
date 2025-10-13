import { useMemo, useState } from "react";
import { useForm, FormProvider, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { uploadSchema, UploadFormValues } from "../components/schema";
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
import { confirmUpload, createNotes } from "@/services/NotesService";
import { toast } from "sonner";
import { useIsSmall } from "@/utils/util";
import { useNavigate } from "react-router-dom";


export default function Upload() {
  const navigate = useNavigate();
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
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fileId: "",
      fileName: "",
      title: "",
      description: "",
      courseCode: "",
      priceCents: 0,
      tags: [],
      type: "notes",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, trigger } = methods;


  const onDrop = (fs: File[]) => {
    if (!fs.length) return;
    const f = fs[0];
    setFile(f);
    methods.setValue("fileName", f.name);
    methods.setValue("fileId", mkId(f));
    methods.setValue("title", f.name.replace(/\.[^.]+$/, ""));
    methods.clearErrors();
  };

  const onDeleteFile = () => {
    setFile(null);
    methods.reset();
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const next = async () => {
    if (step === 1) {
      if (!file) return;
      setStep(2);
    } else if (step === 2) {
      // 🔸 no nested path now
      const ok = await trigger(undefined, { shouldFocus: true });
      if (!ok) {
        const errors = methods.formState.errors;
        const missingFields = Object.keys(errors ?? {});

        console.log("Missing fields:", missingFields);
        console.log(
          "Messages:",
          Object.values(errors ?? {}).map((e) => (e as FieldError)?.message)
        );

        const errorMessages = missingFields.map(
          (f) =>
            `${f.toUpperCase()}: ${(errors as any)?.[f]?.message ?? "Required"}\n`
        );
        for (const err of errorMessages) {
          toast.error("Cannot Proceed", { description: err });
        }
        return;
      }
      setStep(3);
    } else if (step === 3) {
      await handleSubmit(onSubmit)();
      setStep(4)
    }
  };

  const updateState = (stage: UploadStage, extra?: Partial<UploadState>) =>
    setState((prev) => ({ ...prev, stage, ...extra }));

  async function onSubmit(values: UploadFormValues) {
    setStep(4);
    const token = ``;

    const item = values;
    if (!file) return;

    try {
      updateState("pending");

      const res = await createNotes({
        filename: item.fileName,
        description: item.description,
        tags: item.tags ?? [],
        mimeType: file.type || "application/pdf",
        size: file.size,
        price: item.priceCents,
        module: item.courseCode,
        type: item.type ?? "notes",
      });
      console.log("record saved")

      const resp = await fetch(res.url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/pdf",
        },
        body: file,
      });

      if (!resp.ok) {
        toast.error("Error uploading file", { description: resp.statusText });
      }

      updateState("uploaded", { noteId: res.noteId });
      console.log("uploaded")
      const confirmResp = await confirmUpload(res.noteId);
      if (!confirmResp.ok) {
        toast.error("Error recording notes upload status", {
          description: confirmResp.status,
        });
      } else {
        navigate(`/upload/${res.noteId}`, { replace: true })
      }
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
                <div>
                  <StepperNav
                    className={`${
                      isSmall
                        ? "flex-col space-y-8"
                        : "flex-row justify-between items-start"
                    } relative`}
                  >
                    {stepsMeta.map((s, idx) => (
                      <StepperItem
                        key={s.id}
                        step={s.id}
                        className={`relative group/step cursor-pointer ${
                          isSmall
                            ? "flex-row items-center"
                            : "flex-col items-center text-center"
                        } ${isSmall ? "w-full" : "flex-1"}`}
                      >
                        <StepperTrigger
                          className={`flex gap-4 transition-all duration-300 hover:scale-105 ${
                            isSmall
                              ? "flex-row items-center text-left w-full"
                              : "flex-col items-center text-center"
                          }`}
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
                              className={`font-medium text-sm transition-colors ${
                                step === s.id
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
                            field={methods.getValues()}
                            onDelete={onDeleteFile}
                          />
                        )}

                        {s.id === 4 && (
                          <StepFinish
                            state={state}
                            allDone={allDone}
                            onGoToNotes={() =>
                              window.location.assign("/notes")
                            }
                          />
                        )}

                        {s.id === 3 && file && <StepReview file={file} />}
                      </StepperContent>
                    ))}
                  </StepperPanel>
                </div>
              </Stepper>
            </Form>
          </FormProvider>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={prev}
              disabled={step === 1 || step === totalSteps}
            >
              <ChevronLeft /> Previous
            </Button>
            <div className="flex gap-2">
              {step < 4 ? step < 3 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={next}
                  disabled={step === 1 && !file}
                >
                  Next <ChevronRight />
                </Button>
              ) : (
                <Button onClick={next} size="sm">
                  Publish
                </Button>
              ) : <></>}
            </div>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
