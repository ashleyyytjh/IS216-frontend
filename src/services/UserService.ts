import { User } from "@/types/types";
import axiosInstance from "./AxiosInstance";
import axios from "axios";

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

export const updateUser = async (userData: any) => {
    const response = await axiosInstance.patch(`/users`, userData);
    return response.data;
}

//returns with a presigned url.
//changing to header will have bad header.
export const updateUserImage = async(selectedType:any) =>{
    
    console.log(selectedType,'line 26 from user service')
    const response = await axiosInstance.post(`/users/photo/update`,{
        mimetype:selectedType,
    })
    return response.data;
}

export const confirmUserImage = async () =>{
    const response = await axiosInstance.post('/users/photo/confirm')
    return response;    
}

export const getUserPurchases = async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
}

export const callPresigned = async (url, file) => {
    console.log(file);
    console.log(url);
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
    
  });
  console.log(response)
  return response;
};

