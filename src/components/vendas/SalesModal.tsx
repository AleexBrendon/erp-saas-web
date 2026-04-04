import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type VendaFormData = {
  cliente_id?: number;
  total?: number;
  status: "pendente" | "pago" | "cancelado";
};

type Cliente = {
  id: number;
  nome: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: VendaFormData) => void;
  clientes: Cliente[];
  editData: any | null;
};

export default function SalesModal({ open, onClose, onSave, clientes, editData }: Props) {
  const [form, setForm] = useState<VendaFormData>({
    cliente_id: undefined,
    total: undefined,
    status: "pendente",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        cliente_id: editData.cliente_id,
        total: editData.total,
        status: editData.status || "pendente",
      });
    } else {
      setForm({
        cliente_id: undefined,
        total: undefined,
        status: "pendente",
      });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleChange = (field: keyof VendaFormData, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.cliente_id) {
      alert("Selecione um cliente");
      return;
    }

    if (!form.total) {
      alert("Informe o total");
      return;
    }

    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editData ? "Editar Venda" : "Nova Venda"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-500">Cliente</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={form.cliente_id ?? ""}
              onChange={(e) =>
                handleChange("cliente_id", Number(e.target.value))
              }
            >
              <option value="">Selecione</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Total</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
              placeholder="R$ 0,00"
              value={form.total ?? ""}
              onChange={(e) =>
                handleChange("total", Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
          >
            {editData ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}