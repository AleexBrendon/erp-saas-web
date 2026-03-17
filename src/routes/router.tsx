import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "../components/layout/Layout"
import Dashboard from "../pages/dashboard/Dashboard"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}