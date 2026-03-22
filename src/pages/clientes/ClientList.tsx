import React, { useEffect, useState } from "react";
import { SquarePen, Trash2 } from "lucide-react"
import {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente,
} from "../../storage/clientService";

// ✅ TYPE FORA DO COMPONENTE
type Cliente = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    empresa_id?: number;
};

export default function CustomerList() {
    const [customers, setCustomers] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);

    // 🔥 melhor prática: não usar Cliente direto no form
    const [form, setForm] = useState<Omit<Cliente, "id">>({
        nome: "",
        email: "",
        telefone: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    async function fetchClientes(): Promise<void> {
        setLoading(true);

        try {
            const data = await getClientes();
            setCustomers(data);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }

    function openCreate() {
        setForm({ nome: "", email: "", telefone: "" });
        setEditingId(null);
        setModal(true);
    }

    function openEdit(cliente: Cliente): void {
        setForm({
            nome: cliente.nome || "",
            email: cliente.email || "",
            telefone: cliente.telefone || "",
        });
        setEditingId(cliente.id);
        setModal(true);
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> {
        e.preventDefault();

        try {
            if (editingId) {
                await updateCliente(editingId, form);
            } else {
                await createCliente({
                    ...form,
                    empresa_id: 1,
                });
            }

            setModal(false);
            fetchClientes();
        } catch (err) {
            console.error("Erro ao salvar cliente:", err);
        }
    }

    async function handleDelete(id: number): Promise<void> {
        if (!window.confirm("Deseja deletar?")) return;

        try {
            await deleteCliente(id);
            fetchClientes();
        } catch (err) {
            console.error("Erro ao deletar:", err);
        }
    }

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Carregando clientes...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f6fa] p-[20px] flex justify-center">
            <div className="w-full">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-[30px]">
                    <h1 className="text-lg font-semibold text-gray-700">
                        Lista dos Clientes
                    </h1>

                    <button
                        onClick={openCreate}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                    >
                        + Add Customer
                    </button>
                </div>

                {/* TABLE HEADER */}
                <div className="grid grid-cols-4 text-xs text-gray-400 px-4 mb-2">
                    <span>Nome</span>
                    <span>Email</span>
                    <span>Telefone</span>
                    <span></span>
                </div>

                {/* LIST */}
                <div className="space-y-3">
                    {customers.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                        >
                            <div className="grid grid-cols-4 items-center">

                                {/* NAME */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-300" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {c.nome}
                                    </span>
                                </div>

                                {/* EMAIL */}
                                <span className="text-sm text-gray-500">
                                    {c.email}
                                </span>

                                {/* PHONE */}
                                <span className="text-sm text-gray-500">
                                    {c.telefone}
                                </span>

                                {/* ACTIONS */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="text-xs text-blue-500 hover:underline"
                                    >
                                        <SquarePen size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {customers.length === 0 && (
                    <p className="text-center text-gray-400 mt-6">
                        Nenhum cliente encontrado
                    </p>
                )}
            </div>

            {/* MODAL */}
            {modal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg"
                    >
                        <h2 className="font-semibold text-lg">
                            {editingId ? "Editar" : "Criar"} Cliente
                        </h2>

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Nome"
                            value={form.nome}
                            onChange={(e) =>
                                setForm({ ...form, nome: e.target.value })
                            }
                            required
                        />

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                        />

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={(e) =>
                                setForm({ ...form, telefone: e.target.value })
                            }
                            required
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setModal(false)}
                                className="text-gray-500"
                            >
                                Cancelar
                            </button>

                            <button className="bg-indigo-500 text-white px-4 py-2 rounded">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}