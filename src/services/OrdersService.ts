import AxiosInstance from "./AxiosInstance";


const getOrders = async () => {
    const response = await AxiosInstance.get('/orders');
    return response.data;
}

const createOrder = async (orderData: any) => {
    const response = await AxiosInstance.post('/orders', orderData);
    return response.data;
}

const getOrderById = async (userId: string) => {
    const response = await AxiosInstance.get(`/orders/${userId}`);
    return response.data;
}

const getUserOrderByUserId = async (userId: string) => {
    const response = await AxiosInstance.get(`/orders/user/${userId}`);
    return response.data;
}

export { getOrders, createOrder, getOrderById, getUserOrderByUserId };
