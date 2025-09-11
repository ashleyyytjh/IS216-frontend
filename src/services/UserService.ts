
import axiosInstance from "./AxiosInstance";

export const createUser = async () => {
    // userRouter.post('/', verifyIdToken, createUser)
    const response = await axiosInstance.post('/users');
    return response.data;

}

export const getUser = async() => {
    const response = await axiosInstance.get('/users');
    return response.data;
}