import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Trash2, Edit2, UserCheck } from "lucide-react";
import {
  getUsuarios,
  deleteUsuario,
  createUsuario,
  updateUsuario,
  toggleUsuario,
  type Usuario,
  type UsuarioFormPayload,
} from "../../storage/userStorage";
import UserTable from "../../components/usuarios/UserTable";
import UserViewModal from "../../components/usuarios/UserViewModal";

export default function UsuarioList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [form, setForm] = useState<UsuarioFormPayload>({
    nome: "",
    email: "",
    role: "funcionario",
    ativo: true,
    avatar: null,
    password: "",
  });

  const [notify, setNotify] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showNotify = (msg: string, type: "success" | "error" = "success") => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingUsuario(null);
    setForm({
      nome: "",
      email: "",
      role: "funcionario",
      ativo: true,
      avatar: null,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setForm({
      nome: usuario.nome || "",
      email: usuario.email || "",
      role: usuario.role || "funcionario",
      ativo: usuario.ativo,
      avatar: null,
      password: "",
    });
    setIsModalOpen(true);
  };

  async function fetchUsuarios() {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      showNotify("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id: number) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUsuario(deleteId);
      if (selectedUsuario?.id === deleteId) setSelectedUsuario(null);
      showNotify("Usuário excluído com sucesso!");
      fetchUsuarios();
    } catch {
      showNotify("Erro ao excluir usuário.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (usuario: Usuario) => {
    try {
      const updated = await toggleUsuario(usuario.id);
      showNotify(`Usuário ${updated.ativo ? "ativado" : "desativado"}`);
      fetchUsuarios();
    } catch {
      showNotify("Erro ao alterar status do usuário", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: UsuarioFormPayload = { ...form };

      if (editingUsuario) {
        await updateUsuario(editingUsuario.id, payload);
        showNotify("Usuário atualizado!");
      } else {
        await createUsuario(payload);
        showNotify("Usuário criado!");
      }
      setIsModalOpen(false);
      fetchUsuarios();
    } catch {
      showNotify("Erro ao salvar usuário.", "error");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center font-medium text-slate-500">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#E6E6E6] flex gap-6 relative rounded-[20px]">
      <main className="flex-1 flex flex-col">
        <UserTable
          usuarios={usuarios}
          onSelect={(u) => setSelectedUsuario(u)}
          selectedId={selectedUsuario?.id}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteClick}
          onToggleActive={handleToggleActive}
          openCreate={handleOpenCreate}
        />
      </main>

      <UserViewModal
        open={!!selectedUsuario}
        usuario={selectedUsuario}
        onClose={() => setSelectedUsuario(null)}
        onEdit={handleOpenEdit}
      />

      {/* Notificação */}
      {notify && (
        <div className="fixed bottom-10 right-10 z-[9999] animate-toast">
          <div
            className={`relative flex items-center gap-4 px-6 py-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] min-w-[350px] overflow-hidden ${notify.type === "success" ? "bg-[#1B2559] text-white" : "bg-white text-red-600 border border-red-100"
              }`}
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notify.type === "success" ? "bg-[#5C67FF]/20 text-[#5C67FF]" : "bg-red-50 text-red-500"
                }`}
            >
              {notify.type === "success" ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold uppercase opacity-60">
                {notify.type === "success" ? "Sucesso" : "Erro"}
              </span>
              <span className="text-sm font-bold">{notify.msg}</span>
            </div>

            <button onClick={() => setNotify(null)}>
              <X size={18} />
            </button>

            <div
              className={`absolute bottom-0 left-0 h-1.5 progress-bar-active ${notify.type === "success" ? "bg-[#5C67FF]" : "bg-red-500"
                }`}
            />
          </div>
        </div>
      )}

      {/* Modal de criação/edição */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingUsuario ? "Editar Usuário" : "Novo Usuário"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="text-sm text-gray-500">Nome</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite o nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite o email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-sm text-gray-500">Role</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "admin" | "funcionario" })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="funcionario">Funcionário</option>
                </select>
              </div>

              {/* Ativo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="ativo" className="text-sm text-gray-500">
                  Ativo
                </label>
              </div>

              {/* Senha */}
              <div>
                <label className="text-sm text-gray-500">Senha</label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  placeholder={editingUsuario ? "Deixe vazio para não alterar" : "Digite a senha"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="text-sm text-gray-500">Avatar</label>
                <div className="flex items-center gap-4 mt-1">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-full border overflow-hidden bg-gray-100">
                    {form.avatar ? (
                      <img
                        src={URL.createObjectURL(form.avatar)}
                        alt="Avatar selecionado"
                        className="w-full h-full object-cover"
                      />
                    ) : editingUsuario?.avatar ? (
                      <img
                        src={editingUsuario.avatar}
                        alt={editingUsuario.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="flex-1"
                    onChange={(e) => setForm({ ...form, avatar: e.target.files?.[0] || null })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
              >
                {editingUsuario ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <Trash2 size={20} />
              </div>
              <h2 className="text-lg font-bold">Confirmar exclusão</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border rounded-lg py-2">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white rounded-lg py-2">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}