import { z } from "zod";


export const uploadSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(1, "A description is required"),
  courseCode: z.string().optional(),
  priceCents: z.coerce.number().int().min(0, "Please enter a valid price"),
  tags: z.array(z.string()).max(5).default([]),
  type: z.enum(["cheatsheet", "notes", "answerkey", "knowledge"]).default("notes"),
});

export type UploadFormValues = z.input<typeof uploadSchema>;
export type UploadFormParsed = z.output<typeof uploadSchema>;
