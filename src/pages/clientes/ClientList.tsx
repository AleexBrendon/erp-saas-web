import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Trash2 } from "lucide-react";
import {
    getClientes,
    deleteCliente,
    createCliente,
    updateCliente,
    type Cliente,
    type ClientePayload
} from "../../storage/clientService";
import { CustomerTable } from "../../components/clientes/CustomerTable";
import { CustomerDetails } from "../../components/clientes/CustomerDetails";

export default function ClienteList() {
    const [customers, setCustomers] = useState<Cliente[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingCustomer, setEditingCustomer] = useState<Cliente | null>(null);
    const [form, setForm] = useState<ClientePayload>({ nome: "", email: "", telefone: "" });
    const [notify, setNotify] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    const showNotify = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotify({ msg, type });
        setTimeout(() => setNotify(null), 4000);
    };

    async function fetchClientes() {
        setLoading(true);
        try {
            const data = await getClientes();
            setCustomers(data);
        } catch (err) {
            showNotify("Erro ao carregar clientes", "error");
        } finally {
            setLoading(false);
        }
    }

    const handleOpenCreate = () => {
        setEditingCustomer(null);
        setForm({ nome: "", email: "", telefone: "" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cliente: Cliente) => {
        setEditingCustomer(cliente);
        setForm({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteCliente(deleteId);
            if (selectedCustomer?.id === deleteId) setSelectedCustomer(null);
            showNotify("Cliente excluído com sucesso!");
            fetchClientes();
        } catch (err) {
            showNotify("Erro ao excluir cliente.", "error");
        } finally {
            setDeleteId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await updateCliente(editingCustomer.id, form);
                showNotify("Cliente atualizado!");
            } else {
                await createCliente({ ...form, empresa_id: 1 });
                showNotify("Cadastro realizado!");
            }
            setIsModalOpen(false);
            fetchClientes();
        } catch (err) {
            showNotify("Erro ao salvar dados.", "error");
        }
    };

    if (loading) return <div className="p-[20px] text-center font-medium text-slate-500">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#E6E6E6] flex gap-6 relative rounded-[20px]" onClick={() => setSelectedCustomer(null)}>
            <main className="flex-1 flex flex-col">
                <CustomerTable
                    customers={customers}
                    onSelect={setSelectedCustomer}
                    selectedId={selectedCustomer?.id}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteClick}
                    openCreate={handleOpenCreate}
                    showNotify={showNotify}
                />
            </main>

            {selectedCustomer && (
                <div onClick={(e) => e.stopPropagation()}>
                    <CustomerDetails customer={selectedCustomer} />
                </div>
            )}

            {notify && (
                <div className="fixed bottom-10 right-10 z-[9999] animate-toast">
                    <div className={`relative flex items-center gap-4 px-6 py-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] min-w-[350px] overflow-hidden ${notify.type === 'success' ? 'bg-[#1B2559] text-white' : 'bg-white text-red-600 border border-red-100'
                        }`}>
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notify.type === 'success' ? 'bg-[#5C67FF]/20 text-[#5C67FF]' : 'bg-red-50 text-red-500'
                            }`}>
                            {notify.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                {notify.type === 'success' ? 'Sucesso' : 'Erro'}
                            </span>
                            <span className="text-sm font-bold leading-tight">{notify.msg}</span>
                        </div>
                        <button onClick={() => setNotify(null)} className="opacity-40 hover:opacity-100 transition-opacity"><X size={18} /></button>
                        <div className={`absolute bottom-0 left-0 h-1.5 progress-bar-active ${notify.type === 'success' ? 'bg-[#5C67FF]' : 'bg-red-500'}`} />
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-[#1B2559]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[30px] p-[20px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-6 p-2 text-[#A3AED0] hover:bg-slate-100 rounded-full transition-all hover:text-[#1B2559]"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-[#1B2559] mb-[40px]">{editingCustomer ? "Editar Cliente" : "Novo Cliente"}</h2>
                        <div className="space-y-[20px]">
                            <div>
                                <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Nome Completo</label>
                                <input className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5C67FF] outline-none" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Email</label>
                                <input type="email" className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5C67FF] outline-none" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#A3AED0] uppercase mb-1 block">Telefone</label>
                                <input className="w-full bg-[#F4F7FE] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#5C67FF] outline-none" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[#A3AED0] font-bold hover:bg-slate-50 rounded-xl transition-colors border border-[#cad0e3]">Cancelar</button>
                            <button type="submit" className="flex-1 py-3 bg-[#5C67FF] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a54e1] transition-all">{editingCustomer ? "Atualizar" : "Salvar"}</button>
                        </div>
                    </form>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-[#1B2559]/40 backdrop-blur-md flex items-center justify-center z-[100] p-[20px] animate-fade">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-zoom text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1B2559] mb-2">Tem certeza?</h3>
                        <p className="text-[#A3AED0] text-sm mb-8">Esta ação não pode ser desfeita. O cliente será removido permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 text-[#A3AED0] font-bold hover:bg-slate-50 rounded-xl transition-colors border border-[#cad0e3]">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition-all">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes progress { from { width: 100%; } to { width: 0%; } }
                .progress-bar-active { animation: progress 4s linear forwards !important; }
            `}</style>
        </div>
    );
}