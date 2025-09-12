import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { Trash2 } from "lucide-react";
import { mkId } from "../components/utils";

interface StepUploadProps {
  files: File[];
  onDrop: (files: File[]) => void;
  onDelete: (index: number) => void;
}

export default function StepUpload({ files, onDrop, onDelete }: StepUploadProps) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Upload your notes</h1>
        <p className="text-muted-foreground">Singapore Management University</p>
      </div>

      <Dropzone
        maxFiles={10}
        onDrop={onDrop}
        onError={console.error}
        src={files}
        className="bg-muted/40 hover:bg-muted rounded-xl p-4"
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, i) => (
            <Card key={mkId(file)}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div><svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="lightblue"  className="icon icon-tabler icons-tabler-filled icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5z" /><path d="M19 7h-4l-.001 -4.001z" /></svg></div><p className="truncate font-medium">{file.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(i)}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Progress value={100} className="mt-2 h-1.5 [&>div]:bg-emerald-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
