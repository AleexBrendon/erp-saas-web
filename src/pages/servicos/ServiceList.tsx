import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import {
    getServicos,
    deleteServico,
    createServico,
    updateServico,
    type Servico
} from "../../storage/serviceStorage";
import { ServiceTable } from "../../components/servicos/ServiceTable";

export default function ServicePage() {
    const [services, setServices] = useState<Servico[]>([]);
    const [selectedService, setSelectedService] = useState<Servico | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingService, setEditingService] = useState<Servico | null>(null);
    const [notify, setNotify] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    
    const [form, setForm] = useState({ nome: "", descricao: "", preco: "", duracao: "" });

    const showNotify = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotify({ msg, type });
        setTimeout(() => setNotify(null), 4000);
    };

    async function fetchServicos() {
        setLoading(true);
        try {
            const data = await getServicos();
            setServices(data);
        } catch (err) {
            showNotify("Erro ao carregar serviços", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchServicos();
    }, []);

    const handleOpenCreate = () => {
        setEditingService(null);
        setForm({ nome: "", descricao: "", preco: "", duracao: "" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (s: Servico) => {
        setEditingService(s);
        setForm({ 
            nome: s.nome, 
            descricao: s.descricao || "", 
            preco: String(s.preco), 
            duracao: String(s.duracao) 
        });
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteServico(deleteId);
            if (selectedService?.id === deleteId) setSelectedService(null);
            showNotify("Serviço excluído!");
            fetchServicos();
        } catch (err) {
            showNotify("Erro ao excluir serviço.", "error");
        } finally {
            setDeleteId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { 
                ...form, 
                preco: Number(form.preco), 
                duracao: Number(form.duracao),
                empresa_id: 1 
            };

            if (editingService) {
                await updateServico(editingService.id, payload);
                showNotify("Serviço atualizado!");
            } else {
                await createServico(payload);
                showNotify("Serviço cadastrado!");
            }
            setIsModalOpen(false);
            fetchServicos();
        } catch (err) {
            showNotify("Erro ao salvar dados.", "error");
        }
    };

    if (loading) return <div className="p-[20px] text-center font-medium text-slate-500">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#E6E6E6] flex gap-6 relative rounded-[20px]" onClick={() => setSelectedService(null)}>
            <main className="flex-1 flex flex-col">
                <ServiceTable
                    Services={services}
                    onSelect={setSelectedService}
                    selectedId={selectedService?.id}
                    onEdit={handleOpenEdit}
                    onDelete={(id: number) => setDeleteId(id)}
                    openCreate={handleOpenCreate}
                    showNotify={showNotify}
                />
            </main>

            {/* NOTIFICAÇÃO (Toast) */}
            {notify && (
                <div className="fixed bottom-10 right-10 z-[9999] animate-toast">
                    <div className={`relative flex items-center gap-4 px-6 py-5 rounded-[24px] shadow-2xl min-w-[350px] overflow-hidden ${notify.type === 'success' ? 'bg-[#1B2559] text-white' : 'bg-white text-red-600 border border-red-100'}`}>
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notify.type === 'success' ? 'bg-[#5C67FF]/20 text-[#5C67FF]' : 'bg-red-50 text-red-500'}`}>
                            {notify.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[10px] font-bold uppercase opacity-60">{notify.type === 'success' ? 'Sucesso' : 'Erro'}</span>
                            <span className="text-sm font-bold">{notify.msg}</span>
                        </div>
                        <button onClick={() => setNotify(null)} className="opacity-40 hover:opacity-100"><X size={18} /></button>
                        <div className={`absolute bottom-0 left-0 h-1.5 progress-bar-active ${notify.type === 'success' ? 'bg-[#5C67FF]' : 'bg-red-500'}`} />
                    </div>
                </div>
            )}

            {/* MODAL FORMULÁRIO */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#1B2559]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-4 right-6 text-[#A3AED0] hover:text-[#1B2559]"><X size={20} /></button>
                        <h2 className="text-2xl font-bold text-[#1B2559] mb-8">{editingService ? "Editar Serviço" : "Novo Serviço"}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Nome do Serviço</label>
                                <input className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#5C67FF]" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Descrição</label>
                                <textarea className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#5C67FF]" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Preço (R$)</label>
                                    <input type="number" step="0.01" className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm outline-none" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} required />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Duração (min)</label>
                                    <input type="number" className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm outline-none" value={form.duracao} onChange={e => setForm({ ...form, duracao: e.target.value })} required />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[#A3AED0] font-bold border border-[#cad0e3] rounded-xl">Cancelar</button>
                            <button type="submit" className="flex-1 py-3 bg-[#5C67FF] text-white font-bold rounded-xl shadow-lg">Salvar</button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL EXCLUSÃO */}
            {deleteId && (
                <div className="fixed inset-0 bg-[#1B2559]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
                        <h3 className="text-xl font-bold text-[#1B2559]">Excluir Serviço?</h3>
                        <p className="text-[#A3AED0] text-sm mb-8">Esta ação removerá o serviço permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 text-[#A3AED0] font-bold border border-[#cad0e3] rounded-xl">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}