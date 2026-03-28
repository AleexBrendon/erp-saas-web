import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import FinancialList from "../../components/financeiro/FinancialList";
import FinancialModal from "../../components/financeiro/FinancialModal";
import { getFinanceiro, createFinanceiro, updateFinanceiro, deleteFinanceiro, type FinanceiroItem } from "../../storage/financialStorage";

export default function FinanceiroPage() {
  const [items, setItems] = useState<FinanceiroItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<FinanceiroItem | null>(null);

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
    <div className="p-[20px] bg-[#F8F9FD] min-h-screen">
      <h1 className="text-title font-bold mb-[20px] text-colortitle">Financeiro</h1>

      <button
        onClick={() => { setEditData(null); setModalOpen(true); }}
        className="flex items-center justify-center bg-[#5C67FF] hover:bg-[#4a54e1] text-white px-6 py-2.5 rounded-[5px] text-sm font-medium transition-all shadow-md mb-4"
      >
        <Plus size={18} />
        Novo Lançamento
      </button>

      <div className="bg-white rounded-[5px] border shadow p-[20px]">
        <FinancialList items={items} onEdit={(item) => { setEditData(item); setModalOpen(true); }} onDelete={remove} />
      </div>

      {modalOpen && (
        <FinancialModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={save} editData={editData} />
      )}
    </div>
  );
}