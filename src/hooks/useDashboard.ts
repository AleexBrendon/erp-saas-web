import { useEffect, useState } from "react";
import { getClientes, getProdutos, getServicos, getAgendamentos, getFinanceiro } from "../storage";

export function useDashboard(filtro: number) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  useEffect(() => {
    async function load() {
      setLoading(true);

      const [clientes, produtos, servicos, agendamentos, financeiro] =
        await Promise.all([
          getClientes(),
          getProdutos(),
          getServicos(),
          getAgendamentos(),
          getFinanceiro(),
        ]);

      setData({
        clientes,
        produtos,
        servicos,
        agendamentos,
        financeiro
      });

      setLoading(false);
    }
    load();
  }, [filtro]);

  return { data, loading };
}