import { useMemo, useState } from "react";
import { Search, Briefcase, SquarePen, Trash2 } from "lucide-react";

const formatarDuracao = (duracao: number): string => {
  const horas = Math.floor(duracao / 60);
  const minutos = duracao % 60;
  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  }
  return `${minutos}m`;
};

export const ServiceTable = ({
  Services,
  onEdit,
  onDelete,
  openCreate,
  onSelect
}: any) => {

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return Services?.filter((s: any) =>
      s.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [Services, search]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-title font-bold mb-[20px] ml-[30px] text-colortitle">
          Serviços
        </h1>

        <button
          onClick={openCreate}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
        >
          + Novo Serviço
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar serviço..."
            className="w-full border rounded-md pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="grid grid-cols-4 text-[11px] font-bold text-[#A3AED0] uppercase border-b pb-2">
          <span className="text-center">Serviço</span>
          <span className="text-center">Duração</span>
          <span className="text-center">Preço</span>
          <span className="text-center">Ações</span>
        </div>

        <div className="divide-y">
          {filtered?.map((s: any) => (
            <div
              key={s.id}
              onClick={() => onSelect(s)}
              className="grid grid-cols-4 items-center py-3 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5C67FF]">
                  <Briefcase size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 text-sm">{s.nome}</span>
                  <span className="text-xs text-slate-400 truncate max-w-[200px]">
                    {s.descricao}
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-600 text-center">
                {formatarDuracao(Number(s.duracao))}
              </div>

              <div className="font-semibold text-slate-800 text-sm text-center">
                R$ {Number(s.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>

              <div
                className="flex justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(s)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <SquarePen size={16} />
                </button>

                <button
                  onClick={() => onDelete(s.id)}
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