import { Navigate } from "react-router-dom"
import { authStorage } from "../storage/authStorage"

export default function PrivateRoute({ children }: any) {
  const token = authStorage.getToken()

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}