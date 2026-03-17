import { LayoutDashboard, Users, Package } from "lucide-react"
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

        <Link to="/users" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Users size={18}/>
          Usuários
        </Link>

        <Link to="/products" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Package size={18}/>
          Produtos
        </Link>

      </nav>
    </div>
  )
}