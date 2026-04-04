// userStorage.ts
export type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: "admin" | "funcionario";
  ativo: boolean;
  empresa_id: number;
  avatar?: string; // URL do avatar
};

export type UsuarioPayload = {
  nome: string;
  email: string;
  role: "admin" | "funcionario";
  ativo: boolean;
  password?: string;
  avatar?: File | null;
};

export type UsuarioFormPayload = UsuarioPayload & {
  avatar?: File | null;
};

const API_URL = "/api/usuarios";
const getToken = () => localStorage.getItem("token") || "";

// Cabeçalhos: se for FormData, não precisa Content-Type
const getHeaders = (isFormData = false) => ({
  Authorization: `Bearer ${getToken()}`,
  ...(isFormData ? {} : { "Content-Type": "application/json" }),
});

// GET todos os usuários
export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(API_URL, { headers: getHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
}

// CREATE usuário
export async function createUsuario(payload: UsuarioFormPayload): Promise<Usuario> {
  const formData = new FormData();
  formData.append("nome", payload.nome);
  formData.append("email", payload.email);
  formData.append("role", payload.role);
  formData.append("ativo", payload.ativo ? "1" : "0");
  if (payload.password) formData.append("password", payload.password);
  if (payload.avatar) formData.append("avatar", payload.avatar);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(true),
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao criar usuário: ${text}`);
  }
  return res.json();
}

// UPDATE usuário
export async function updateUsuario(id: number, payload: UsuarioFormPayload): Promise<Usuario> {
  const formData = new FormData();
  formData.append("nome", payload.nome);
  formData.append("email", payload.email);
  formData.append("role", payload.role);
  formData.append("ativo", payload.ativo ? "1" : "0");
  if (payload.password) formData.append("password", payload.password);
  if (payload.avatar) formData.append("avatar", payload.avatar);

  // Laravel espera PUT ou PATCH
  formData.append("_method", "PUT");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "POST", // método simulado via _method
    headers: getHeaders(true),
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao atualizar usuário: ${text}`);
  }
  return res.json();
}

// DELETE usuário
export async function deleteUsuario(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir usuário");
}

// TOGGLE ativo/desativo
export async function toggleUsuario(id: number): Promise<Usuario> {
  const res = await fetch(`${API_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao alterar status: ${text}`);
  }
  return res.json();
}