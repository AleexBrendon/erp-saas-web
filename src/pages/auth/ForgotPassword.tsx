import { useEffect, useState } from "react"
import { resetPassword } from "../../api/authApi"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get("email") || "")
    setToken(params.get("token") || "")
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)

      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirm,
      })

      setMessage("Senha redefinida com sucesso!")
      setError("")
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Erro ao redefinir senha"

      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#020617] rounded-3xl p-10 text-white">

        <h1 className="text-3xl mb-6">
          Nova senha<span className="text-pink-500">.</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="password"
            placeholder="Nova senha"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            className="input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button className="btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>

          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  )
}