import Sidebar from "./Sidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        <main className="p-6 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}