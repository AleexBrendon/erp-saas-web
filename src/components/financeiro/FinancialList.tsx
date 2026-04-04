import { useState, useMemo } from "react";
import { SquarePen, Trash2, X, Search } from "lucide-react";
import dayjs from "dayjs";

type FinanceiroItem = {
  id: number;
  tipo: "entrada" | "saida";
  descricao: string;
  valor: number;
  data: string;
};

type Props = {
  items: FinanceiroItem[];
  onEdit: (item: FinanceiroItem) => void;
  onDelete: (id: number) => void;
};

export default function FinancialList({ items, onEdit, onDelete }: Props) {
  const [selected, setSelected] = useState<FinanceiroItem | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpen = (item: FinanceiroItem) => {
    setSelected(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpenModal(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.descricao.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  return (
    <div className="relative">
      <div className="flex gap-2 mt-6 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por descrição..."
            className="w-full border rounded-lg px-10 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 px-4 py-3 text-xs font-semibold text-slate-400 uppercase border-b">
        <span className="text-center">Tipo</span>
        <span className="text-center">Descrição</span>
        <span className="text-center">Valor</span>
        <span className="text-center">Data</span>
        <span className="text-center">Ações</span>
      </div>

      <div className="divide-y">
        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-slate-400">
            Nenhum lançamento encontrado
          </div>
        )}

        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpen(item)}
            className="grid grid-cols-5 items-center px-4 py-4 hover:bg-slate-50 cursor-pointer"
          >
            <div className={`text-center font-medium ${item.tipo === "entrada" ? "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-green-100 text-green-600 uppercase" : "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-red-100 text-red-600 uppercase"}`}>
              {item.tipo}
            </div>

            <div className="text-center">{item.descricao}</div>

            <div className="text-center font-medium">
              R$ {Number(item.valor).toFixed(2)}
            </div>

            <div className="text-center">
              {dayjs(item.data).format("DD/MM/YYYY")}
            </div>

            <div
              className="flex justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => onEdit(item)}>
                <SquarePen size={18} />
              </button>
              <button onClick={() => onDelete(item.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <button onClick={handleClose} className="float-right">
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">Detalhes</h2>

            <p><strong>Tipo:</strong> {selected.tipo}</p>
            <p><strong>Descrição:</strong> {selected.descricao}</p>
            <p><strong>Valor:</strong> R$ {Number(selected.valor).toFixed(2)}</p>
            <p><strong>Data:</strong> {dayjs(selected.data).format("DD/MM/YYYY")}</p>
          </div>
        </div>
      )}
    </div>
  );
}