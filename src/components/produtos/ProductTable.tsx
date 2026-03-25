import { SquarePen, Trash2, Package } from "lucide-react";

export const ProductTable = ({ 
    Products, 
    onEdit, 
    onDelete, 
    openCreate 
}: any) => (
    <div className="flex-1 shadow-sm border">
        <div className="flex justify-between items-center mb-[20px] ml-[30px]">
            <h1 className="text-title font-bold">Produtos</h1>
            <button 
                onClick={openCreate} 
                className="bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md"
            >
                + Novo Produto
            </button>
        </div>

        <table className="w-full text-left border-separate border-spacing-y-[10px] bg-[#F8F9FD] rounded-[10px] border-slate-100 p-[20px]">
            <thead>
                <tr className="text-[#A3AED0] text-[11px] font-bold uppercase tracking-widest">
                    <th className="px-4 pb-2">Produto</th>
                    <th className="px-4 pb-2">Preço</th>
                    <th className="px-4 pb-2">Estoque</th>
                    <th className="px-4 pb-2 text-right">Ações</th>
                </tr>
            </thead>
            <tbody>
                {Products?.map((p: any) => (
                    <tr key={p.id} className="group hover:bg-slate-50 transition-all">
                        <td className="px-4 py-4 rounded-l-2xl border-y border-l border-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#5C67FF]">
                                    <Package size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#1B2559] text-sm">{p.nome}</span>
                                    <span className="text-[11px] text-[#A3AED0] truncate max-w-[200px]">{p.descricao}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-[#1B2559] font-bold text-sm border-y border-transparent">
                            R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 border-y border-transparent">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${Number(p.estoque) > 5 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {p.estoque} un
                            </span>
                        </td>
                        <td className="px-4 py-4 rounded-r-2xl border-y border-r border-transparent text-right">
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => onEdit(p)} 
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <SquarePen size={18} />
                                </button>
                                <button 
                                    onClick={() => onDelete(p.id)} 
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