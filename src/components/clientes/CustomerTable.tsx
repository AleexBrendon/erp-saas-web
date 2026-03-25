import { SquarePen, Trash2 } from "lucide-react";

interface CustomerTableProps {
  customers: any[];
  onSelect: (c: any) => void;
  selectedId?: number | null;
  onEdit: (c: any) => void;
  onDelete: (id: number) => void;
  openCreate: () => void;
  showNotify: (msg: string, type?: 'success' | 'error') => void;
}

const formatPhone = (value: string) => {
  if (!value) return "";

  const v = value.replace(/\D/g, "").slice(0, 11);

  if (v.length < 11) return v;

  return v.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
};

const formatDocument = (value: string) => {
  if (!value) return "";

  const v = value.replace(/\D/g, "");

  if (v.length <= 11) {
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return v.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
};

export const CustomerTable = ({ 
  customers, 
  onSelect, 
  selectedId, 
  onEdit, 
  onDelete, 
  openCreate 
}: CustomerTableProps) => (
  <div className="flex-1 shadow-sm border">
    <div className="flex justify-between items-center mb-[20px] ml-[30px]">
      <h1 className="text-title font-bold">Lista de Clientes</h1>
      <button
        onClick={openCreate}
        className="bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-[10px] text-sm font-medium transition-all shadow-md shadow-blue-100"
      >
        + Novo Cliente
      </button>
    </div>

    <table className="w-full text-left border-separate border-spacing-y-[10px] bg-[#F8F9FD] rounded-[10px] border-slate-100 p-[20px]">
      <thead>
        <tr className="text-[#A3AED0] text-[11px] font-bold uppercase tracking-widest">
          <th className="px-4 pb-2">Nome</th>
          <th className="px-4 pb-2">Email</th>
          <th className="px-4 pb-2">Telefone</th>
          <th className="px-4 pb-2">Documento</th>
          <th className="px-4 pb-2 text-right">Ações</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr 
            key={c.id} 
            onClick={() => onSelect(null)}
            className={`group cursor-pointer transition-all ${selectedId === c.id ? 'bg-[#F4F7FE]' : 'hover:bg-slate-50'}`}
          >
            <td className="px-4 py-4 rounded-l-2xl border-y border-l border-transparent">
              <div 
                className="flex items-center gap-3 w-fit"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onSelect(c); 
                }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${c.nome}&background=E2E8F0&color=475569`} alt="" />
                </div>
                <span className="font-bold text-[#1B2559] text-sm hover:text-[#5C67FF] transition-all">
                  {c.nome}
                </span>
              </div>
            </td>
            <td className="px-4 py-4 text-[#A3AED0] text-sm border-y border-transparent">{c.email}</td>
            <td className="px-4 py-4 text-[#A3AED0] text-sm border-y border-transparent">{formatPhone(c.telefone)}</td>
            <td className="px-4 py-4 text-sm text-slate-400 border-y border-transparent">{formatDocument(c.documento)}</td>
            
            <td className="px-4 py-4 rounded-r-2xl border-y border-r border-transparent text-right">
              <div className="flex justify-end gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(c);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <SquarePen size={18} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(c.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);