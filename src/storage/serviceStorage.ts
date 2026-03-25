import { api } from "../api/axios"

// 🔹 Tipo base
export type Servico = {
  id: number;
  empresa_id?: number;
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
  created_at?: string;
  updated_at?: string;
};

// 🔹 Tipo para criação/edição
export type ServicoPayload = {
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
  empresa_id?: number;
};

// GET
export const getServicos = async (): Promise<Servico[]> => {
  const res = await api.get("/servicos");
  return Array.isArray(res.data) ? res.data : res.data.data;
};

// POST
export const createServico = async (
  data: ServicoPayload
): Promise<Servico> => {
  const res = await api.post("/servicos", data);
  return res.data;
};

// PUT
export const updateServico = async (
  id: number,
  data: ServicoPayload
): Promise<Servico> => {
  const res = await api.put(`/servicos/${id}`, data);
  return res.data;
};

// DELETE
export const deleteServico = async (id: number): Promise<void> => {
  await api.delete(`/servicos/${id}`);
};