import API from "../config/apiClient";

type LoginData = {
  email: string
  password: string
}

type RegisterData = LoginData & {
  username: string
  confirmPassword: string
}

type EmailData = {
  email: string
}

export const login = async (data: LoginData) => await API.post("/auth/login", data)
export const register = async (data: RegisterData) => await API.post("/auth/register", data)
export const verifyEmail = async (verificationCode: string) => await API.post(`/auth/email/verify/${verificationCode}`)
export const sendPasswordResetEmail = async (data: EmailData) => await API.post("/auth/password/forgot", data)