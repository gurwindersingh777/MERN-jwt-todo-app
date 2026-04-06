import API from "../config/apiClient";
import type { Email, Login, PasswordReset, Register, User } from "../types/auth.types";
import type { Session } from "../types/sessions.types";
import type { GetTodo, Todo, UpdateTodo } from "../types/todos.types";


// Auth
export const login = async (data: Login) => await API.post("/auth/login", data)
export const register = async (data: Register) => await API.post("/auth/register", data)
export const logout = async () => await API.post("/auth/logout")
export const verifyEmail = async (verificationCode: string) => await API.post(`/auth/email/verify/${verificationCode}`)
export const sendPasswordResetEmail = async (data: Email) => await API.post("/auth/password/forgot", data)
export const resetPassword = async (data: PasswordReset) => await API.post("/auth/password/reset", data)

// User
export const getUser = async (): Promise<User> => {
  return await API.get("/user")
}

// Sessions
export const getSessions = async (): Promise<Session[]> => {
  return await API.get("/sessions")
}
export const deleteSession = async (id: string) => await API.delete(`/sessions/${id}`)

// Todo
export const addTodo = async (data: Todo) => await API.post("/todo", data)
export const getTodo = async (): Promise<GetTodo[]> => {
  return await API.get("/todo")
}
export const updateTodo = async (data: UpdateTodo, id: string) => await API.patch(`/todo/${id}`, data)
export const deleteTodo = async (id: string) => await API.delete(`/todo/${id}`)