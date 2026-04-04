import { X } from "lucide-react";
import type { Usuario } from "../../storage/userStorage";

type Props = {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onEdit: (usuario: Usuario) => void;
};

export default function UserViewModal({ open, usuario, onClose, onEdit }: Props) {
  if (!open || !usuario) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Detalhes do Usuário</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-slate-100 overflow-hidden mb-3">
            <img
              src={usuario.avatar || `https://ui-avatars.com/api/?name=${usuario.nome}&background=ebebeb`}
              alt={usuario.nome}
              className="object-cover w-full h-full"
            />
          </div>

          <h2 className="text-lg font-bold text-[#1B2559]">{usuario.nome}</h2>
          <p className="text-sm text-[#A3AED0]">
            {usuario.role === "admin" ? "Administrador" : "Funcionário"}
          </p>
        </div>

        {/* Detalhes */}
        <div className="space-y-4 text-sm">
          <Detail label="Email" value={usuario.email} />
          <Detail label="Status" value={usuario.ativo ? "Ativo" : "Desativado"} />
        </div>

        {/* Botões */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Fechar
          </button>

          <button
            onClick={() => { onEdit(usuario); onClose(); }}
            className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg hover:bg-indigo-50 transition"
          >
            Editar
          </button>
        </div>

      </div>
    </div>
  );
}

// Componente de detalhe reutilizável
const Detail = ({ label, value }: { label: string; value: string | boolean }) => (
  <div>
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className="font-semibold text-[#1B2559]">{value || "-"}</p>
  </div>
);