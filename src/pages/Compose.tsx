import { useState } from "react";
import { SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/editor-00/editor";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { CreateComposeNotesReq } from "@/types/requests/compose";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import TagsCreator from "@/components/compose/TagsCreator";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

// interface CreateComposeNotesReq {
//   userId: string
//   title: string
//   tags: string[]
//   publish: boolean
//   price: number
//   content: unknown
//   module?: string | undefined
// }

// const mockNote: CreateComposeNotesReq = {
//   userId: "mock-user-123",
//   title: "Introduction to Machine Learning",
//   tags: ["ai", "machine-learning", "lecture-notes"],
//   publish: true,
//   price: 5.0,
//   content: {
//     root: {
//       type: "root",
//       version: 1,
//       children: [
//         {
//           type: "paragraph",
//           version: 1,
//           children: [
//             {
//               type: "text",
//               text: "Machine learning is a subset of artificial intelligence focused on enabling systems to learn from data and improve over time without explicit programming.",
//               detail: 0,
//               format: 0,
//               mode: "normal",
//               style: "",
//               version: 1,
//             },
//           ],
//         },
//       ],
//     },
//   },
//   module: "IS216",
// }

type LexicalContent = {
  root: {
    type: string;
    version: number;
    [k: string]: any;
  };
};

export default function EditorDemo() {
  const [editorState, setEditorState] = useState<SerializedEditorState>();

  // (typeof mockNote !== "undefined" && mockNote?.content) ?? initialValue

  const [title, setTitle] = useState<string>();

  // (typeof mockNote !== "undefined" && mockNote?.title?.trim()) || "Untitled Note"
  const [saving, setSaving] = useState(false);

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

  const onSubmit = (values: CreateComposeNotesReq) => {
    console.log("editor");
    if (!editorState) {
      console.error("Editor content missing");
      return;
    }

    const content = editorState as unknown as {
      root: { type: string; version: number; [k: string]: any };
    };

    const payload = { ...values, content };
    console.log("Final payload:", payload);
  };

  return (
    <main className="px-5 xl:px-0 flex flex-col gap-8 py-10 border">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="!text-4xl !font-medium px-0 border-0 ring-0 shadow-none focus-visible:!border-0 focus-visible:!ring-0"
                      id={field.name}
                      placeholder="New Note"
                      autoComplete="off"
                    />
                    {form.formState.errors.description && (
                      <FieldError>
                        {form.formState.errors.description.message}
                      </FieldError>
                    )}
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
                    {form.formState.errors.description && (
                      <FieldError>
                        {form.formState.errors.description.message}
                      </FieldError>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FieldGroup>
              )}
            />

            {/* Tags */}
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldGroup>
                  <Field data-invalid={fieldState.invalid}>
                    <TagsCreator tags={field.value} setTags={field.onChange} />
                    {form.formState.errors.description && (
                      <FieldError>
                        {form.formState.errors.description.message}
                      </FieldError>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FieldGroup>
              )}
            />
          </FieldGroup>
          <Editor
            editorSerializedState={editorState}
            onSerializedChange={(value) => setEditorState(value)}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </main>
  );
}
