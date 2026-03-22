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