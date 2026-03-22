import { LayoutDashboard, Users, Wrench, Boxes, CalendarCheck, ShoppingCart, ListTodo, Banknote } from "lucide-react"
import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg">

      <div className="p-6 font-bold text-xl">
        ERP SaaS
      </div>

      <nav className="space-y-2 px-4">

        <Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/clientes" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Users size={18} />
          Clientes
        </Link>

        <Link to="/servicos" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Wrench size={18} />
          Serviços
        </Link>

        <Link to="/produtos" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Boxes size={18} />
          Produtos
        </Link>

        <Link to="/agendamentos" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <CalendarCheck size={18}/>
          Agendamentos
        </Link>

        <Link to="/vendas" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <ShoppingCart size={18}/>
          Vendas
        </Link>

        <Link to="/itensVendidos" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <ListTodo size={18}/>
          Itens Vendidos
        </Link>

        <Link to="/financeiro" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Banknote size={18}/>
          Financeiro
        </Link>

      </nav>
    </div>
  )
}