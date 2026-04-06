import axios from "axios";
import { queryClient } from "./queryClient";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
}

const TokenRefreshClient = axios.create(options)
TokenRefreshClient.interceptors.response.use((res) => res.data)

const API = axios.create(options)

API.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const { config, response } = error
    const { status, data } = response || {}

    if (status === 401 && !config._retry) {
      config._retry = true
      try {
        await TokenRefreshClient.post("/auth/refresh");
        return API(config)
      } catch (error) {
        queryClient.clear();
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname
          }
        })
      }
    }
    return Promise.reject({ status, ...data })
  }
)

export default API