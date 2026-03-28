import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  getItensVendidos,
  createItemVenda,
  updateItemVenda,
  deleteItemVenda,
  type ItemVenda,
} from "../../storage/itemsSoldStorage";

import ItemVendaList from "../../components/itensVendidos/ItemsSoldList";
import ItemVendaModal from "../../components/itensVendidos/ItemsSoldModal";

export default function ItensVendaPage() {
  const [items, setItems] = useState<ItemVenda[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<ItemVenda | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getItensVendidos();
      setItems(data);
    } catch (err) {
      console.error("Erro ao carregar itens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const save = async (data: any) => {
    try {
      if (editData?.id) {
        await updateItemVenda(editData.id, data);
      } else {
        await createItemVenda(data);
      }

      await loadAll();
      setModalOpen(false);
      setEditData(null);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteItemVenda(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Itens da Venda</h1>

        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} />
          Novo Item
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">
          Carregando itens...
        </div>
      ) : (
        <ItemVendaList
          items={items}
          onEdit={(item) => {
            setEditData(item);
            setModalOpen(true);
          }}
          onDelete={remove}
        />
      )}

      {modalOpen && (
        <ItemVendaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={save}
          editData={editData}
        />
      )}
    </div>
  );
}