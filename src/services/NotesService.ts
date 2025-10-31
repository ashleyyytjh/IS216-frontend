import { CreateNotesReq, CreateNotesRes, GetNotesRes, GetUploadStatusRes,  SearchNotesRes } from "@/types/requests/notes";
import axiosInstance from "./AxiosInstance";
import { isAxiosError } from "axios";
import { CreateComposeNotesReq, CreateComposeNotesRes, GetComposeNotesRes, UpdateComposeNotesReq } from "@/types/requests/compose";
// Unprotected routes
// notesRouter.get("/search", SearchNotes)
// notesRouter.get("/:id", GetNotesById)

// // Protected routes
// notesRouter.use(verifyToken)
// notesRouter.post("/", CreateNotes)
// notesRouter.patch("/:id/confirm-upload", ConfirmUpload)
// notesRouter.get("/:id/download", DownloadNotes)



export const searchNotes = async (queryParams: URLSearchParams): Promise<SearchNotesRes> => {
  const response = await axiosInstance.get('/notes/search', { params: queryParams });
  const data = SearchNotesRes.parse(response.data)
  return data;
}

export const getNotesById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data as GetNotesRes;
  } catch (err) {
    return undefined
  }
}

export const createNotes = async (noteData: CreateNotesReq) => {

  const response = await axiosInstance.post('/notes', noteData);
  return response.data as CreateNotesRes;
}

export const confirmUpload = async (noteId: string) => {
  const response = await axiosInstance.patch(`/notes/${noteId}/confirm-upload`);
  return { ok: response.status == 200, status: response.statusText };
}

//notes that the user uploaded
export const getUserOwned = async () => {
  const response = await axiosInstance.get(`/notes/owned`)
 
  return response.data
}

export const getUserDoneNotes = async () => {
  const response = await axiosInstance.get(`/notes/done`)
  return response.data

}

//dont touch this first
export const downloadNotes = async (noteId: string) => {
  const response = await axiosInstance.get(`/notes/${noteId}/download`);
  return response.data;
}

export const getUploadStatus = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/notes/upload/${id}`);
    const data = GetUploadStatusRes.parse(res.data)
    return { status: data.status, ok: true }
  } catch (err) {
    if (isAxiosError(err)) {
      return { status: "", ok: false }
    }
    throw err;
  }
}


export const getOwnedComposeNotes = async () => {
  const response = await axiosInstance.get(`/notes/compose/owned`);
  return response;
}

export const uploadComposedNote = async (composeID: any, curState:any) => {
  const response = await axiosInstance.patch(`/notes/compose/${composeID}/publish`,
  { publish: curState },
  );
  return response;
}

export const createComposeNotes = async(payload: CreateComposeNotesReq) => {
  try {
    const res = await axiosInstance.post("/notes/compose", payload)
    const data = CreateComposeNotesRes.parse(res.data)
    return { status: res.statusText, ok: true, data: data }
  } catch (err) {
    return returnErr(err)
  }
}

export const getComposeNoteById = async(id: string) => {
  try {
    const res = await axiosInstance.get(`/notes/compose/${id}`)
    const data = GetComposeNotesRes.parse(res.data)
    return { status: res.statusText, ok: true, data: data }
  } catch (err) {
    return returnErr(err)
  }
}

function returnErr(err: any) {
  if (isAxiosError(err)) {
    return { status: err.message, ok: false, data: null }
  }
  return { status: err, ok: false, data: null }
}

export const updateComposeNote = async (id: string, body: UpdateComposeNotesReq) => {
  try {
    const res = await axiosInstance.patch(`/notes/compose/${id}`, body)
    return { status: res.statusText, ok: res.status == 200, data: null }
  } catch (err) {
    return returnErr(err)
  }
}

//not deleting.
export const deleteComposeNote =(composeID:any) =>{
  console.log(composeID)
  const res = axiosInstance.delete(`/notes/compose/${composeID}`)
  return res;
}

export const getComposeBatch = async (noteIds:any)=>{
  const response = await axiosInstance.post("/notes/compose/batch-head",
    {notes: noteIds}
  );
  return response.data;
}

export const getUploadBatch = async(noteId:any)=>{
  return await axiosInstance.post("/notes/batch-head", {notes:noteId});

}

export const deleteUploadedNote = async (id:any)=>{
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response
}

export const getSingleCompose = async (id:any)=>{
   const res = await axiosInstance.get(`/notes/compose/${id}`)
   return res.data;
}

export const getUserPurchasedNotes = async ()=>{
  const response = await axiosInstance.get(`/notes/purchased`)
  return response.data;
}
