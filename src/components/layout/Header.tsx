import { Bell, Search, LogOut } from "lucide-react"

export default function Header() {

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-4">

        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h1>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l pl-4">

          <div className="text-sm text-right hidden sm:block">
            <p className="font-medium text-gray-700">
              Admin
            </p>
            <p className="text-gray-500 text-xs">
              admin@email.com
            </p>
          </div>

          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-9 h-9 rounded-full"
          />

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <LogOut size={18} />
          </button>

        </div>

      </div>
    </header>
  )
}