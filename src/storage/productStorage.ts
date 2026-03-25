import { api } from "../api/axios"

// 🔹 Tipo base
export type Produto = {
  id: number;
  empresa_id?: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  created_at?: string;
  updated_at?: string;
};

// 🔹 Tipo para criação/edição
export type ProdutoPayload = {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  empresa_id?: number;
};

// GET
export const getProdutos = async (): Promise<Produto[]> => {
  const res = await api.get("/produtos");
  return Array.isArray(res.data) ? res.data : res.data.data;
};

// POST
export const createProduto = async (
  data: ProdutoPayload
): Promise<Produto> => {
  const res = await api.post("/produtos", data);
  return res.data;
};

// PUT
export const updateProduto = async (
  id: number,
  data: ProdutoPayload
): Promise<Produto> => {
  const res = await api.put(`/produtos/${id}`, data);
  return res.data;
};

// DELETE
export const deleteProduto = async (id: number): Promise<void> => {
  await api.delete(`/produtos/${id}`);
};