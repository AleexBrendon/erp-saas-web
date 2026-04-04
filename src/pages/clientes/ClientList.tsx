import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Trash2 } from "lucide-react";
import {
  getClientes,
  deleteCliente,
  createCliente,
  updateCliente,
  type Cliente,
  type ClientePayload,
} from "../../storage/clientStorage";
import { CustomerTable } from "../../components/clientes/CustomerTable";
import CustomerViewModal from "../../components/clientes/CustomerViewModal";

export default function ClienteList() {
  const [customers, setCustomers] = useState<Cliente[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Cliente | null>(null);
  const [form, setForm] = useState<ClientePayload>({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
  });

  const [notify, setNotify] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const cleanNumber = (v: string) => v.replace(/\D/g, "");

  const showNotify = (
    msg: string,
    type: "success" | "error" = "success"
  ) => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setForm({ nome: "", email: "", telefone: "", documento: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setEditingCustomer(cliente);
    setForm({
      nome: cliente.nome || "",
      email: cliente.email || "",
      telefone: maskPhone(cliente.telefone || ""),
      documento: maskDocument(cliente.documento || ""),
    });
    setIsModalOpen(true);
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

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCliente(deleteId);

      if (selectedCustomer?.id === deleteId) {
        setSelectedCustomer(null);
      }

      showNotify("Cliente excluído com sucesso!");
      fetchClientes();
    } catch (err) {
      showNotify("Erro ao excluir cliente.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        telefone: cleanNumber(form.telefone),
        documento: cleanNumber(form.documento),
      };

      if (editingCustomer) {
        await updateCliente(editingCustomer.id, payload);
        showNotify("Cliente atualizado!");
      } else {
        await createCliente({ ...payload, empresa_id: 1 });
        showNotify("Cadastro realizado!");
      }

      setIsModalOpen(false);
      fetchClientes();
    } catch (err) {
      showNotify("Erro ao salvar dados.", "error");
    }
  };

  const maskPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d?)/, "($1) 9");

    value = value.replace(
      /^(\(\d{2}\) 9)(\d{0,4})(\d{0,4}).*/,
      (_, p1, p2, p3) => {
        let result = p1;
        if (p2) result += " " + p2;
        if (p3) result += "-" + p3;
        return result;
      }
    );

    return value;
  };

  const maskDocument = (value: string) => {
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return value.slice(0, 18);
  };

  if (loading)
    return (
      <div className="p-[20px] text-center font-medium text-slate-500">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#E6E6E6] flex gap-6 relative rounded-[20px]">
      <main className="flex-1 flex flex-col">
        <CustomerTable
          customers={customers}
          onSelect={(c: any) => setSelectedCustomer(c)}
          selectedId={selectedCustomer?.id}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteClick}
          openCreate={handleOpenCreate}
        />
      </main>

      <CustomerViewModal
        open={!!selectedCustomer}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onEdit={handleOpenEdit}
      />

      {notify && (
        <div className="fixed bottom-10 right-10 z-[9999] animate-toast">
          <div
            className={`relative flex items-center gap-4 px-6 py-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] min-w-[350px] overflow-hidden ${notify.type === "success"
              ? "bg-[#1B2559] text-white"
              : "bg-white text-red-600 border border-red-100"
              }`}
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${notify.type === "success"
                ? "bg-[#5C67FF]/20 text-[#5C67FF]"
                : "bg-red-50 text-red-500"
                }`}
            >
              {notify.type === "success" ? (
                <CheckCircle2 size={28} />
              ) : (
                <AlertCircle size={28} />
              )}
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold uppercase opacity-60">
                {notify.type === "success" ? "Sucesso" : "Erro"}
              </span>
              <span className="text-sm font-bold">{notify.msg}</span>
            </div>

            <button onClick={() => setNotify(null)}>
              <X size={18} />
            </button>

            <div
              className={`absolute bottom-0 left-0 h-1.5 progress-bar-active ${notify.type === "success"
                ? "bg-[#5C67FF]"
                : "bg-red-500"
                }`}
            />
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
                {editingCustomer ? "Editar Cliente" : "Novo Cliente"}
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
                  placeholder="Digite o nome"
                  value={form.nome}
                  onChange={(e) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite o email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Telefone</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  placeholder="(99) 99999-9999"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefone: maskPhone(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Documento</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
                  placeholder="CPF ou CNPJ"
                  value={form.documento}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      documento: maskDocument(e.target.value),
                    })
                  }
                />
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
                {editingCustomer ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <Trash2 size={20} />
              </div>
              <h2 className="text-lg font-bold">Confirmar exclusão</h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.
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