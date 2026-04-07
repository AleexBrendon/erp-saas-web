import { Navigate } from "react-router-dom"
import { authStorage } from "../storage/authStorage"

interface Props {
  children: React.ReactNode
  roles?: ("admin" | "funcionario")[]
}

export default function PrivateRoute({ children, roles }: Props) {
  const token = authStorage.getToken()
  const usuario = authStorage.getUser()

  if (!token) {
    return <Navigate to="/login" />
  }

  if (!usuario) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(usuario.role)) {
    return <Navigate to="/dashboard" />
  }

  return children
}