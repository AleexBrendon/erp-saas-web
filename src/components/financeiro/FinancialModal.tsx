import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type FinanceiroFormData = {
  tipo: "entrada" | "saida";
  descricao: string;
  valor: number | "";
  data: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FinanceiroFormData) => void;
  editData: any | null;
};

export default function FinanceiroModal({ open, onClose, onSave, editData }: Props) {
  const [form, setForm] = useState<FinanceiroFormData>({
    tipo: "entrada",
    descricao: "",
    valor: "",
    data: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        tipo: editData.tipo || "entrada",
        descricao: editData.descricao || "",
        valor: editData.valor || 0,
        data: editData.data
          ? editData.data.slice(0, 10)
          : "",
      });
    } else {
      setForm({
        tipo: "entrada",
        descricao: "",
        valor: 0,
        data: "",
      });
    }
  }, [editData]);

  if (!open) return null;

  const handleChange = (field: keyof FinanceiroFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editData ? "Editar Lançamento" : "Novo Lançamento"}
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
            <label className="text-sm text-gray-500">Tipo</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 
                     focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Descrição</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1 
                     focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite a descrição"
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="text-sm text-gray-500">Valor</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 mt-1 
                       focus:ring-2 focus:ring-indigo-500"
                placeholder="R$ 0,00"
                value={form.valor}
                onChange={(e) =>
                  handleChange("valor", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Data</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1 
                       focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                value={form.data}
                onChange={(e) => handleChange("data", e.target.value)}
              />
            </div>

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
            onClick={() => onSave(form)}
            className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
          >
            {editData ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}