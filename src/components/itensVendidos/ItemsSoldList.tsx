import { useState, useMemo } from "react";
import { SquarePen, Trash2, X, Search } from "lucide-react";
import dayjs from "dayjs";
import type { ItemVenda } from "../../storage/itemsSoldStorage";

type Props = {
  items: ItemVenda[];
  onEdit: (item: ItemVenda) => void;
  onDelete: (id: number) => void;
};

export default function ItemVendaList({ items, onEdit, onDelete }: Props) {
  const [selected, setSelected] = useState<ItemVenda | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpen = (item: ItemVenda) => {
    setSelected(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelected(null);
    setOpenModal(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const nome =
        item.produto?.nome || item.servico?.nome || "";

      return nome.toLowerCase().includes(search.toLowerCase());
    });
  }, [items, search]);

  return (
    <div className="relative">

      {/* 🔍 BUSCA */}
      <div className="flex gap-2 mt-6 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar item..."
            className="w-full border rounded-lg px-10 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
        </div>
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-6 px-4 py-3 text-xs font-semibold text-slate-400 uppercase border-b">
        <span className="text-center">Item</span>
        <span className="text-center">Qtd</span>
        <span className="text-center">Preço</span>
        <span className="text-center">Total</span>
        <span className="text-center">Data</span>
        <span className="text-center">Ações</span>
      </div>

      {/* LISTA */}
      <div className="divide-y">
        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-slate-400">
            Nenhum item encontrado
          </div>
        )}

        {filteredItems.map((item) => {
          const total = Number(item.quantidade) * Number(item.preco);

          const nome =
            item.produto?.nome || item.servico?.nome || "Sem nome";

          return (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
              className="grid grid-cols-6 items-center px-4 py-4 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="text-center font-medium text-slate-700">
                {nome}
              </div>

              <div className="text-center text-slate-600">
                {item.quantidade}
              </div>

              <div className="text-center text-slate-600">
                R$ {Number(item.preco).toFixed(2)}
              </div>

              <div className="text-center font-medium text-slate-700">
                R$ {total.toFixed(2)}
              </div>

              <div className="text-center text-slate-600">
                {dayjs(item.created_at).format("DD/MM/YYYY")}
              </div>

              <div
                className="flex justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <SquarePen size={18} />
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALHES */}
      {openModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-6 text-slate-800">
              Detalhes do Item
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>Item:</span>
                <span>
                  {selected.produto?.nome ||
                    selected.servico?.nome ||
                    "-"}
                </span>
              </div>

              <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>Quantidade:</span>
                <span>{selected.quantidade}</span>
              </div>

              <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>Preço:</span>
                <span>R$ {Number(selected.preco).toFixed(2)}</span>
              </div>

              <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>Total:</span>
                <span>
                  R$ {(selected.quantidade * selected.preco).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>Data:</span>
                <span>
                  {dayjs(selected.created_at).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  onEdit(selected);
                  handleClose();
                }}
                className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}