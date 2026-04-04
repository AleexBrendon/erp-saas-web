import React, { useState, useEffect } from "react";
import { Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import {
    getProdutos,
    deleteProduto,
    createProduto,
    updateProduto,
    type Produto
} from "../../storage/productStorage";
import { ProductTable } from "../../components/produtos/ProductTable";
import ProductViewModal from "../../components/produtos/ProductViewModal";

export default function ProductList() {
    const [products, setProducts] = useState<Produto[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
    const [notify, setNotify] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [form, setForm] = useState({ nome: "", descricao: "", preco: "", estoque: "" });

    const showNotify = (msg: string, type: 'success' | 'error' = 'success') => {
        setNotify({ msg, type });
        setTimeout(() => setNotify(null), 4000);
    };

    async function fetchProdutos() {
        setLoading(true);
        try {
            const data = await getProdutos();
            setProducts(data);
        } catch (err) {
            showNotify("Erro ao carregar produtos", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setForm({ nome: "", descricao: "", preco: "", estoque: "" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (p: Produto) => {
        setEditingProduct(p);
        setForm({
            nome: p.nome,
            descricao: p.descricao || "",
            preco: String(p.preco),
            estoque: String(p.estoque)
        });
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteProduto(deleteId);
            if (selectedProduct?.id === deleteId) setSelectedProduct(null);
            showNotify("Produto excluído!");
            fetchProdutos();
        } catch (err) {
            showNotify("Erro ao excluir produto.", "error");
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
                estoque: Number(form.estoque),
                empresa_id: 1
            };

            if (editingProduct) {
                await updateProduto(editingProduct.id, payload);
                showNotify("Produto atualizado!");
            } else {
                await createProduto(payload);
                showNotify("Produto cadastrado!");
            }
            setIsModalOpen(false);
            fetchProdutos();
        } catch (err) {
            showNotify("Erro ao salvar dados.", "error");
        }
    };

    if (loading) return <div className="p-[20px] text-center font-medium text-slate-500">Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#E6E6E6] flex gap-6 relative rounded-[20px]">
            <main className="flex-1 flex flex-col">
                <ProductTable
                    Products={products}
                    onSelect={setSelectedProduct}
                    selectedId={selectedProduct?.id}
                    onEdit={handleOpenEdit}
                    onDelete={(id: number) => setDeleteId(id)}
                    openCreate={handleOpenCreate}
                    showNotify={showNotify}
                />
            </main>

            <ProductViewModal
                open={!!selectedProduct}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onEdit={handleOpenEdit}
            />

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
                                {editingProduct ? "Editar Produto" : "Novo Produto"}
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
                                <label className="text-sm text-gray-500">Nome do Produto</label>
                                <input
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Digite o nome do produto"
                                    value={form.nome}
                                    onChange={(e) =>
                                        setForm({ ...form, nome: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">Descrição</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Descreva o produto"
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
                                        step="0.01"
                                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="R$ 0,00"
                                        value={form.preco}
                                        onChange={(e) =>
                                            setForm({ ...form, preco: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-500">Estoque</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Quantidade"
                                        value={form.estoque}
                                        onChange={(e) =>
                                            setForm({ ...form, estoque: e.target.value })
                                        }
                                        required
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
                                {editingProduct ? "Atualizar" : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 bg-[#1B2559]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
                        <h3 className="text-xl font-bold text-[#1B2559]">Excluir Produto?</h3>
                        <p className="text-[#A3AED0] text-sm mb-8">Esta ação removerá o item permanentemente.</p>
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