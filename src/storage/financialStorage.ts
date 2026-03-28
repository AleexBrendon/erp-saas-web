import { api } from "../api/axios"

export type FinanceiroItem = {
  id: number;
  tipo: "entrada" | "saida";
  descricao: string;
  valor: number;
  data: string;
  created_at?: string;
  updated_at?: string;
};

// Buscar todos lançamentos
export const getFinanceiro = async (): Promise<FinanceiroItem[]> => {
  const res = await api.get("/financeiro");
  return res.data;
};

// Criar lançamento
export const createFinanceiro = async (data: Partial<FinanceiroItem>): Promise<FinanceiroItem> => {
  const res = await api.post("/financeiro", data);
  return res.data;
};

// Atualizar lançamento
export const updateFinanceiro = async (id: number, data: Partial<FinanceiroItem>): Promise<FinanceiroItem> => {
  const res = await api.put(`/financeiro/${id}`, data);
  return res.data;
};

// Deletar lançamento
export const deleteFinanceiro = async (id: number): Promise<void> => {
  await api.delete(`/financeiro/${id}`);
};