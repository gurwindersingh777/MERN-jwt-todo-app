import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response
    return Promise.reject({ status, ...data })
  }
)

export default API