import { api } from "../api/axios";

export type Agendamento = {
  id: number;
  empresa_id: number;
  cliente_id: number;
  servico_id: number;
  usuario_id: number;
  data: string;
  hora: string;
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

export const getAgendamentos = async (): Promise<Agendamento[]> => {
  const res = await api.get("/agendamentos");
  return Array.isArray(res.data) ? res.data : res.data.data;
};

export const createAgendamento = async (
  data: AgendamentoPayload
): Promise<Agendamento> => {
  const res = await api.post("/agendamentos", data);
  return res.data;
};

export const updateAgendamento = async (
  id: number,
  data: AgendamentoPayload
): Promise<Agendamento> => {
  const res = await api.put(`/agendamentos/${id}`, data);
  return res.data;
};

export const deleteAgendamento = async (id: number): Promise<void> => {
  await api.delete(`/agendamentos/${id}`);
};