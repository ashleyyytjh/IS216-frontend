
import { User } from "@/types/types";
import axiosInstance from "./AxiosInstance";

export const createUser = async (user : User) => {
    const response = await axiosInstance.post(
        '/users', 
        user, 
        {_useIdToken: true}
    );
    return response.data;
}

export const getUser = async() => {
    const response = await axiosInstance.get('/users');
    return response.data;
}

export const updateUser = async (userId: string, userData: any) => {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
}

export const getUserPurchases = async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
}

