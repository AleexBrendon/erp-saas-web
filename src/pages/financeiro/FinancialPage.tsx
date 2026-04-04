import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import FinancialList from "../../components/financeiro/FinancialList";
import FinancialModal from "../../components/financeiro/FinancialModal";
import { getFinanceiro, createFinanceiro, updateFinanceiro, deleteFinanceiro, type FinanceiroItem } from "../../storage/financialStorage";
import FinanceiroViewModal from "../../components/financeiro/FinanceiroViewModal";

export default function FinanceiroPage() {
  const [items, setItems] = useState<FinanceiroItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<FinanceiroItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<FinanceiroItem | null>(null);

  const loadAll = async () => {
    const data = await getFinanceiro();
    setItems(data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const save = async (data: any) => {
    if (editData?.id) {
      await updateFinanceiro(editData.id, data);
    } else {
      await createFinanceiro(data);
    }
    await loadAll();
    setModalOpen(false);
    setEditData(null);
  };

  const remove = async (id: number) => {
    await deleteFinanceiro(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-[20px]">
        <h1 className="text-title font-bold mb-[20px] ml-[30px] text-colortitle">Financeiro</h1>

        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2 mb-[20px]"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>
      <div className="p-[20px] bg-[#F8F9FD] min-h-screen">

        <div className="bg-white rounded-[5px] border shadow p-[20px]">
          <FinancialList
            items={items}
            onEdit={(item) => {
              setEditData(item);
              setModalOpen(true);
            }}
            onDelete={remove}
            onSelect={setSelectedItem}
          />

          <FinanceiroViewModal
            open={!!selectedItem}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={(item) => {
              setSelectedItem(null);
              setEditData(item);
              setModalOpen(true);
            }}
          />
        </div>

        {modalOpen && (
          <FinancialModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={save} editData={editData} />
        )}
      </div>
    </div>
  );
}