import { useMemo, useState } from "react";
import { SquarePen, Trash2, Search } from "lucide-react";
import dayjs from "dayjs";
import { type VendaItemAPI } from "../../storage/salesStorage";

type Props = {
  items: VendaItemAPI[];
  onEdit: (item: VendaItemAPI) => void;
  onDelete: (id: number) => void;
};

export default function SalesList({ items, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.cliente?.nome?.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          className="w-full border rounded-lg px-10 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
      </div>

      <div className="text-[#A3AED0] text-[11px] font-bold uppercase tracking-widest grid grid-cols-5 px-4 py-2 border-b">
        <span className="text-center">Cliente</span>
        <span className="text-center">Total</span>
        <span className="text-center">Status</span>
        <span className="text-center">Data</span>
        <span className="text-center">Ações</span>
      </div>

      {filtered.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-5 px-4 py-4 border-b items-center"
        >
          <div className="text-center">
            {item.cliente?.nome || "Sem cliente"}
          </div>

          <div className="text-center font-medium">
            R$ {Number(item.total).toFixed(2)}
          </div>

          <div
            className={`text-center ${
              item.status === "pago"
                ? "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-green-100 text-green-600 uppercase"
                : item.status === "cancelado"
                ? "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-red-100 text-red-600 uppercase"
                : "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-yellow-100 text-yellow-600 uppercase"
            }`}
          >
            {item.status}
          </div>

          <div className="text-center">
            {dayjs(item.created_at).format("DD/MM/YYYY")}
          </div>

          <div className="flex justify-center gap-2">
            <button onClick={() => onEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <SquarePen size={18} />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}