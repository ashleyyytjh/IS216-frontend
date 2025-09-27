// Upload.tsx
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
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
import { ChevronLeft, ChevronRight, Check, LoaderCircleIcon } from "lucide-react";

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

/* ------------------------------ Types/Consts ----------------------------- */
type ItemsField = { id: string; fileName: string; fileId?: string };

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
  const [step, setStep] = useState(1); // 1..4
  const [files, setFiles] = useState<File[]>([]);
  const [states, setStates] = useState<Record<string, UploadState>>({});
  const totalSteps = 4;
  const isSmall = useIsSmall();







  const stepsMeta = useMemo(
    () => [
      { id: 1, title: "Upload",  description: "Choose your files to upload" },
      { id: 2, title: "Details", description: "Fill in module, price, tags & type" },
      { id: 3, title: "Review",  description: "Check everything before publishing" },
      { id: 4, title: "Publish", description: "We'll upload & confirm your notes" },
    ],
    []
  );

  const methods = useForm<UploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { items: [] },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { control, handleSubmit, trigger, setFocus, formState } = methods;
  const { fields, replace, remove } = useFieldArray({ control, name: "items" });

  // sync files → form items & states
  useEffect(() => {
    const wanted = files.map((f) => ({
      fileId: mkId(f),
      fileName: f.name,
      title: f.name.replace(/\.[^.]+$/, ""),
      description: "",
      courseCode: "",
      priceCents: 0,
      visibility: "public" as const,
      tags: [],
      type: "notes" as const,
    }));
    replace(wanted);

    setStates((prev) => {
      const next: Record<string, UploadState> = {};
      for (const f of files) next[mkId(f)] = prev[mkId(f)] ?? { stage: "pending" };
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.map(mkId).join("|")]);

  const onDrop = (fs: File[]) => setFiles(fs);
  const onDeleteItem = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    remove(index);
  };

  const focusFirstError = () => {
    const errs = formState.errors?.items;
    if (!errs || !Array.isArray(errs)) return;
    for (let i = 0; i < errs.length; i++) {
      const itemErr = errs[i] as any;
      if (itemErr) {
        for (const key of ["title", "courseCode", "priceCents", "description", "tags", "type"]) {
          if (itemErr[key]) {
            setFocus(`items.${i}.${key}` as any, { shouldSelect: true });
            return;
          }
        }
      }
    }
  };

  // scroll to top on step change
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    return () => cancelAnimationFrame(id);
  }, [step]);

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const next = async () => {
    if (step === 1) {
      if (files.length < 1) return; // block if no files
      setStep(2);
    } else if (step === 2) {
      const ok = await trigger("items", { shouldFocus: true }); // validate Details
      if (!ok) return focusFirstError();
      setStep(3);
    } else if (step === 3) {
      await handleSubmit(onSubmit)(); // move to Publish & start uploads
    }
  };

  const updateState = (fileId: string, stage: UploadStage, extra?: Partial<UploadState>) =>
    setStates((prev) => ({
      ...prev,
      [fileId]: { ...(prev[fileId] ?? {}), stage, ...extra },
    }));

  async function onSubmit(values: UploadFormValues) {
    setStep(4);

    
  const token = `eyJraWQiOiJDNUR0YmVob2ZvNVUyTWJhWUI3UzdnN0RoSE1wRGxXSk1qWldBMUlhQm9JPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1OTRhMzUyYy0yMDgxLTcwNmUtYjY3OS0wMGI5MzZlNmI4ZjkiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfQmhIRUFNTDAyIiwiY2xpZW50X2lkIjoiNGFuYWkxNDVia2xjNHMxaW8wYjQ2cmpjdDEiLCJvcmlnaW5fanRpIjoiNjc0ZjQzYjAtNjQzNC00NzhhLWJmOTYtNzdhZGRlNDA5YjMzIiwiZXZlbnRfaWQiOiI2YWY1ZDFiNS0wZmYzLTRlZTUtOTljZi00YzRjNTVkZjU1YjMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU4OTY3NTQ5LCJleHAiOjE3NTg5NzExNDksImlhdCI6MTc1ODk2NzU0OSwianRpIjoiY2M4OGY0ZGItNWRiZi00MTA3LWJhZjUtOTRiZGM2ZjYyZmMzIiwidXNlcm5hbWUiOiJvd2pvZWwifQ.z3z7qtzA6vBlzVRHEclYsR5CrB3_0vvfOt1aq2112wN4Z_NGod_UeFD8lFzi7C0m9TG0ufLb_ABm83f5RCG8TNvua8nUIURp9yWFVpUvidpzOBSdI5sGvI-YfgFV45sY2US5k9kveW3mbpajb8oQboB0VQfWiLXMd65583-lNS3e8LmAc9awyHW9L2JABifRUE1HSnqDORp1lA-jbjHg3qaNFHrk4x6UA4fSNDKFj4jC_UHbYxq-pKu55GI4-APBhHd8fySivw6GdmOusHuJTHMCfjE44IA4VmU3eSquZbctrkn_AMMFG5HutpBZ1D57YffIc42eNaJtktlyQaFXZg`;

    const fileById = new Map(files.map((f) => [mkId(f), f]));
    const getStage = (id: string): UploadStage =>
      (states[id]?.stage as UploadStage) ?? "pending";

    for (const it of values.items) {
      const file = fileById.get(it.fileId!);
      if (!file) {
        updateState(it.fileId!, getStage(it.fileId!), { error: "File missing" });
        continue;
      }

      try {
        // 1) mark as pending (creating note)
        updateState(it.fileId!, "pending");

        // 2) Create note (get presigned URL)
        const res = await createNotes(API_BASE, token, {
          filename: it.fileName,
          description: it.description,
          tags: it.tags ?? [],
          mimeType: file.type || "application/pdf",
          size: file.size,
          price: it.priceCents,
          module: it.courseCode,
          type: it.type ?? "notes",
        });

        // 3) Upload to storage
        await putToPresignedUrl(res.url, file);
        updateState(it.fileId!, "uploaded", { noteId: res.noteId });

        // 4) Confirm upload on backend (backend sets status 'uploaded')
        console.log(res.noteId)
        await confirmUpload(API_BASE, token, res.noteId);

        // 5) (Optional) Poll until backend pipeline marks it 'done'
        await pollNoteUntilDone(
          API_BASE,
          res.noteId,
          (status) => {
            if (status === "done") updateState(it.fileId!, "done");
          },
          { token }
        );
      } catch (err: any) {
        updateState(it.fileId!, getStage(it.fileId!), {
          error: err?.message || "Upload failed",
        });
      }
    }
  }

  const allDone =
    files.length > 0 && files.every((f) => states[mkId(f)]?.stage === "done");
  const isPublishing = step === 4 && !allDone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-grey-100 to-gray-600 bg-clip-text text-transparent mb-4">
            Upload Your Notes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your knowledge with fellow students and earn money from your hard work
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <FormProvider {...methods}>
            <Form {...methods}>
              <Stepper
                value={step}
                onValueChange={(v) => { if (v < step) setStep(v); }}
                orientation={isSmall ? "vertical" : "horizontal"}
                className="w-full"
                indicators={{
                  completed: <Check className="size-4" />,
                  loading: <LoaderCircleIcon className="size-4 animate-spin" />,
                }}
              >
                {/* Stepper Navigation */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-10 border-b border-gray-100">
                  <StepperNav className={`${isSmall ? 'flex-col space-y-8' : 'flex-row justify-between items-start'} relative`}>
                    {stepsMeta.map((s, idx) => (
                      <StepperItem
                        key={s.id}
                        step={s.id}
                        loading={s.id === 4 && isPublishing}
                        className={`relative group/step cursor-pointer ${isSmall ? 'flex-row items-center' : 'flex-col items-center text-center'} ${isSmall ? 'w-full' : 'flex-1'}`}
                      >
                        <StepperTrigger className={`flex gap-4 transition-all duration-300 hover:scale-105 ${isSmall ? 'flex-row items-center text-left w-full' : 'flex-col items-center text-center'}`}>
                          <div className="relative">
                            <StepperIndicator className={`size-12 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-lg
                              data-[state=completed]:bg-gradient-to-r data-[state=completed]:from-green-500 data-[state=completed]:to-emerald-500 data-[state=completed]:text-white data-[state=completed]:shadow-green-200
                              data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-blue-200
                              data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-300 ${isSmall ? 'flex-shrink-0' : ''}`}>
                              {s.id}
                            </StepperIndicator>
                            {step === s.id && (
                              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                            )}
                          </div>

                          <div className={`transition-all duration-300 ${isSmall ? 'flex-1 min-w-0' : 'mt-4'}`}>
                            <StepperTitle className={`font-bold text-lg mb-2 transition-colors ${step === s.id ? 'text-blue-600' : step > s.id ? 'text-green-600' : 'text-gray-700'}`}>
                              {s.title}
                            </StepperTitle>
                            <StepperDescription className={`text-sm leading-relaxed transition-colors ${step === s.id ? 'text-blue-500' : step > s.id ? 'text-green-500' : 'text-gray-500'} ${isSmall ? '' : 'max-w-32'}`}>
                              {s.description}
                            </StepperDescription>
                          </div>
                        </StepperTrigger>

                        {/* Connector */}
                        {idx < stepsMeta.length - 1 && !isSmall && (
                          <StepperSeparator className={`absolute top-6 left-[calc(50%+1.5rem)] right-0 h-1 rounded-full transition-all duration-500 ease-in-out transform origin-left w-3/4
                            ${step > s.id ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-sm' : step === s.id ? 'bg-gradient-to-r from-blue-400 to-blue-200' : 'bg-gray-200'}
                            ${step > s.id ? 'scale-y-150' : ''}`} />
                        )}
                        {idx < stepsMeta.length - 1 && isSmall && (
                          <div className={`absolute left-6 top-16 bottom-0 w-1 rounded-full transition-all duration-500
                            ${step > s.id ? 'bg-gradient-to-b from-green-400 to-emerald-400' : step === s.id ? 'bg-gradient-to-b from-blue-400 to-blue-200' : 'bg-gray-200'} -translate-y-4`} />
                        )}
                      </StepperItem>
                    ))}
                  </StepperNav>
                </div>

                {/* Content Area */}
                <div className="px-8 py-10">
                  <StepperPanel className="text-sm">
                    {stepsMeta.map((s) => (
                      <StepperContent key={s.id} value={s.id} className="space-y-6 animate-in fade-in-50 duration-300">
                        {s.id === 1 && (
                          <StepUpload files={files} onDrop={onDrop} onDelete={onDeleteItem} />
                        )}
                        {s.id === 2 && (
                          <StepDetails
                            files={files}
                            fields={fields as ItemsField[]}
                            onDeleteItem={onDeleteItem}
                          />
                        )}
                        {s.id === 3 && <StepReview files={files} />}
                        {s.id === 4 && (
                          <StepFinish
                            files={files}
                            states={Object.fromEntries(files.map((f) => [mkId(f), states[mkId(f)]]))}
                            allDone={allDone}
                            onGoToNotes={() => window.location.assign("/notes")}
                          />
                        )}
                      </StepperContent>
                    ))}
                  </StepperPanel>
                </div>

                {/* Controls */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={prev}
                        disabled={step === 1 || step === totalSteps}
                        className="px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-gray-300 hover:border-gray-400"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>

                      {step < 3 && (
                        <Button
                          type="button"
                          onClick={next}
                          disabled={step === 1 && files.length < 1}
                          className="px-8 py-3 font-medium transition-all duration-200 bg-gradient-to-r bg-black hover:to-indigo-600 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                        >
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}

                      {step === 3 && (
                        <Button
                          type="button"
                          onClick={next}
                          className="px-8 py-3 font-medium transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-lg shadow-md"
                        >
                          Publish Notes
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </Stepper>
            </Form>
          </FormProvider>
        </div>

        {/* Progress indicator at bottom */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of {totalSteps}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i + 1 <= step ? 'bg-blue-500' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
