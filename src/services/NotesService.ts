import axiosInstance from "./AxiosInstance";
// Unprotected routes
// notesRouter.get("/search", SearchNotes)
// notesRouter.get("/:id", GetNotesById)

// // Protected routes
// notesRouter.use(verifyToken)
// notesRouter.post("/", CreateNotes)
// notesRouter.patch("/:id/confirm-upload", ConfirmUpload)
// notesRouter.get("/:id/download", DownloadNotes)



export const searchNotes = async (queryParams: any) => {
    const response = await axiosInstance.get('/notes/search', { params: queryParams });
    return response.data;
}

export const getNotesById = async(id: string) => {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data;
}

export const createNotes = async (noteData: any) => {
    const response = await axiosInstance.post('/notes', noteData);
    return response.data;
}

export const confirmUpload = async (noteId: string) => {
    const response = await axiosInstance.patch(`/notes/${noteId}/confirm-upload`);
    return response.data;
}

//dont touch this first
export const downloadNotes = async (noteId: string) => {
    const response = await axiosInstance.get(`/notes/${noteId}/download`, { responseType: 'blob' });
    return response.data;
}

