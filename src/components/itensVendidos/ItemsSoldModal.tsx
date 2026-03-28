import { useEffect, useState } from "react";
import { X } from "lucide-react";
//import SmartSelect from "../../components/itensVendidos/SmartSelect";
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

  // 🔵 carregar vendas
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

  // ✏️ preencher edição
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* CONTAINER */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl 
                  animate-[fadeIn_.2s_ease,scaleIn_.2s_ease]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
            {editData ? "Editar item da venda" : "Adicionar item"}
          </h2>

          <X
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition"
          />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* VENDA */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Venda
            </label>
            <select
              autoFocus
              value={form.venda_id}
              onChange={(e) =>
                setForm({ ...form, venda_id: Number(e.target.value) })
              }
              className="w-full border rounded-xl px-3 py-2.5 text-sm 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     outline-none transition"
            >
              <option value="">Selecione uma venda</option>
              {vendas.map((v) => (
                <option key={v.id} value={v.id}>
                  Venda #{v.id}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUTO */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Produto
            </label>
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
              className="w-full border rounded-xl px-3 py-2.5 text-sm 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     outline-none transition"
            >
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {/* SERVIÇO */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Serviço
            </label>
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
              className="w-full border rounded-xl px-3 py-2.5 text-sm 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     outline-none transition"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>

          {/* QTD + PREÇO */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Quantidade
              </label>
              <input
                type="number"
                value={form.quantidade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantidade: Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl px-3 py-2.5 text-sm
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Preço unitário
              </label>
              <input
                type="number"
                value={form.preco_unitario}
                onChange={(e) =>
                  setForm({
                    ...form,
                    preco_unitario: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-3 py-2.5 text-sm
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition"
              />
            </div>

          </div>

          {/* TOTAL */}
          <div className="flex items-center justify-between 
                      bg-gradient-to-r from-indigo-50 to-indigo-100 
                      border border-indigo-200 
                      px-4 py-3 rounded-xl">

            <span className="text-sm font-medium text-indigo-700">
              Total calculado
            </span>

            <span className="text-xl font-semibold text-indigo-800 tracking-tight">
              R$ {total.toFixed(2)}
            </span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t">

          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2.5 text-sm 
                   hover:bg-gray-50 active:scale-[0.98] transition"
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm
                   hover:bg-indigo-700 active:scale-[0.98] transition"
          >
            Salvar item
          </button>

        </div>
      </div>
    </div>
  );
}