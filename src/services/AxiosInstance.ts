const localHostUrl = 'http://localhost:3000'
const API_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios";

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})


export default instance