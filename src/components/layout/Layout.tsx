import Sidebar from "./Sidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex h-screen bg-card">

      <Sidebar />

      <div className="flex-1 flex flex-col">

      <Header />

        <main className="p-[30px] overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}