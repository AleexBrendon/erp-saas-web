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
import ServiceViewModal from "../../components/servicos/ServiceViewModal";

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
        <div className="min-h-screen bg-[#E6E6E6] flex gap-6 relative rounded-[20px]">

            <main className="flex-1 flex flex-col">
                <ServiceTable
                    Services={services}
                    onSelect={(s: any) => setSelectedService(s)}
                    selectedId={selectedService?.id}
                    onEdit={handleOpenEdit}
                    onDelete={(id: number) => setDeleteId(id)}
                    openCreate={handleOpenCreate}
                    showNotify={showNotify}
                />
            </main>

            <ServiceViewModal
                open={!!selectedService}
                service={selectedService}
                onClose={() => setSelectedService(null)}
                onEdit={handleOpenEdit}
            />

            {notify && (
                <div className="fixed bottom-10 right-10 z-[9999] animate-toast">
                    <div className={`relative flex items-center gap-4 px-6 py-5 rounded-[24px] shadow-2xl min-w-[350px] overflow-hidden ${notify.type === 'success'
                        ? 'bg-[#1B2559] text-white'
                        : 'bg-white text-red-600 border border-red-100'
                        }`}>
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notify.type === 'success'
                            ? 'bg-[#5C67FF]/20 text-[#5C67FF]'
                            : 'bg-red-50 text-red-500'
                            }`}>
                            {notify.type === 'success'
                                ? <CheckCircle2 size={28} />
                                : <AlertCircle size={28} />}
                        </div>

                        <div className="flex flex-col flex-1">
                            <span className="text-[10px] font-bold uppercase opacity-60">
                                {notify.type === 'success' ? 'Sucesso' : 'Erro'}
                            </span>
                            <span className="text-sm font-bold">
                                {notify.msg}
                            </span>
                        </div>

                        <button onClick={() => setNotify(null)}>
                            <X size={18} />
                        </button>

                        <div className={`absolute bottom-0 left-0 h-1.5 progress-bar-active ${notify.type === 'success'
                            ? 'bg-[#5C67FF]'
                            : 'bg-red-500'
                            }`} />
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <form
                        onSubmit={handleSubmit}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 relative"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">
                                {editingService ? "Editar Serviço" : "Novo Serviço"}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">

                            <div>
                                <label className="text-sm text-gray-500">Nome</label>
                                <input
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Nome do serviço"
                                    value={form.nome}
                                    onChange={(e) =>
                                        setForm({ ...form, nome: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Descrição</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Descreva o serviço"
                                    value={form.descricao}
                                    onChange={(e) =>
                                        setForm({ ...form, descricao: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-500">Preço</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="R$ 0,00"
                                        value={form.preco}
                                        onChange={(e) =>
                                            setForm({ ...form, preco: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">Duração (min)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ex: 60"
                                        value={form.duracao}
                                        onChange={(e) =>
                                            setForm({ ...form, duracao: e.target.value })
                                        }
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
                            >
                                {editingService ? "Atualizar" : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-[#1B2559]/40 backdrop-blur-md flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
                        <Trash2 className="mx-auto mb-4 text-red-500" size={32} />

                        <h3 className="text-lg font-bold mb-2">
                            Excluir Serviço?
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            Esta ação é irreversível.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 border rounded-lg py-2"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 text-white rounded-lg py-2"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}