import { useState, useMemo } from "react";
import { Edit2, Trash2, UserCheck, Search } from "lucide-react";
import type { Usuario } from "../../storage/userStorage";

type Props = {
  usuarios: Usuario[];
  selectedId?: number;
  onSelect?: (usuario: Usuario) => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
  onToggleActive: (usuario: Usuario) => Promise<void>;
  openCreate: () => void;
};

export default function UserTable({
  usuarios,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onToggleActive,
  openCreate,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [usuarios, search]);

  return (
    <div className="p-4">

      {/* Cabeçalho com botão de criar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-title font-bold text-colortitle text-lg">
          Lista de Usuários
        </h1>
        <button
          onClick={openCreate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
        >
          + Novo Usuário
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar por usuário..."
          className="w-full border rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Grid de usuários */}
      <div className="bg-white border rounded-lg p-4">

        {/* Cabeçalho da grid */}
        <div className="grid grid-cols-5 text-[11px] font-bold text-[#A3AED0] uppercase border-b pb-2 text-center">
          <span>Nome</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="divide-y text-center">
          {filteredUsuarios.length === 0 && (
            <div className="py-6 text-slate-400 text-sm">
              Nenhum usuário encontrado
            </div>
          )}

          {filteredUsuarios.map((u) => (
            <div
              key={u.id}
              onClick={() => onSelect?.(u)}
              className={`grid grid-cols-5 items-center py-3 text-sm cursor-pointer transition ${
                selectedId === u.id ? "bg-[#F4F7FE]" : "hover:bg-slate-50"
              }`}
            >
              <span className="font-medium text-slate-800 truncate">{u.nome}</span>
              <span className="text-slate-700 truncate">{u.email}</span>
              <span className="text-slate-600">{u.role === "admin" ? "Admin" : "Funcionário"}</span>
              <span className="text-slate-500">{u.ativo ? "Ativo" : "Desativado"}</span>

              {/* Ações */}
              <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(u)}
                  className="text-blue-500 hover:text-blue-600"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => onDelete(u.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  onClick={() => onToggleActive(u)}
                  className={`text-green-500 ${u.ativo ? "opacity-70" : "opacity-100"} hover:opacity-100`}
                  title={u.ativo ? "Desativar" : "Ativar"}
                >
                  <UserCheck size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}