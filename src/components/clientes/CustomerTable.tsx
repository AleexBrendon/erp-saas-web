import { useState, useMemo } from "react";
import { SquarePen, Trash2, Search } from "lucide-react";

export const CustomerTable = ({
  customers,
  onSelect,
  selectedId,
  onEdit,
  onDelete,
  openCreate
}: any) => {

  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((c: any) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className="">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-title font-bold mb-[20px] ml-[30px] text-colortitle">
          Lista de Clientes
        </h1>

        <button
          onClick={openCreate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
        >
          + Novo Cliente
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="w-full border rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="grid grid-cols-5 text-[11px] font-bold text-[#A3AED0] uppercase border-b pb-2 text-center">
          <span>Cliente</span>
          <span>Total</span>
          <span>Status</span>
          <span>Documento</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="divide-y text-center">

          {filteredCustomers.length === 0 && (
            <div className="py-6 text-center text-slate-400">
              Nenhum cliente encontrado
            </div>
          )}

          {filteredCustomers.map((c: any) => (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              className={`grid grid-cols-5 items-center py-3 text-sm cursor-pointer transition ${selectedId === c.id
                  ? "bg-[#F4F7FE]"
                  : "hover:bg-slate-50"
                }`}
            >
              <span className="font-medium text-slate-800">
                {c.nome}
              </span>

              <span className="text-slate-700">
                {c.email}
              </span>

              <span className="text-slate-600">
                {c.telefone}
              </span>

              <span className="text-slate-500">
                {c.documento}
              </span>

              <div
                className="flex justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(c)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <SquarePen size={16} />
                </button>

                <button
                  onClick={() => onDelete(c.id)}
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