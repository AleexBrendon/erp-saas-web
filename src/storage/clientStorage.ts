import { api } from "../api/axios"

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  empresa_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type ClientePayload = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  empresa_id?: number;
};

export const getClientes = async (): Promise<Cliente[]> => {
  const res = await api.get("/clientes");
  return Array.isArray(res.data) ? res.data : res.data.data;
};

export const createCliente = async (
  data: ClientePayload
): Promise<Cliente> => {
  const res = await api.post("/clientes", data);
  return res.data;
};

export const updateCliente = async (
  id: number,
  data: ClientePayload
): Promise<Cliente> => {
  const res = await api.put(`/clientes/${id}`, data);
  return res.data;
};

export const deleteCliente = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};