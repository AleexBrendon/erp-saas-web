import { useState, useMemo } from "react";
import { SquarePen, Trash2, Package, Search } from "lucide-react";

export const ProductTable = ({
  Products,
  onEdit,
  onDelete,
  openCreate,
  onSelect
}: any) => {

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return Products?.filter((p: any) =>
      p.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [Products, search]);

  return (
    <div className="">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-title font-bold mb-[20px] ml-[30px] text-colortitle">Produtos</h1>

        <button
          onClick={openCreate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
        >
          + Novo Produto
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full border rounded-md pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="grid grid-cols-4 text-[11px] font-bold text-[#A3AED0] uppercase border-b pb-2">
          <span className="text-center">Produto</span>
          <span className="text-center">Preço</span>
          <span className="text-center">Estoque</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="divide-y">
          {filtered?.map((p: any) => (
            <div
              key={p.id}
              onClick={() => onSelect(p)}
              className="grid grid-cols-4 items-center py-3 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#5C67FF]">
                  <Package size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 text-sm">{p.nome}</span>
                  <span className="text-xs text-slate-400 truncate max-w-[200px]">
                    {p.descricao}
                  </span>
                </div>
              </div>

              <div className="font-semibold text-slate-800 text-sm text-center">
                R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>

              <div className="text-center">
                <span className={`${Number(p.estoque) > 5
                    ? "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-green-100 text-green-600 uppercase"
                    : "inline-block text-xs font-medium px-3 py-2 rounded-[5px] bg-red-100 text-red-600 uppercase"
                  }`}>
                  {p.estoque} un
                </span>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(p);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <SquarePen size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};