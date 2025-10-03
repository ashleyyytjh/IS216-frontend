const localHostUrl = 'http://localhost:3000'
const API_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios";
import { fetchAuthSession } from 'aws-amplify/auth';


const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

instance.interceptors.request.use(
  async (config: any) => {
    try {
      if (config._noAuth) {
        console.log("Interceptor: Skipping Authorization header for this request.")
        delete config.headers.Authorization
        return config
      }

      const session = await fetchAuthSession()
      let token

      if (config._useIdToken) {
        token = session.tokens?.idToken?.toString()
        console.log("Interceptor: Using ID Token for this request.")
      } else {
        token = session.tokens?.accessToken?.toString()
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error("Error fetching auth session:", error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default instance