import { X, Check, CircleX, Hourglass, CalendarCheck } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  venda: any | null;
  onEdit: (venda: any) => void;
};

export default function VendaViewModal({
  open,
  onClose,
  onEdit,
  venda,
}: Props) {
  if (!open || !venda) return null;

  const getStatus = (status: string) => {
    switch (status) {
      case "concluido":
        return <Check className="text-green-500" />;
      case "cancelado":
        return <CircleX className="text-red-500" />;
      case "confirmado":
        return <Hourglass className="text-yellow-500" />;
      default:
        return <CalendarCheck className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-slate-800">
          Detalhes da Venda
        </h2>

        <div className="space-y-4">

          <Row label="Cliente" value={venda.cliente_nome || "-"} />

          <Row
            label="Total"
            value={`R$ ${Number(venda.total).toFixed(2)}`}
          />

          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              Status:
              {getStatus(venda.status)}
            </span>

            <span className="text-slate-600 capitalize">
              {venda.status}
            </span>
          </div>

        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onEdit(venda);
              onClose();
            }}
            className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }: any) => (
  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
    <span className="font-medium text-slate-700">{label}:</span>
    <span className="text-slate-600 text-right max-w-[60%] truncate">
      {value}
    </span>
  </div>
);