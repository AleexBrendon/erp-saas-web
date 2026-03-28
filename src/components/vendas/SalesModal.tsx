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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editData ? "Editar Venda" : "Nova Venda"}
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Cliente */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Cliente</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1"
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

        {/* Total */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Total</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={form.total ?? ""}
            onChange={(e) =>
              handleChange("total", Number(e.target.value))
            }
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Status</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {editData ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}