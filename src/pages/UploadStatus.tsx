import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUploadStatus } from "@/services/NotesService";
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
import { Check, LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsSmall } from "@/utils/util";
import { Card } from "@/components/ui/card";
import Error from "./ErrorPage";
import { Button } from "@/components/ui/button";

type UploadStage = "uploading" | "processing" | "done";
type NoteStatus = "pending" | "uploaded" | "done";

const stageIndex: Record<UploadStage, number> = {
  uploading: 1,
  processing: 2,
  done: 3,
};

const statusMap: Record<NoteStatus, UploadStage> = {
  pending: "uploading",
  uploaded: "processing",
  done: "done",
};

export default function UploadStatus() {
  const isSmall = useIsSmall();
  const { id } = useParams<{ id: string }>();
  const [stage, setStage] = useState<UploadStage>("done");
  const [exist, setExist] = useState(true);

  useEffect(() => {
    if (!id) return;

    const noteId = id;
    let interval: NodeJS.Timeout | null = null;

    async function poll() {
      try {
        const data = await getUploadStatus(noteId);
        if (!data.ok) {
          setExist(false);
          if (interval) clearInterval(interval);
          return;
        }

        const mappedStage = statusMap[data.status];
        setStage(mappedStage);

        if (mappedStage === "done" && interval) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch upload status:", err);
      }
    }

    poll();
    interval = setInterval(poll, 10000);
    return () => interval && clearInterval(interval);
  }, [id]);

  const stepsMeta = useMemo(
    () => [
      { id: 1, title: "Uploading", description: "Uploading your file" },
      { id: 2, title: "Processing", description: "Enhancing your notes" },
      { id: 3, title: "Done", description: "Notes published!" },
    ],
    []
  );

  if (!exist) {
    return (
        <Error />
    )
  }

  return (
    <main className="min-h-screen p-5 container ml-auto mr-auto">
      <Card className="mx-auto w-full max-w-4xl p-4">
        <div className="mx-auto max-w-2xl w-full">
          <Stepper
            value={stageIndex[stage]}
            orientation={isSmall ? "vertical" : "horizontal"}
            className="w-full"
            indicators={{
              completed: <Check className="size-4" />,
            }}
          >
            <div>
              <StepperNav
                className={cn(
                  isSmall
                    ? "flex-col space-y-8"
                    : "flex-row justify-between items-start",
                  "relative"
                )}
              >
                {stepsMeta.map((s, idx) => (
                  <StepperItem
                    key={s.id}
                    step={s.id}
                    className={cn(
                      "relative group/step cursor-pointer",
                      isSmall
                        ? "flex-row items-center"
                        : "flex-col items-center text-center",
                      isSmall ? "w-full" : "flex-1"
                    )}
                  >
                    <StepperTrigger
                      className={cn(
                        "flex gap-4 transition-all duration-300 hover:scale-105",
                        isSmall
                          ? "flex-row items-center text-left w-full"
                          : "flex-col items-center text-center"
                      )}
                    >
                      <div className="relative">
                        <StepperIndicator
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center text-sm justify-center rounded-full border-2 font-medium transition-colors duration-500",
                            "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
                            "data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary",
                            "data-[state=inactive]:border-muted-foreground/30 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground",
                            isSmall && "flex-shrink-0"
                          )}
                          data-state={
                            stageIndex[stage] > s.id
                              ? "completed"
                              : stageIndex[stage] === s.id
                                ? "active"
                                : "inactive"
                          }
                        >
                          {stageIndex[stage] > s.id || stage === "done" ? (
                            <Check className="size-4" />
                          ) : stageIndex[stage] === s.id ? (
                            <LoaderCircleIcon className="size-4 animate-spin" />
                          ) : (
                            s.id
                          )}
                        </StepperIndicator>
                      </div>

                      <div className="transition-all duration-300">
                        <StepperTitle
                          className={cn(
                            "font-medium text-sm transition-colors",
                            stageIndex[stage] === s.id
                              ? "text-black"
                              : "text-muted-foreground"
                          )}
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
                          `${stageIndex[stage] > s.id ? "bg-black" : "bg-muted"}`
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
                    className="space-y-6 animate-in fade-in-50 duration-300 border rounded-lg bg-card p-5 font-light"
                  >
                    <h2 className="text-lg font-medium">{s.title}</h2>
                    {stage === "done" ? (
                      <p>
                        Your notes have been published! Click{" "}
                        <Button className="p-0" variant="link" asChild>
                          <Link to={`/listings/${id}`}>here</Link>
                        </Button>{" "}
                        to view.
                      </p>
                    ) : (
                      <></>
                    )}
                  </StepperContent>
                ))}
              </StepperPanel>
            </div>
          </Stepper>
        </div>
      </Card>
    </main>
  );
}
