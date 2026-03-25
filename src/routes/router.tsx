import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Layout from "../components/layout/Layout"
import Dashboard from "../pages/dashboard/Dashboard"
// import Usuarios from "../pages/clientes/ClientList"
import Clientes from "../pages/clientes/ClientList"
import Servicos from "../pages/servicos/ServiceList"
import Produtos from "../pages/produtos/ProductList"
import Agendamentos from "../pages/agendamento/SchedulePage"
// import Vendas from "../pages/vendas/Vendas"
// import ItensVendidos from "../pages/itensVendidos/ItensVendidos"
// import Financeiro from "../pages/financeiro/Financeiro"
import Login from "../pages/auth/Login"
import PrivateRoute from "./PrivateRoute"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}