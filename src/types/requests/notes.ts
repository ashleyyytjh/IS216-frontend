import z from 'zod';

// zod-to-openapi requirement to extend zod objects with openapi definitions.

export const ObjectIdString = z
	.string()
	.regex(/^[a-f\d]{24}$/i, 'Invalid Mongo ObjectId');

export const CreateNotesReq = z.object({
	filename: z.string().min(1),
	mimeType: z.string().min(1),
	size: z.number().int().positive().max(10 * 1024 * 1024),
	description: z.string(),
    price: z.number().min(0),
	type: z.string(),
	module: z.string().optional(),
	tags: z.array(z.string().min(1)).max(10).default([]),
})

export const CreateNotesRes = z.object({
	noteId: ObjectIdString,
	key: z.string(),
	url: z.string().url(),
	expiresAt: z.number(),
})

export const GetNotesReq = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Mongo ObjectId'),
})

export const NoteStatus = z.enum(['pending', 'uploaded']);

export const GetNotesRes = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i),
	userId: z.string(),
	userFullName: z.string(),
	userImageUrl: z.string(),
	userMajor: z.string(),
	key: z.string(),
	originalName: z.string(),
	mimeType: z.string(),
	size: z.number(),
    description: z.string(),
	tags: z.array(z.string().min(1)).max(10).default([]),
	type: z.string(),
	module: z.string().optional().nullable(),
    price: z.number().min(0),
	purchased: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date().optional(),
})

export const SearchNotesItem = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i),
	userId: z.string(),
	userFullName: z.string(),
	userImageUrl: z.string(),
	userMajor: z.string(),
	userYear: z.number(),
	key: z.string(),
	title: z.string(),
	originalName: z.string(),
	mimeType: z.string(),
	size: z.number(),
    description: z.string(),
	tags: z.array(z.string().min(1)).max(10).default([]),
	type: z.string(),
	module: z.string().optional().nullable(),
    price: z.number().min(0),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
})

export const SearchNotesRes = z.object({
  items: z.array(SearchNotesItem),
  total: z.number(),
  byType: z.array(z.object({
    type: z.string(),
    count: z.number(),
  })),
  page: z.number().min(1),
  limit: z.number().min(1),
})

export const DownloadNotesReq = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i),
})

export const DownloadNotesRes = z.object({
	originalName: z.string(),
	mimeType: z.string(),
	size: z.number(),
	url: z.string(),
	expiresAt: z.number(),
})

export const ConfirmUploadReq = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i),
})

export const GetAllNotesReq = z.object({});

export const SearchNotesReq = z.object({
  query: z.string().optional(),
  type: z.string().optional(),
  since: z.coerce.date().optional(),
  free: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
});


export const ErrorRes = z.object({
	code: z.number(),
	status: z.string(),
	message: z.string(),
})

export type CreateNotesReq = z.infer<typeof CreateNotesReq>;
export type CreateNotesRes = z.infer<typeof CreateNotesRes>;
export type GetNotesReq = z.infer<typeof GetNotesReq>;
export type GetNotesRes = z.infer<typeof GetNotesRes>;
export type DownloadNotesReq = z.infer<typeof DownloadNotesReq>;
export type DownloadNotesRes = z.infer<typeof DownloadNotesRes>;
export type ConfirmUploadReq = z.infer<typeof ConfirmUploadReq>;
export type SearchNotesItem = z.infer<typeof SearchNotesItem>;
export type SearchNotesReq = z.infer<typeof SearchNotesReq>
export type SearchNotesRes = z.infer<typeof SearchNotesRes>
export type ErrorRes = z.infer<typeof ErrorRes>;
