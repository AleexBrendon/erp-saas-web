import { api } from "../api/axios";
export type VendaItemAPI = {
  id: number;
  cliente_id: number | null;
  cliente?: { id: number; nome: string };
  total: number;
  status: "pendente" | "pago" | "cancelado";
  created_at: string;
  updated_at: string;
};

// Criar venda
export const createVenda = async (data: any): Promise<VendaItemAPI> => {
  const res = await api.post("/vendas", data);
  return res.data;
};

// Atualizar venda
export const updateVenda = async (id: number, data: any): Promise<VendaItemAPI> => {
  const res = await api.put(`/vendas/${id}`, data);
  return res.data;
};

export const getVendas = async (): Promise<VendaItemAPI[]> => {
  const res = await api.get("/vendas");
  return res.data;
};

export const deleteVenda = async (id: number): Promise<void> => {
  await api.delete(`/vendas/${id}`);
};