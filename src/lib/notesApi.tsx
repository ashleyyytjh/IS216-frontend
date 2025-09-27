// src/lib/notesApi.ts
export type CreateNotesReq = {
  filename: string;
  description: string;
  tags: string[];
  mimeType: string;
  size: number;
  price: number; // cents
  module: string; // course code
  type: "cheatsheet" | "notes" | "answerkey" | "knowledge";
};

export type CreateNotesRes = {
  noteId: string;
  key: string;
  url: string;       // presigned upload url
  expiresAt: number; // ms
};

export type NoteStatus = "pending" | "uploaded" | "done";

export type NoteRes = {
  id: string;
  status: NoteStatus;
  // other fields may exist; we only need status here
};

export async function createNotes(
  apiBase: string,
  token: string | undefined,
  body: CreateNotesReq
): Promise<CreateNotesRes> {
  const resp = await fetch(`${apiBase}/v1/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const t = await safeText(resp);
    throw new Error(`CreateNotes ${resp.status}: ${t || resp.statusText}`);
  }
  return resp.json();
}

export async function confirmUpload(
  apiBase: string,
  token: string | undefined,
  noteId: string
) {
  const resp = await fetch(`${apiBase}/v1/notes/${noteId}/confirm-upload`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!resp.ok) {
    const t = await safeText(resp);
    throw new Error(`ConfirmUpload ${resp.status}: ${t || resp.statusText}`);
  }
}

export async function putToPresignedUrl(url: string, file: File) {
  const resp = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!resp.ok) {
    const t = await safeText(resp);
    throw new Error(`Upload ${resp.status}: ${t || resp.statusText}`);
  }
}

/** GET a single note (must include `status` from backend). */
export async function getNote(
  apiBase: string,
  noteId: string,
  token?: string
): Promise<NoteRes> {
  const resp = await fetch(`${apiBase}/v1/notes/${noteId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!resp.ok) {
    const t = await safeText(resp);
    throw new Error(`GetNote ${resp.status}: ${t || resp.statusText}`);
  }
  return resp.json();
}

/** Poll a note until it is "done" (or timeout). */
export async function pollNoteUntilDone(
  apiBase: string,
  noteId: string,
  onTick?: (status: NoteStatus) => void,
  opts: { intervalMs?: number; timeoutMs?: number; token?: string } = {}
) {
  const intervalMs = opts.intervalMs ?? 2000;
  const timeoutMs = opts.timeoutMs ?? 90_000;
  const start = Date.now();

  try {
    const first = await getNote(apiBase, noteId, opts.token);
    onTick?.(first.status);
    if (first.status === "done") return first;
  } catch { /* ignore */ }

  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, intervalMs));
    try {
      const n = await getNote(apiBase, noteId, opts.token);
      onTick?.(n.status);
      if (n.status === "done") return n;
    } catch {
      // ignore transient polling errors
    }
  }
  return null; // timed out
}

async function safeText(r: Response) {
  try { return await r.text(); } catch { return ""; }
}
