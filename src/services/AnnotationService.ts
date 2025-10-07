import AxiosInstance from "./AxiosInstance";


const getAnnotationsByNoteId = async ( note_id : string) => {
    const response = await AxiosInstance.get(`/annotations/${note_id}`);
    return response.data;
}


export { getAnnotationsByNoteId };
