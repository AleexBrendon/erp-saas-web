import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard, Users, Wrench, Boxes, CalendarCheck,
  ShoppingCart, ListTodo, Banknote, LogOut
} from "lucide-react"
import { authStorage } from "../../storage/authStorage"

type Usuario = {
  id: number
  nome: string
  email: string
  role: string
  avatar?: string
}

export default function Sidebar() {
  const [user, setUser] = useState<Usuario | null>(null)

  useEffect(() => {
    const loggedUser = authStorage.getUser()

    if (!loggedUser) return

    // Se tiver ID do usuário, busca os dados completos do usuário
    fetch(`http://localhost:8000/api/usuarios/${loggedUser.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then((data: Usuario) => setUser(data))
      .catch(() => {
        console.error("Erro ao buscar usuário")
        setUser(loggedUser) // fallback se der erro
      })
  }, [])

  const handleLogout = () => {
    authStorage.clear()
    window.location.href = "/login"
  }

  // Função para pegar as iniciais do nome
  const getInitials = (name: string) => {
    const names = name.trim().split(" ")
    const initials = names.map(n => n[0].toUpperCase())
    return initials.slice(0, 2).join("") // até 2 letras
  }

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b p-4">
        <img
          src="../Logo.jpg"
          alt="Logo"
          className="w-10 h-10 rounded-md object-contain"
        />
        <span className="text-lg font-bold text-gray-800">ERP SAAS</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/usuarios"
            className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold"
          >
            <Users size={18} /> Usuários
          </Link>
        )}
        <Link to="/clientes" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <Users size={18} /> Clientes
        </Link>
        <Link to="/servicos" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <Wrench size={18} /> Serviços
        </Link>
        <Link to="/produtos" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <Boxes size={18} /> Produtos
        </Link>
        <Link to="/agendamentos" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <CalendarCheck size={18} /> Agendamentos
        </Link>
        <Link to="/vendas" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <ShoppingCart size={18} /> Vendas
        </Link>
        <Link to="/itensVendidos" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <ListTodo size={18} /> Itens Vendidos
        </Link>
        <Link to="/financeiro" className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg font-semibold">
          <Banknote size={18} /> Financeiro
        </Link>
      </nav>

      {/* Footer com avatar */}
      <div className="border-t p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={`${user.avatar}`}
                alt={user.nome}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                {user?.nome ? getInitials(user.nome) : "?"}
              </div>
            )}

            <div className="text-sm">
              <p className="font-medium text-gray-700">{user?.nome || "Carregando..."}</p>
              <p className="text-gray-500 text-xs">{user?.email || "..."}</p>
              <p className="text-gray-500 text-xs">{user?.role || "..."}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}