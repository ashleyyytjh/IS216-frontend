import { z } from "zod"
import { ObjectIdString } from "./notes.js"

const lexicalNodeSchema = z.object({
  type: z.string(),
  version: z.number(),
}).catchall(z.any())

const lexicalContentSchema = z.object({
  root: lexicalNodeSchema.catchall(z.any()),
})

export const CreateComposeNotesReq = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  module: z.string().optional(),
  tags: z.array(z.string()).min(1),
  publish: z.boolean().default(false),
  price: z.number().nonnegative(),
  content: lexicalContentSchema
})

export const CreateComposeNotesRes = z.object({
    noteId: ObjectIdString
})

export const ComposeNotesParam = z.object({
    id: z.string()
})

export const GetComposeNotesRes = z.object({
  id: z.string(),
  userId: z.string(),
  userFullName: z.string(),
  userImageUrl: z.string(),
  userMajor: z.string(),
  userYear: z.number().int(),
  authorised: z.boolean(),
  title: z.string(),
  description: z.string(),
  module: z.string().nullable().optional(),
  tags: z.array(z.string()),
  publish: z.boolean(),
  price: z.number(),
  content: lexicalContentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const userComposeNote = z.object({
  id: z.string(),
  title: z.string(),
  module: z.string().nullable().optional(),
  tags: z.array(z.string()),
  publish: z.boolean(),
  price: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const UpdateComposeNotesPublishReq = z.object({
    publish: z.boolean()
})

export const GetComposeNotesByOwnerRes = z.array(userComposeNote)

export const UpdateComposeNotesReq = z.object({
  title: z.string(),
  description: z.string(),
  module: z.string().nullable().optional(),
  tags: z.array(z.string()),
  publish: z.boolean(),
  price: z.number(),
  content: lexicalContentSchema,
})

export type CreateComposeNotesReq = z.infer<typeof CreateComposeNotesReq>
export type CreateComposeNotesRes = z.infer<typeof CreateComposeNotesRes>
export type GetComposeNotesReq = z.infer<typeof ComposeNotesParam>
export type GetComposeNotesRes = z.infer<typeof GetComposeNotesRes>
export type GetComposeNotesByOwnerRes = z.infer<typeof GetComposeNotesByOwnerRes>
export type UpdateComposeNotesParam = z.infer<typeof ComposeNotesParam>
export type UpdateComposeNotesPublishReq = z.infer<typeof UpdateComposeNotesPublishReq>
export type UpdateComposeNotesReq = z.infer<typeof UpdateComposeNotesReq>