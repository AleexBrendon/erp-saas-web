import { api } from "../api/axios";

export type ItemVenda = {
  id: number;
  venda_id: number;

  produto_id?: number | null;
  servico_id?: number | null;

  produto?: { id: number; nome: string };
  servico?: { id: number; nome: string };

  quantidade: number;
  preco: number;

  created_at: string;
  updated_at: string;
};

export const getItensVendidos = async (): Promise<ItemVenda[]> => {
  const res = await api.get("/itens-venda");
  return res.data;
};

export const createItemVenda = async (data: any): Promise<ItemVenda> => {
  const res = await api.post("/itens-venda", data);
  return res.data;
};

export const updateItemVenda = async (id: number, data: any): Promise<ItemVenda> => {
  const res = await api.put(`/itens-venda/${id}`, data);
  return res.data;
};

export const deleteItemVenda = async (id: number): Promise<void> => {
  await api.delete(`/itens-venda/${id}`);
};