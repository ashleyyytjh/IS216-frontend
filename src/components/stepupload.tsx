import { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/components/ui/shadcn-io/dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

type StepUploadProps = {
  file: File | null;
  onDrop: (files: File[]) => void;
  onDelete: () => void;
  progress?: number;
};

export default function StepUpload({
  file,
  onDrop,
  onDelete,
}: StepUploadProps) {
  return (
    <section className="space-y-3">
      <Label className="font-medium text-gray-700">File</Label>
      <div className="relative" id="upload-dropzone">
        <Dropzone
          
          multiple={false}
          maxFiles={1}
          onDrop={onDrop}
          onError={console.error}
          src={file ? [file] : undefined}
          className="bg-muted/40 hover:bg-muted rounded-xl hover:cursor-pointer border-gray-300 transition-all duration-200"
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>

        {file && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Remove file"
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 z-10 transition-all duration-200"
            
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </section>
  );
}
