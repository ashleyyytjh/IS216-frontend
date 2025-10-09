import AxiosInstance from "./AxiosInstance";


const getAnnotationsByNoteId = async ( note_id : string) => {
    const response = await AxiosInstance.get(`/annotations/${note_id}`);
    return response.data;
}

const createAnnotation = async ( annotationData : any) => {
    const response = await AxiosInstance.post('/annotations', annotationData);
    return response.data;
}

const deleteAnnotation = async ( annotationId : string) => {
    const response = await AxiosInstance.post(`/annotations/${annotationId}`);
    return response.data;
}


export { getAnnotationsByNoteId, createAnnotation, deleteAnnotation };
