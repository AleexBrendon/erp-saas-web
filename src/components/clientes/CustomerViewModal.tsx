import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  customer: any | null;
  onEdit: (customer: any) => void;
};

export default function CustomerViewModal({ open, onClose, onEdit, customer }: Props) {
  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 relative">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Detalhes do Cliente</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-slate-100 overflow-hidden mb-3">
            <img
              src={`https://ui-avatars.com/api/?name=${customer.nome}&background=ebebeb`}
              alt=""
            />
          </div>

          <h2 className="text-lg font-bold text-[#1B2559]">
            {customer.nome}
          </h2>
          <p className="text-sm text-[#A3AED0]">
            Cliente
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <Detail label="Email" value={customer.email} />
          <Detail label="Telefone" value={customer.telefone} />
          <Detail label="Documento" value={customer.documento} />
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
              onEdit(customer);
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

const Detail = ({ label, value }: any) => (
  <div>
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className="font-semibold text-[#1B2559]">{value || "-"}</p>
  </div>
);