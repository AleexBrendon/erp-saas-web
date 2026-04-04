import { X } from "lucide-react";
import dayjs from "dayjs";

type Props = {
    open: boolean;
    onClose: () => void;
    item: any | null;
    onEdit: (item: any) => void;
};

export default function FinanceiroViewModal({
    open,
    onClose,
    onEdit,
    item,
}: Props) {
    if (!open || !item) return null;

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
                    Detalhes do Lançamento
                </h2>

                <div className="space-y-4">
                    <Row
                        label="Tipo"
                        value={item.tipo}
                        badge
                    />

                    <Row
                        label="Descrição"
                        value={item.descricao || "-"}
                    />

                    <Row
                        label="Valor"
                        value={`R$ ${Number(item.valor).toFixed(2)}`}
                    />

                    <Row
                        label="Data"
                        value={dayjs(item.data).format("DD/MM/YYYY")}
                    />
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
                    >
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
}

const Row = ({ label, value, badge }: any) => (
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <span className="font-medium text-slate-700">{label}:</span>

        {badge ? (
            <span
                className={`text-xs font-medium px-3 py-1 rounded-[5px] uppercase ${value === "entrada"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
            >
                {value}
            </span>
        ) : (
            <span className="text-slate-600 text-right max-w-[60%] truncate">
                {value}
            </span>
        )}
    </div>
);