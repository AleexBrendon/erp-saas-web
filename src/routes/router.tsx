import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Layout from "../components/layout/Layout"
import Dashboard from "../pages/dashboard/Dashboard"
// import Usuarios from "../pages/clientes/ClientList"
import Clientes from "../pages/clientes/ClientList"
// import Servicos from "../pages/servicos/Servicos"
// import Produtos from "../pages/produtos/Produtos"
// import Agendamentos from "../pages/agendamentos/Agendamentos"
// import Vendas from "../pages/vendas/Vendas"
// import ItensVendidos from "../pages/itensVendidos/ItensVendidos"
// import Financeiro from "../pages/financeiro/Financeiro"
import Login from "../pages/auth/Login"
import PrivateRoute from "./PrivateRoute"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* REDIRECT PADRÃO */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}