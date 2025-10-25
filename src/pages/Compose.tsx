import { lazy, Suspense, useState } from "react";
import { SerializedEditorState } from "lexical";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { CreateComposeNotesReq } from "@/types/requests/compose";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import TagsCreator from "@/components/compose/TagsCreator";
import { createComposeNotes } from "@/services/NotesService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PriceInput } from "@/components/compose/PriceInput";
const Editor = lazy(() =>
  import("@/components/blocks/editor-00/editor").then((module) => ({
    default: module.Editor,
  }))
);

export default function Compose() {
  const [editorState, setEditorState] = useState<SerializedEditorState>();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(CreateComposeNotesReq),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      price: 0,
      publish: false,
      content: {
        root: {
          type: "root",
          version: 1,
        },
      },
      module: "",
    },
  });

  const onSubmit = async (values: CreateComposeNotesReq) => {
    if (!editorState) {
      console.error("Editor content missing");
      return;
    }

    const content = editorState as unknown as {
      root: { type: string; version: number; [k: string]: any };
    };

    const payload = { ...values, content };
    if (!payload.module || payload.module.trim() === "") {
      delete payload.module;
    }
    const resp = await createComposeNotes(payload);
    if (!resp.ok || !resp.data) {
      toast.error(resp.status);
      return;
    }
    toast.success(`Compose note created: ${resp.data.noteId}`);
    navigate(`/article/${resp.data.noteId}`);
  };

  return (
    <main className="px-5 xl:px-0 flex flex-col gap-8 py-10">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <FieldGroup>
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldGroup>
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      className="!text-4xl !font-bold px-0 border-0 ring-0 shadow-none focus-visible:!border-0 focus-visible:!ring-0"
                      id={field.name}
                      placeholder="New Note"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FieldGroup>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldGroup>
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      className="border-0 ring-0 px-0 shadow-none focus-visible:!border-0 focus-visible:!ring-0"
                      id={field.name}
                      placeholder="Enter a description"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FieldGroup>
              )}
            />

            <div className="w-full grid grid-cols-3 gap-3">
              {/* Tags */}
              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldGroup className="col-span-3 sm:col-span-2 lg:col-span-1">
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Tags</FieldLabel>
                      <TagsCreator
                        tags={field.value ?? []}
                        setTags={field.onChange}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FieldGroup>
                )}
              />

              {/* Module */}
              <Controller
                name="module"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldGroup className="col-span-2 sm:col-span-1">
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Module</FieldLabel>
                      <Input value={field.value} onChange={field.onChange} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FieldGroup>
                )}
              />

              {/* Price */}
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldGroup className="col-span-1">
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Price</FieldLabel>
                      <PriceInput field={field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  </FieldGroup>
                )}
              />
            </div>
          </FieldGroup>

          {/* Editor */}
          <Suspense>
            <Editor
              editorSerializedState={editorState}
              onSerializedChange={(value) => setEditorState(value)}
            />
          </Suspense>
          <Button type="submit">Save</Button>
        </form>
      </div>
    </main>
  );
}
