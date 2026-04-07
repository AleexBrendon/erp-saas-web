import { api } from "./axios"
import { authStorage } from "../storage/authStorage"

export async function login(email: string, password: string) {
  const response = await api.post("/login", {
    email,
    password,
  })

  const { token, usuario } = response.data

  authStorage.setToken(token)
  authStorage.setUser(usuario)

  return usuario
}

export async function forgotPassword(email: string) {
  return api.post("/forgot-password", { email })
}

export async function resetPassword(payload: {
  email: string
  token: string
  password: string
  password_confirmation: string
}) {
  return api.post("/reset-password", payload)
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}