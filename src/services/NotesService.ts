import axiosInstance from "./AxiosInstance";

export const getNotesById = async(id: string) => {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data;
}