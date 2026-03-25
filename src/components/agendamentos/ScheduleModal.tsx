import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { X, CalendarDays, Clock } from "lucide-react";

type Person = {
  id: number;
  nome: string;
};

type Servico = {
  id: number;
  nome: string;
};

type Usuario = {
  id: number;
  nome: string;
};

type FormData = {
  cliente_id: number | "";
  servico_id: number | "";
  usuario_id: number | "";
  data: string;
  hora: string;
  status: string;
  observacao: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  people: Person[];
  servicos: Servico[];
  usuarios: Usuario[];
  editData: any | null;
};

export default function ScheduleModal({
  open,
  onClose,
  onSave,
  people,
  servicos,
  usuarios,
  editData,
}: Props) {
  const [form, setForm] = useState<FormData>({
    cliente_id: "",
    servico_id: "",
    usuario_id: "",
    data: "",
    hora: "",
    status: "agendado",
    observacao: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        cliente_id: editData.cliente_id || "",
        servico_id: editData.servico_id || "",
        usuario_id: editData.usuario_id || "",
        data: editData.data
          ? dayjs(editData.data).format("YYYY-MM-DD")
          : "",
        hora: editData.hora ? editData.hora.slice(0, 5) : "",
        status: editData.status || "agendado",
        observacao: editData.observacao || "",
      });
    } else {
      setForm({
        cliente_id: "",
        servico_id: "",
        usuario_id: "",
        data: "",
        hora: "",
        status: "agendado",
        observacao: "",
      });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleChange = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editData ? "Editar Agendamento" : "Novo Agendamento"}
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={form.data}
              onChange={(e) => handleChange("data", e.target.value)}
            />
          </div>

          <div className="relative border rounded-lg py-2 pr-2">
            <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
            <select
              className="w-full pl-9 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={form.hora}
              onChange={(e) => handleChange("hora", e.target.value)}
            >
              <option value="">Selecione</option>
              {Array.from({ length: 24 * 2 }, (_, i) => {
                const hour = Math.floor(i / 2);
                const min = i % 2 === 0 ? "00" : "30";
                const value = `${hour.toString().padStart(2, "0")}:${min}`;
                return (
                  <option key={i} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Cliente</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1 cursor-pointer"
            value={form.cliente_id}
            onChange={(e) => handleChange("cliente_id", Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Serviço</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1 cursor-pointer"
            value={form.servico_id}
            onChange={(e) => handleChange("servico_id", Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Profissional</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1 cursor-pointer"
            value={form.usuario_id}
            onChange={(e) => handleChange("usuario_id", Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Status</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mt-1 cursor-pointer"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="agendado">Agendado</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="text-sm text-gray-500">Observações</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 mt-1"
            rows={3}
            value={form.observacao}
            onChange={(e) => handleChange("observacao", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => onSave(form)}
          >
            {editData ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}