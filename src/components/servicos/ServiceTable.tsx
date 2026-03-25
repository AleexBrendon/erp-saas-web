import { SquarePen, Trash2, Clock, Briefcase } from "lucide-react";

const formatarDuracao = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const minRestantes = minutos % 60;

    if (horas === 0) return `${minRestantes}min`;
    if (minRestantes === 0) return `${horas}h`;
    return `${horas}h ${minRestantes}min`;
};

export const ServiceTable = ({
    Services,
    onEdit,
    onDelete,
    openCreate
}: any) => (
    <div className="flex-1 shadow-sm border">
        <div className="flex justify-between items-center mb-[20px] ml-[30px]">
            <h1 className="text-title font-bold">Serviços</h1>
            <button
                onClick={openCreate}
                className="bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md"
            >
                + Novo Serviço
            </button>
        </div>

        <table className="w-full text-left border-separate border-spacing-y-[10px] bg-[#F8F9FD] rounded-[10px] border-slate-100 p-[20px]">
            <thead>
                <tr className="text-[#A3AED0] text-[11px] font-bold uppercase tracking-widest">
                    <th className="px-4 pb-2">Serviço</th>
                    <th className="px-4 pb-2">Duração</th>
                    <th className="px-4 pb-2">Preço</th>
                    <th className="px-4 pb-2 text-right">Ações</th>
                </tr>
            </thead>
            <tbody>
                {Services?.map((s: any) => (
                    <tr key={s.id} className="group hover:bg-slate-50 transition-all">
                        <td className="px-4 py-4 rounded-l-2xl border-y border-l border-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5C67FF]">
                                    <Briefcase size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#1B2559] text-sm">{s.nome}</span>
                                    <span className="text-[11px] text-[#A3AED0] truncate max-w-[200px]">{s.descricao}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-4 border-y border-transparent">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-[#1B2559] rounded-xl w-fit border border-slate-100/50">
                                <Clock size={14} className="text-[#5C67FF]" />
                                <span className="text-xs font-bold whitespace-nowrap">
                                    {formatarDuracao(Number(s.duracao))}
                                </span>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-[#1B2559] font-bold text-sm border-y border-transparent">
                            R$ {Number(s.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 rounded-r-2xl border-y border-r border-transparent text-right">
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => onEdit(s)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <SquarePen size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(s.id)}
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