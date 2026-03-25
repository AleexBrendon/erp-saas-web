import { api } from "../api/axios";

// 🔹 Tipo base
export type Agendamento = {
  id: number;
  empresa_id: number;
  cliente_id: number;
  servico_id: number;
  usuario_id: number;
  data: string;       // YYYY-MM-DD
  hora: string;       // HH:mm:ss
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  observacao?: string;

  cliente?: {
    id: number;
    nome: string;
  };

  servico?: {
    id: number;
    nome: string;
  };

  usuario?: {
    id: number;
    nome: string;
  };

  created_at?: string;
  updated_at?: string;
};

// 🔹 Tipo para criação/edição
export type AgendamentoPayload = {
  empresa_id: number;
  cliente_id: number;
  servico_id: number;
  usuario_id: number;
  data: string;
  hora: string;
  status?: "agendado" | "confirmado" | "concluido" | "cancelado";
  observacao?: string;
};

// GET
export const getAgendamentos = async (): Promise<Agendamento[]> => {
  const res = await api.get("/agendamentos");
  return Array.isArray(res.data) ? res.data : res.data.data;
};

// POST
export const createAgendamento = async (
  data: AgendamentoPayload
): Promise<Agendamento> => {
  const res = await api.post("/agendamentos", data);
  return res.data;
};

// PUT
export const updateAgendamento = async (
  id: number,
  data: AgendamentoPayload
): Promise<Agendamento> => {
  const res = await api.put(`/agendamentos/${id}`, data);
  return res.data;
};

// DELETE
export const deleteAgendamento = async (id: number): Promise<void> => {
  await api.delete(`/agendamentos/${id}`);
};