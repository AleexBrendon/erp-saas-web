import { useEffect, useState } from "react";
import { api } from "../api/axios";

export function useCatalogos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [p, s] = await Promise.all([
        api.get("/produtos"),
        api.get("/servicos"),
      ]);

      setProdutos(p.data);
      setServicos(s.data);
    }

    load();
  }, []);

  return { produtos, servicos };
}