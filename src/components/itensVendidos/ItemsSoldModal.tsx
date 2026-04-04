import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCatalogos } from "../../hooks/useCatalogos";
import { api } from "../../api/axios";

export default function ItemVendaModal({
  open,
  onClose,
  onSave,
  editData,
}: any) {
  const { produtos, servicos } = useCatalogos();

  const [vendas, setVendas] = useState<any[]>([]);

  const [form, setForm] = useState({
    venda_id: "" as number | "",
    produto_id: "" as number | "",
    servico_id: "" as number | "",
    quantidade: 1,
    preco_unitario: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/vendas");
        setVendas(res.data);
      } catch (err) {
        console.error("Erro ao carregar vendas:", err);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        venda_id: editData.venda_id || "",
        produto_id: editData.produto_id || "",
        servico_id: editData.servico_id || "",
        quantidade: editData.quantidade || 1,
        preco_unitario: editData.preco || "",
      });
    } else {
      setForm({
        venda_id: "",
        produto_id: "",
        servico_id: "",
        quantidade: 1,
        preco_unitario: "",
      });
    }
  }, [editData, open]);

  if (!open) return null;

  // 💾 salvar
  const submit = () => {
    if (!form.venda_id) {
      alert("Selecione uma venda");
      return;
    }

    if (!form.produto_id && !form.servico_id) {
      alert("Selecione um produto ou serviço");
      return;
    }

    onSave({
      venda_id: Number(form.venda_id),
      produto_id: form.produto_id || null,
      servico_id: form.servico_id || null,
      quantidade: Number(form.quantidade),
      preco_unitario: Number(form.preco_unitario),
    });
  };

  const total =
    Number(form.quantidade || 0) * Number(form.preco_unitario || 0);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95"
      >

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editData ? "Editar item da venda" : "Adicionar item"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-500">Venda</label>
            <select
              autoFocus
              value={form.venda_id}
              onChange={(e) =>
                setForm({ ...form, venda_id: Number(e.target.value) })
              }
              className="w-full border rounded-lg px-3 py-2 mt-1 
                     focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Selecione uma venda</option>
              {vendas.map((v) => (
                <option key={v.id} value={v.id}>
                  Venda #{v.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Produto</label>
            <select
              value={form.produto_id}
              onChange={(e) => {
                const id = Number(e.target.value);
                const produto = produtos.find((p) => p.id === id);

                setForm({
                  ...form,
                  produto_id: id,
                  servico_id: "",
                  preco_unitario: produto?.preco ?? "",
                  quantidade: 1,
                });
              }}
              className="w-full border rounded-lg px-3 py-2 mt-1 
                     focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Serviço</label>
            <select
              value={form.servico_id}
              onChange={(e) => {
                const id = Number(e.target.value);
                const servico = servicos.find((s) => s.id === id);

                setForm({
                  ...form,
                  servico_id: id,
                  produto_id: "",
                  preco_unitario: servico?.preco ?? "",
                  quantidade: 1,
                });
              }}
              className="w-full border rounded-lg px-3 py-2 mt-1 
                     focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="text-sm text-gray-500">Quantidade</label>
              <input
                type="number"
                value={form.quantidade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantidade: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1
                       focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Preço unitário</label>
              <input
                type="number"
                value={form.preco_unitario}
                onChange={(e) =>
                  setForm({
                    ...form,
                    preco_unitario: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1
                       focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          <div
            className="flex items-center justify-between 
                   bg-gradient-to-r from-indigo-50 to-indigo-100 
                   border border-indigo-200 
                   px-4 py-3 rounded-xl"
          >
            <span className="text-lg font-semibold text-indigo-700">
              Total calculado
            </span>

            <span className="text-2xl font-bold text-indigo-800">
              R$ {total.toFixed(2)}
            </span>
          </div>

        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            className="flex-1 border border-indigo-500 text-indigo-500 py-2 rounded-lg"
          >
            Salvar item
          </button>
        </div>
      </div>
    </div>
  );
}