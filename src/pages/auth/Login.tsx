import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../api/authApi"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      await login(email, senha)
      navigate("/dashboard")
    } catch (err) {
      console.log(err)
      setError("Email ou senha inválidos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl min-h-[600px] bg-[#020617] rounded-3xl overflow-hidden flex shadow-[0_0_60px_rgba(0,0,0,0.6)]">

        <div className="w-full md:w-1/2 px-12 py-10 flex flex-col justify-center text-white">

          <h1 className="text-4xl font-semibold mb-10 tracking-tight">
            Faça seu login<span className="text-pink-500">.</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-sm text-gray-400">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#0b1120]/80 border border-[#1e293b] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#0b1120]/80 border border-[#1e293b] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                required
              />
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-gray-400 hover:text-white">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="/image-login.png"
            className="w-full h-full max-sm:hidden sm:max-md:hidden"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_60%)]" />
        </div>

      </div>
    </div>
  );
}