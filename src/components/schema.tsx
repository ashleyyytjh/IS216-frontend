import { z } from "zod";


export const fileItemSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Add a short description (≥ 10 chars)"),
  courseCode: z.string().min(2, "Course code required"),
  priceCents: z.coerce.number().int().min(0, "Price must be ≥ 0"),
  visibility: z.enum(["public", "unlisted"]).default("public"),
  tags: z.array(z.string()).max(8).default([]),
  type: z.enum(["cheatsheet", "notes", "answerkey", "knowledge"]).default("notes"),
});

export const formSchema = z.object({
  items: z.array(fileItemSchema).min(1, "Upload at least one file"),
});

export type UploadFormValues = z.input<typeof formSchema>;
export type UploadFormParsed = z.output<typeof formSchema>;
